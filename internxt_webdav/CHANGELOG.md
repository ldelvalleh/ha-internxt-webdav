# Changelog

## 1.0.0

First stable release.

- Reliable large backups: multipart uploads run three 15 MB parts at a time with
  bounded retries for transient network errors, so a single dropped connection no
  longer aborts a whole backup.
- Built on the official `internxt/webdav:v1.6.7` image; the build fails safely if
  the upstream upload source changes.
- Complete Home Assistant setup guide in English and Spanish, including the WebDAV
  integration and backup location.
- Persistent Internxt CLI state under `/data`, sensitive-value redaction in the
  logs, and a health check that never prints the account email.
- Supports `amd64` and `aarch64`.

## 0.0.5

- Reduced large multipart uploads from ten to three simultaneous 15 MB parts.
- Added bounded retries for transient network failures during multipart uploads.
- Verified a 915.96 MB synthetic upload and subsequent deletion.
- Made the image build fail safely if the pinned Internxt v1.6.7 upload source
  changes.

## 0.0.4

- Changed the Unix home directory for the container user to `/data`, matching
  how the official Internxt CLI resolves its state directory.
- Added a compatibility link from the upstream hard-coded
  `/root/.internxt-cli` path to persistent storage at `/data/.internxt-cli`.

## 0.0.3

- Redirected the Internxt CLI home, logs, cache, configuration, and PM2 state
  from the protected `/root` directory to persistent app storage under `/data`.
- Added startup preparation and regression tests for the writable runtime
  directories.

## 0.0.2

- Corrected Spanish translation encoding.
- Added complete English and Spanish documentation.

## 0.0.1

- First experimental spike.
- Support for amd64 and aarch64.
- Home Assistant UI configuration for Internxt and local WebDAV credentials.
- Temporary 2FA code and unattended OTP secret support.
- Authenticated WebDAV server on internal port 3005.
- Sensitive-value redaction for the official Internxt process logs.
