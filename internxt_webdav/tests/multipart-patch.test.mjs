import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const multipart = await readFile(
  new URL("../patches/multipart.js", import.meta.url),
  "utf8",
);

test("limits large uploads to three simultaneous 15 MB parts", () => {
  assert.match(multipart, /const concurrency = 3;/);
  assert.doesNotMatch(multipart, /const concurrency = 10;/);
  assert.match(multipart, /const partLength = 15 \* 1024 \* 1024;/);
});

test("retries only bounded transient multipart failures", () => {
  assert.match(multipart, /RETRY_DELAYS_MS = \[1000, 3000, 7000\]/);
  assert.match(multipart, /ETIMEDOUT/);
  assert.match(multipart, /UND_ERR_CONNECT_TIMEOUT/);
  assert.match(multipart, /attempt >= RETRY_DELAYS_MS\.length/);
  assert.match(multipart, /!RETRYABLE_ERROR_CODES\.has\(code\)/);
});

test("reuses the encrypted part buffer without changing encryption code", () => {
  assert.match(multipart, /body: partStream\.stream/);
  assert.match(multipart, /return await uploadPartOnce/);
  assert.doesNotMatch(multipart, /encrypt|decrypt/i);
});