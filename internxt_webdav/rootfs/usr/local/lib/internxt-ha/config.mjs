import { Transform } from "node:stream";

export class ConfigurationError extends Error {}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ConfigurationError(`Missing required option: ${field}`);
  }

  return value;
}

function optionalString(value) {
  return typeof value === "string" ? value : "";
}

export function buildEnvironment(options, baseEnvironment = {}) {
  const protocol = options.protocol ?? "https";

  if (protocol !== "http" && protocol !== "https") {
    throw new ConfigurationError("Invalid protocol; expected http or https");
  }

  return {
    ...baseEnvironment,
    INXT_USER: requiredString(options.email, "email"),
    INXT_PASSWORD: requiredString(options.password, "password"),
    INXT_TWOFACTORCODE: optionalString(options.two_factor_code),
    INXT_OTPTOKEN: optionalString(options.otp_secret),
    WEBDAV_PORT: "3005",
    WEBDAV_PROTOCOL: protocol,
    WEBDAV_CUSTOM_AUTH: "true",
    WEBDAV_USERNAME: requiredString(options.webdav_username, "webdav_username"),
    WEBDAV_PASSWORD: requiredString(options.webdav_password, "webdav_password"),
    WEBDAV_KEEPALIVE_ENABLED: "true",
  };
}

export function sensitiveValues(options) {
  return [
    options.email,
    options.password,
    options.two_factor_code,
    options.otp_secret,
    options.webdav_username,
    options.webdav_password,
  ]
    .filter((value) => typeof value === "string" && value.length > 0)
    .sort((left, right) => right.length - left.length);
}

function redact(value, secrets) {
  let result = value;

  for (const secret of secrets) {
    result = result.replaceAll(secret, "[REDACTED]");
  }

  return result;
}

export function createRedactionTransform(secrets) {
  let pending = "";

  return new Transform({
    transform(chunk, _encoding, callback) {
      pending += chunk.toString("utf8");
      let newlineIndex;

      while ((newlineIndex = pending.indexOf("\n")) !== -1) {
        const line = pending.slice(0, newlineIndex + 1);
        pending = pending.slice(newlineIndex + 1);
        this.push(redact(line, secrets));
      }

      callback();
    },
    flush(callback) {
      this.push(redact(pending, secrets));
      callback();
    },
  });
}
