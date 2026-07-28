# Internxt WebDAV

[English](README.md) | [Español](README.es.md)

Aplicación de Home Assistant que ejecuta el servidor WebDAV oficial de Internxt,
configurado desde la interfaz de Home Assistant, para que puedas usar **Internxt
Drive** como ubicación de las copias de seguridad del sistema integrado.

Compatible con `amd64` y `aarch64`, autenticación WebDAV local independiente,
códigos 2FA temporales y secretos OTP para funcionamiento desatendido. Las copias
grandes suben de forma fiable gracias a un arreglo de transporte multipart
(ráfagas paralelas más pequeñas y reintentos automáticos).

Proyecto independiente y de código abierto: ejecuta el software oficial de
Internxt, pero no es un producto oficial de Internxt ni de Home Assistant. Lee
[DOCS.es.md](DOCS.es.md) para empezar.
