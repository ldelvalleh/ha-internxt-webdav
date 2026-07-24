import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEnvironment,
  ConfigurationError,
  createRedactionTransform,
  sensitiveValues,
} from "../rootfs/usr/local/lib/internxt-ha/config.mjs";

const completeOptions = {
  email: "person@example.test",
  password: "internxt-password",
  two_factor_code: "123456",
  otp_secret: "BASE32OTPSECRET",
  webdav_username: "homeassistant",
  webdav_password: "local-webdav-password",
  protocol: "https",
};

test("maps Home Assistant options to the official Internxt environment", () => {
  const environment = buildEnvironment(completeOptions, { PATH: "/bin" });

  assert.equal(environment.PATH, "/bin");
  assert.equal(environment.INXT_USER, completeOptions.email);
  assert.equal(environment.INXT_PASSWORD, completeOptions.password);
  assert.equal(environment.INXT_TWOFACTORCODE, "123456");
  assert.equal(environment.INXT_OTPTOKEN, "BASE32OTPSECRET");
  assert.equal(environment.WEBDAV_PORT, "3005");
  assert.equal(environment.WEBDAV_PROTOCOL, "https");
  assert.equal(environment.WEBDAV_CUSTOM_AUTH, "true");
  assert.equal(environment.WEBDAV_USERNAME, "homeassistant");
  assert.equal(environment.WEBDAV_PASSWORD, "local-webdav-password");
  assert.equal(environment.WEBDAV_KEEPALIVE_ENABLED, "true");
});

test("uses empty optional 2FA values and the default protocol", () => {
  const environment = buildEnvironment({
    email: "person@example.test",
    password: "internxt-password",
    webdav_username: "homeassistant",
    webdav_password: "local-webdav-password",
  });

  assert.equal(environment.INXT_TWOFACTORCODE, "");
  assert.equal(environment.INXT_OTPTOKEN, "");
  assert.equal(environment.WEBDAV_PROTOCOL, "https");
});

test("rejects missing required values", () => {
  assert.throws(
    () => buildEnvironment({}),
    (error) =>
      error instanceof ConfigurationError &&
      error.message === "Missing required option: email",
  );
});

test("rejects unsupported protocols", () => {
  assert.throws(
    () => buildEnvironment({ ...completeOptions, protocol: "ftp" }),
    ConfigurationError,
  );
});

test("redacts sensitive values even when chunks split a secret", async () => {
  const secrets = sensitiveValues(completeOptions);
  const transform = createRedactionTransform(secrets);
  const chunks = [];

  transform.on("data", (chunk) => chunks.push(chunk));
  transform.write("Logging into person@exam");
  transform.write("ple.test with internxt-pass");
  transform.end("word and 123456\n");

  await new Promise((resolve, reject) => {
    transform.on("end", resolve);
    transform.on("error", reject);
  });

  const output = Buffer.concat(chunks).toString("utf8");
  assert.equal(
    output,
    "Logging into [REDACTED] with [REDACTED] and [REDACTED]\n",
  );

  for (const secret of secrets) {
    assert.equal(output.includes(secret), false);
  }
});
