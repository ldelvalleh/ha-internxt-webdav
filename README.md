# Internxt WebDAV for Home Assistant

[English](README.md) | [Español](README.es.md)

Experimental Home Assistant OS app that runs the official
[`internxt/webdav`](https://hub.docker.com/r/internxt/webdav) image and adapts
Home Assistant's visual configuration to the environment variables expected by
Internxt.

The project is intended to make Internxt Drive usable as a WebDAV backup
location for Home Assistant. Backup compatibility is not considered proven
until the 0.1.0 acceptance tests have passed.

> [!WARNING]
> This is experimental community software. It is not an official Internxt or
> Home Assistant project and is not endorsed by either organization.

## Spike status

Version `0.0.3` has a deliberately narrow goal:

1. Install on Home Assistant OS.
2. Start the official Internxt WebDAV server.
3. Answer an authenticated `PROPFIND`.
4. Upload and retrieve a test file.
5. Continue working after an app restart.

Supported architectures:

- `amd64`
- `aarch64`

The app pins `internxt/webdav:v1.6.7`; it does not implement encryption,
WebDAV, or Internxt uploads itself.

## Installation

Add this repository to the Home Assistant app store:

```text
https://github.com/ldelvalleh/ha-internxt-webdav
```

Detailed setup, testing, 2FA, and security instructions are in
[`internxt_webdav/DOCS.md`](internxt_webdav/DOCS.md).

## Security

- WebDAV requires separate local credentials.
- Port 3005 is intended for the trusted local network only.
- Never forward port 3005 from a router.
- Use a dedicated Internxt development account while this app is experimental.
- Treat the Internxt password and OTP secret as account credentials.

## License

Apache License 2.0. See [LICENSE](LICENSE).
