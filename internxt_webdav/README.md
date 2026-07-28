# Internxt WebDAV

[English](README.md) | [Español](README.es.md)

Home Assistant app that runs the official Internxt WebDAV server, configured from
the Home Assistant interface, so you can use **Internxt Drive** as a backup
location for the built-in backup system.

Supports `amd64` and `aarch64`, separate local WebDAV authentication, temporary
2FA codes, and unattended OTP secrets. Large backups upload reliably thanks to a
multipart transport fix (smaller parallel bursts and automatic retries).

Independent open-source project — it runs Internxt's official software but is not
an official Internxt or Home Assistant product. See [DOCS.md](DOCS.md) to get
started.
