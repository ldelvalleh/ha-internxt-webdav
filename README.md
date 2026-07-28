<p align="center">
  <img src="internxt_webdav/logo.png" alt="Internxt WebDAV for Home Assistant" height="96">
</p>

# Internxt for Home Assistant

[English](README.md) | [Español](README.es.md)

[![Add repository to my Home Assistant][my-ha-shield]][my-ha]

[![License: Apache 2.0][license-shield]][license]
[![Supports amd64][amd64-shield]](#)
[![Supports aarch64][aarch64-shield]](#)
[![Maintained][maintained-shield]][issues]

Custom [Home Assistant](https://www.home-assistant.io) app by [Luis del Valle][author].

## Apps

### <img src="internxt_webdav/icon.png" alt="" height="20" align="top"> [Internxt WebDAV](./internxt_webdav) &nbsp; ![Version][version-shield]

Back up Home Assistant to **[Internxt Drive](https://internxt.com)** — private, end-to-end encrypted cloud storage. Runs the official Internxt WebDAV server on Home Assistant's internal network, ready to plug into the core WebDAV integration and the built-in backup system.

Built on the official `internxt/webdav` image, with a transport fix that makes **large backups upload reliably** (smaller parallel bursts and automatic retries).

[📖 Documentation](./internxt_webdav/DOCS.md) · [📝 Changelog](./internxt_webdav/CHANGELOG.md)

## Installation

1. Click the **Add repository** button above, or go to **Settings → Apps → App store**, open the **⋯** menu → **Repositories**, and paste:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

2. The app appears at the bottom of the store — install it, fill in your Internxt and local WebDAV credentials, and start it.
3. Connect it to Home Assistant's WebDAV integration and choose it as a backup location. Full step-by-step in the [documentation](./internxt_webdav/DOCS.md#connect-the-home-assistant-webdav-integration).

## Security

- WebDAV uses **separate local credentials** — never your Internxt password.
- Port 3005 is for your trusted local network only. **Never forward it on a router.**
- Keep Home Assistant backup **encryption enabled** and store the emergency kit somewhere safe.
- Treat the Internxt password and OTP secret as account credentials.

## Not affiliated with Internxt or Home Assistant

This is an independent, open-source project. It runs Internxt's official software but is not an official Internxt or Home Assistant product and is not endorsed by either.

## License

Apache License 2.0 © Luis del Valle. See [LICENSE](LICENSE).

[author]: https://github.com/ldelvalleh
[issues]: https://github.com/ldelvalleh/ha-internxt-webdav/issues
[license]: ./LICENSE
[my-ha]: https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fldelvalleh%2Fha-internxt-webdav
[my-ha-shield]: https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg
[license-shield]: https://img.shields.io/badge/license-Apache%202.0-brightgreen.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[maintained-shield]: https://img.shields.io/badge/maintained-yes-brightgreen.svg
[version-shield]: https://img.shields.io/badge/version-1.0.0-blue.svg
