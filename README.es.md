# Internxt WebDAV para Home Assistant

[English](README.md) | [Español](README.es.md)

Aplicación experimental para Home Assistant OS que ejecuta la imagen oficial
[`internxt/webdav`](https://hub.docker.com/r/internxt/webdav) y adapta la
configuración visual de Home Assistant a las variables de entorno de Internxt.

El objetivo es utilizar Internxt Drive como ubicación WebDAV para las copias de
seguridad de Home Assistant. Esta compatibilidad no se considerará confirmada
hasta superar las pruebas de aceptación de la versión 0.1.0.

> [!WARNING]
> Este es un proyecto comunitario experimental. No es una aplicación oficial de
> Internxt ni de Home Assistant y no está respaldada por ninguna de las dos
> organizaciones.

## Estado del spike

La versión `0.0.3` tiene un objetivo deliberadamente limitado:

1. Instalarse en Home Assistant OS.
2. Arrancar el servidor WebDAV oficial de Internxt.
3. Responder a una petición `PROPFIND` autenticada.
4. Subir y descargar un archivo de prueba.
5. Continuar funcionando después de reiniciar la aplicación.

Arquitecturas compatibles:

- `amd64`
- `aarch64`

La aplicación fija `internxt/webdav:v1.6.7`; no implementa por sí misma el
cifrado, WebDAV ni las subidas a Internxt.

## Instalación

Añade este repositorio a la tienda de aplicaciones de Home Assistant:

```text
https://github.com/ldelvalleh/ha-internxt-webdav
```

Consulta [`internxt_webdav/DOCS.es.md`](internxt_webdav/DOCS.es.md) para ver la
configuración, las pruebas, el funcionamiento del 2FA y las advertencias de
seguridad.

## Seguridad

- WebDAV exige credenciales locales independientes.
- El puerto 3005 solo debe utilizarse en una red local de confianza.
- No abras ni redirijas el puerto 3005 en el router.
- Durante la fase experimental, utiliza una cuenta específica de Internxt.
- Protege la contraseña y el secreto OTP como credenciales de la cuenta.

## Licencia

Apache License 2.0. Consulta [LICENSE](LICENSE).
