# Internxt WebDAV — documentation

[English](DOCS.md) | [Español](DOCS.es.md)

Use **Internxt Drive** as a backup location for Home Assistant. This app runs the
official `internxt/webdav:v1.6.7` server inside Home Assistant and exposes it to
the core **WebDAV** integration.

## Before you begin

All encryption, decryption, uploads, and downloads happen inside Internxt's own
software. This app only wires it into Home Assistant and makes large uploads
reliable (reduced multipart concurrency + automatic retries).

The Internxt session is stored in the app configuration and is included inside
full Home Assistant backups. For that reason, use a **strong, unique password**
for your Internxt account — not one you reuse elsewhere. If you want extra
isolation, use a dedicated Internxt account.

## 1. Install

1. Open **Settings → Apps → App store**.
2. Open the **⋯** menu and choose **Repositories**.
3. Add:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

4. Refresh the store and install **Internxt WebDAV**.

## 2. Configure

| Option | What to enter |
| --- | --- |
| **Internxt email / password** | Your Internxt account credentials. |
| **Temporary 2FA code** | Only if your account has 2FA and you have not set an OTP secret. It expires and must be replaced after every restart. |
| **OTP secret** | Base32 secret so Internxt can generate 2FA codes automatically (recommended for unattended use). Protect it like the account password. |
| **Local WebDAV username / password** | Credentials you invent here, used only between Home Assistant and this app. **They are not your Internxt credentials.** |
| **Protocol** | Leave on **HTTPS**. HTTP is only for isolated troubleshooting. |

Start the app and check its log. Your account email and credentials must appear
only as `[REDACTED]`. The internal port is always **3005**; enabling the add-on
**Watchdog** is recommended so an expired session heals itself.

## Connect the Home Assistant WebDAV integration

Once the app is running, connect Home Assistant's built-in WebDAV integration.

1. Go to **Settings → Devices & services**.
2. Click **Add integration** (bottom right) and search for **WebDAV**.
3. Fill in the dialog:
   - **URL**: `https://<HOME_ASSISTANT_IP>:3005` — use your Home Assistant IP address; the port is always `3005`. (If you switched the protocol to HTTP for local testing, use `http://` instead.)
   - **Username**: the **local WebDAV username** you set in the app (not your Internxt email).
   - **Password**: the **local WebDAV password** you set in the app.
   - **Verify SSL certificate**: **turn this OFF**. The app serves a self-signed local certificate, so verification would fail.
   - **Path** (if asked): `/HomeAssistant` — the folder where your backups will live. It is created automatically if it does not exist.
4. Click **Submit**. Home Assistant confirms the connection and adds a WebDAV entry.

## Choose Internxt as a backup location

1. Go to **Settings → System → Backups**.
2. Open the locations menu (**⋯**, top right) → **Add location** → select the **WebDAV** location you just created.
3. Keep a **local** backup as a second location too — don't rely on a single copy.
4. Keep **backup encryption** enabled, and save the emergency kit / encryption
   key somewhere **outside** Home Assistant. Without it, a backup cannot be
   restored.

## Create your first backup

1. In **Settings → System → Backups**, click **Create backup**. A partial backup
   is a good, quick first test.
2. When it finishes, open **Internxt Drive** and confirm the `.tar` file is there
   with its date and size.
3. Back in Home Assistant, the backup is listed on the WebDAV location and is
   ready to restore.

## Troubleshooting

- **Configuration error:** fill in every required field. Never paste
  `options.json` into an issue.
- **Login fails after a restart:** replace the expired temporary 2FA code, or set
  the OTP secret for unattended re-login.
- **401 Unauthorized:** check the separate local WebDAV username and password.
- **Certificate error:** turn off certificate verification — the local endpoint
  is self-signed on purpose.
- **Port unavailable:** check the published port in the app's **Network** section.
- **Large backup upload fails:** uploads already run with reduced concurrency and
  automatic retries, so this is rare. Retry once; if it persists, it usually
  points to the local network/router dropping bursts of connections. Keep the
  Home Assistant and app logs (with personal data removed) if you open an issue.

## Security

- Never expose port 3005 through a router or a public reverse proxy.
- Home Assistant stores app options in `/data/options.json`; protect access to
  the Home Assistant host and its backups.
- The OTP secret can enable unattended access to the Internxt account.
- Do not include credentials, your account email, logs with personal data, or
  backup files in GitHub issues.
