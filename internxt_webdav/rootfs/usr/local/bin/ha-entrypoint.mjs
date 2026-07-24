#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import {
  buildEnvironment,
  ConfigurationError,
  createRedactionTransform,
  prepareRuntimeDirectories,
  sensitiveValues,
} from "../lib/internxt-ha/config.mjs";

const OPTIONS_PATH = "/data/options.json";

async function readOptions() {
  try {
    return JSON.parse(await readFile(OPTIONS_PATH, "utf8"));
  } catch {
    console.error(`[Internxt] Unable to read valid JSON from ${OPTIONS_PATH}.`);
    process.exit(78);
  }
}

const options = await readOptions();
let environment;

try {
  environment = buildEnvironment(options, process.env);
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.error(`[Internxt] ${error.message}`);
    process.exit(78);
  }

  console.error("[Internxt] Unexpected configuration error.");
  process.exit(78);
}

try {
  await prepareRuntimeDirectories();
} catch {
  console.error("[Internxt] Unable to prepare persistent runtime directories.");
  process.exit(78);
}

if (environment.INXT_OTPTOKEN && environment.INXT_TWOFACTORCODE) {
  console.warn(
    "[Internxt] Both OTP secret and temporary 2FA code are configured; " +
      "the official Internxt process will prioritize the OTP secret.",
  );
}

const command = process.argv.slice(2);

if (command.length === 0) {
  console.error("[Internxt] The original Internxt command was not provided.");
  process.exit(78);
}

console.log("[Internxt] Starting the official Internxt WebDAV server.");
console.log(`[Internxt] Protocol: ${environment.WEBDAV_PROTOCOL}`);
console.log("[Internxt] Internal port: 3005");
console.log("[Internxt] Local WebDAV authentication: enabled");
console.log("[Internxt] Credentials and account identifiers will be redacted.");

const child = spawn(command[0], command.slice(1), {
  env: environment,
  stdio: ["ignore", "pipe", "pipe"],
});

const secrets = sensitiveValues(options);
child.stdout
  .pipe(createRedactionTransform(secrets))
  .pipe(process.stdout, { end: false });
child.stderr
  .pipe(createRedactionTransform(secrets))
  .pipe(process.stderr, { end: false });

for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.on(signal, () => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
}

child.on("error", () => {
  console.error("[Internxt] Failed to start the official WebDAV process.");
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.log(`[Internxt] Official process stopped by ${signal}.`);
    process.exit(0);
  }

  process.exit(code ?? 1);
});
