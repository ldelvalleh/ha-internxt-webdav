<p align="center">
  <img src="internxt_webdav/logo.png" alt="Internxt WebDAV para Home Assistant" height="96">
</p>

# Internxt para Home Assistant

[English](README.md) | [Español](README.es.md)

[![Añadir repositorio a mi Home Assistant][my-ha-shield]][my-ha]

[![Licencia: Apache 2.0][license-shield]][license]
[![Compatible amd64][amd64-shield]](#)
[![Compatible aarch64][aarch64-shield]](#)
[![Mantenido][maintained-shield]][issues]

Aplicación para [Home Assistant](https://www.home-assistant.io) de [Luis del Valle][author].

## Aplicaciones

### <img src="internxt_webdav/icon.png" alt="" height="20" align="top"> [Internxt WebDAV](./internxt_webdav) &nbsp; ![Versión][version-shield]

Haz copias de seguridad de Home Assistant en **[Internxt Drive](https://internxt.com)** — almacenamiento en la nube privado y cifrado de extremo a extremo. Ejecuta el servidor WebDAV oficial de Internxt dentro de la red interna de Home Assistant, listo para conectarlo con la integración WebDAV nativa y el sistema de copias integrado.

Basada en la imagen oficial `internxt/webdav`, con un arreglo de transporte que hace que **las copias grandes suban de forma fiable** (ráfagas paralelas más pequeñas y reintentos automáticos).

[📖 Documentación](./internxt_webdav/DOCS.es.md) · [📝 Cambios](./internxt_webdav/CHANGELOG.md)

## Instalación

1. Pulsa el botón **Añadir repositorio** de arriba, o ve a **Ajustes → Aplicaciones → Tienda de aplicaciones**, abre el menú **⋯** → **Repositorios** y pega:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

2. La aplicación aparece al final de la tienda: instálala, rellena tus credenciales de Internxt y las de WebDAV local, y arráncala.
3. Conéctala a la integración WebDAV de Home Assistant y elígela como ubicación de copias. Paso a paso completo en la [documentación](./internxt_webdav/DOCS.es.md#integración-webdav-de-home-assistant).

## Seguridad

- WebDAV usa **credenciales locales independientes**, nunca tu contraseña de Internxt.
- El puerto 3005 es solo para tu red local de confianza. **No lo abras en el router.**
- Mantén el **cifrado de las copias** de Home Assistant activado y guarda el kit de emergencia en lugar seguro.
- Trata la contraseña de Internxt y el secreto OTP como credenciales de la cuenta.

## Sin afiliación con Internxt ni Home Assistant

Es un proyecto independiente y de código abierto. Ejecuta el software oficial de Internxt, pero no es un producto oficial de Internxt ni de Home Assistant y ninguna de las dos lo respalda.

## Licencia

Apache License 2.0 © Luis del Valle. Consulta [LICENSE](LICENSE).

[author]: https://github.com/ldelvalleh
[issues]: https://github.com/ldelvalleh/ha-internxt-webdav/issues
[license]: ./LICENSE
[my-ha]: https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fldelvalleh%2Fha-internxt-webdav
[my-ha-shield]: https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg
[license-shield]: https://img.shields.io/badge/licencia-Apache%202.0-brightgreen.svg
[amd64-shield]: https://img.shields.io/badge/amd64-s%C3%AD-green.svg
[aarch64-shield]: https://img.shields.io/badge/aarch64-s%C3%AD-green.svg
[maintained-shield]: https://img.shields.io/badge/mantenido-s%C3%AD-brightgreen.svg
[version-shield]: https://img.shields.io/badge/versi%C3%B3n-1.0.0-blue.svg
