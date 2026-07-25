"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadParts = uploadParts;
const async_1 = require("async");
const logger_1 = require("../../utils/logger");
const undici_1 = require("undici");

const RETRY_DELAYS_MS = [1000, 3000, 7000];
const RETRYABLE_ERROR_CODES = new Set([
    "EAI_AGAIN",
    "ECONNRESET",
    "ENETDOWN",
    "ENETRESET",
    "ENETUNREACH",
    "EPIPE",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_SOCKET",
]);

function getErrorCode(error) {
    if (typeof error?.code === "string") {
        return error.code;
    }
    if (Array.isArray(error?.errors)) {
        for (const nestedError of error.errors) {
            const nestedCode = getErrorCode(nestedError);
            if (nestedCode) {
                return nestedCode;
            }
        }
    }
    return undefined;
}

function delay(milliseconds, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, milliseconds);
        signal?.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(signal.reason ?? new Error("Upload aborted"));
        }, { once: true });
    });
}

async function uploadPartOnce(partUrl, partStream, signal) {
    const { statusCode, headers, body } = await (0, undici_1.request)(partUrl, {
        signal,
        body: partStream.stream,
        method: "PUT",
        headers: {
            "Content-Length": partStream.size.toString(),
        },
    });
    if (statusCode !== 200) {
        throw new Error(`Failed to upload part: ${statusCode} ${await body.text()}`);
    }
    await body.dump();
    return headers.etag?.toString();
}

async function uploadPart(partUrl, partStream, signal) {
    for (let attempt = 0; ; attempt += 1) {
        try {
            return await uploadPartOnce(partUrl, partStream, signal);
        }
        catch (error) {
            const code = getErrorCode(error);
            if (signal?.aborted ||
                !RETRYABLE_ERROR_CODES.has(code) ||
                attempt >= RETRY_DELAYS_MS.length) {
                throw error;
            }
            const waitMilliseconds = RETRY_DELAYS_MS[attempt];
            logger_1.logger.warn("Transient multipart upload error %s; retrying part %s in %sms", code, partStream.index, waitMilliseconds);
            await delay(waitMilliseconds, signal);
        }
    }
}

async function uploadParts(partUrls, progress, signal) {
    const parts = [];
    const concurrency = 3;
    const partLength = 15 * 1024 * 1024;
    let bytesRead = 0;
    let partNumber = 1;
    let partChunks = [];
    let uploadPartError = null;
    const uploadQueue = (0, async_1.queue)(async (part) => {
        logger_1.logger.debug("Uploading part %s of %s => %s bytes", part.source.index, partUrls.length, part.source.size);
        const etag = await uploadPart(part.url, part.source, signal);
        if (!etag) {
            throw new Error("ETag header was not returned");
        }
        parts.push({ PartNumber: part.source.index, ETag: etag });
    }, concurrency);
    uploadQueue.error((err) => {
        uploadPartError = err;
    });
    for await (const chunk of progress) {
        if (uploadPartError)
            throw uploadPartError;
        bytesRead += chunk.length;
        partChunks.push(chunk);
        while (uploadQueue.running() >= concurrency) {
            await uploadQueue.unsaturated();
        }
        while (bytesRead >= partLength) {
            const partBuffer = Buffer.concat(partChunks);
            const slice = partBuffer.subarray(0, partLength);
            uploadQueue.push({
                url: partUrls[partNumber - 1],
                source: {
                    size: slice.length,
                    stream: slice,
                    index: partNumber,
                },
            });
            partChunks = [partBuffer.subarray(partLength)];
            bytesRead -= partLength;
            partNumber += 1;
        }
    }
    if (bytesRead > 0 && !uploadPartError) {
        const partBuffer = Buffer.concat(partChunks);
        uploadQueue.push({
            url: partUrls[partNumber - 1],
            source: {
                size: partBuffer.length,
                stream: partBuffer,
                index: partNumber,
            },
        });
    }
    while (!uploadPartError && (uploadQueue.running() > 0 || uploadQueue.length() > 0)) {
        await uploadQueue.drain();
    }
    if (uploadPartError) {
        throw uploadPartError;
    }
    return parts.sort((pA, pB) => pA.PartNumber - pB.PartNumber);
}
