# Internxt WebDAV app documentation

[English](DOCS.md) | [Español](DOCS.es.md)

## Before you begin

This is a `0.0.4` experimental spike for Home Assistant OS. Use a dedicated
Internxt development account. Do not use a primary account until the app has
completed a security review and the backup compatibility tests.

The app uses the official `internxt/webdav:v1.6.7` image. Encryption,
decryption, uploads, and downloads remain entirely inside Internxt software.

## Install

1. Open **Settings → Apps → App store**.
2. Open the three-dot menu and select **Repositories**.
3. Add:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

4. Refresh the store and install **Internxt WebDAV (experimental)**.

For local development, copy `internxt_webdav` to
`/addons/internxt_webdav`, comment out the `image` line in `config.yaml`, and
refresh the app store.

## Configure

- **Internxt email/password:** credentials for the dedicated Internxt account.
- **Temporary 2FA code:** current code; it expires and must be replaced after a
  restart.
- **OTP secret:** base32 secret that lets Internxt generate new 2FA codes.
  Prefer this for unattended operation and protect it like the account
  password.
- **Local WebDAV username/password:** separate credentials used only between
  WebDAV clients and this app. They are not Internxt credentials.
- **Protocol:** use HTTPS. HTTP is only for isolated troubleshooting.

When both 2FA fields are present, the official Internxt process prioritizes the
OTP secret.

The internal port is always 3005. If necessary, change only the published host
port in the app's **Network** section.

## Start and verify the spike

Start the app and review its log. Account identifiers and credentials should
appear only as `[REDACTED]`.

Set these shell variables on another trusted machine:

```sh
HA_URL="https://HOME_ASSISTANT_IP:3005"
WEBDAV_USER="your-local-webdav-user"
WEBDAV_PASSWORD="your-local-webdav-password"
```

The HTTPS certificate is self-signed. `-k` is appropriate only for this local
compatibility test.

```sh
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X PROPFIND -H "Depth: 1" "$HA_URL/"
```

Expected result: `HTTP/1.1 207 Multi-Status`.

Verify that an unauthenticated request is rejected:

```sh
curl -k -i -X PROPFIND -H "Depth: 1" "$HA_URL/"
```

Create a folder and upload a file:

```sh
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X MKCOL "$HA_URL/HomeAssistantTest"

printf 'test\n' > test.txt
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X PUT --data-binary @test.txt \
  "$HA_URL/HomeAssistantTest/test.txt"
```

Download and delete it:

```sh
curl -k -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  "$HA_URL/HomeAssistantTest/test.txt"

curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X DELETE "$HA_URL/HomeAssistantTest/test.txt"
```

Confirm the uploaded file appears in Internxt Drive, then restart the app and
repeat `PROPFIND`.

## Connect the Home Assistant WebDAV integration

Backup compatibility remains unverified in the spike, but the intended
configuration is:

- URL: `https://HOME_ASSISTANT_IP:3005`
- Username: the local WebDAV username configured above
- Password: the local WebDAV password configured above
- Backup path: a pre-created `HomeAssistant` folder
- Verify SSL: disabled because Internxt uses a self-signed local certificate

Create only a small manual backup with non-essential test data. Keep local
storage selected as a second destination, retain backup encryption, save the
emergency kit, and verify both upload and download before relying on WebDAV.

## Troubleshooting

- **Configuration error:** complete every required field. Never paste
  `options.json` into an issue.
- **Login fails after restart:** replace the expired temporary 2FA code or
  configure the OTP secret.
- **401 Unauthorized:** verify the separate local WebDAV credentials.
- **Certificate error:** disable certificate verification only for this
  self-signed local endpoint.
- **Port unavailable:** check the published port in the app's Network section.
- **No Internet:** the official process retries session and WebDAV health every
  30 seconds.
- **Large upload failure:** reproduce first with a small file and retain both
  Home Assistant and app logs after redacting personal data.

## Security warnings

- Never expose port 3005 through a router or public reverse proxy.
- Home Assistant stores app options in `/data/options.json`; protect access to
  the Home Assistant host and its backups.
- The OTP secret can enable unattended access to the Internxt account.
- Do not include credentials, account email, logs containing personal data, or
  backup files in GitHub issues.
