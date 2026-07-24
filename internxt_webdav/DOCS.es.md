# Documentación de Internxt WebDAV

[English](DOCS.md) | [Español](DOCS.es.md)

## Antes de comenzar

Esta es una versión experimental `0.0.3` para Home Assistant OS. Utiliza una
cuenta de Internxt destinada a desarrollo. No uses una cuenta principal hasta
que la aplicación haya superado una revisión de seguridad y las pruebas de
compatibilidad con copias de seguridad.

La aplicación utiliza la imagen oficial `internxt/webdav:v1.6.7`. El cifrado,
descifrado, las subidas y las descargas permanecen íntegramente dentro del
software de Internxt.

## Instalación

1. Abre **Ajustes → Aplicaciones → Tienda de aplicaciones**.
2. Abre el menú de tres puntos y selecciona **Repositorios**.
3. Añade:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

4. Actualiza la tienda e instala **Internxt WebDAV (experimental)**.

Para desarrollo local, copia `internxt_webdav` en `/addons/internxt_webdav`,
comenta la línea `image` de `config.yaml` y actualiza la tienda.

## Configuración

- **Correo y contraseña de Internxt:** credenciales de la cuenta de desarrollo.
- **Código 2FA temporal:** código actual; caduca y debe sustituirse después de
  cada reinicio.
- **Secreto OTP:** secreto base32 que permite a Internxt generar nuevos códigos
  2FA. Es la opción recomendada para funcionamiento desatendido y debe
  protegerse como la contraseña de la cuenta.
- **Usuario y contraseña WebDAV locales:** credenciales independientes que solo
  se utilizan entre los clientes WebDAV y esta aplicación. No son las
  credenciales de Internxt.
- **Protocolo:** utiliza HTTPS. HTTP se reserva para diagnóstico en entornos
  aislados.

Cuando se configuran los dos métodos 2FA, el proceso oficial de Internxt da
prioridad al secreto OTP.

El puerto interno siempre es 3005. Si fuera necesario, cambia únicamente el
puerto publicado desde la sección **Red** de la aplicación.

## Arranque y comprobación inicial

Inicia la aplicación y revisa sus registros. Las credenciales y los
identificadores de cuenta no deben aparecer; cualquier coincidencia debe verse
como `[REDACTED]`.

En otro equipo de la misma red de confianza, define:

```sh
HA_URL="https://IP_DE_HOME_ASSISTANT:3005"
WEBDAV_USER="usuario-webdav-local"
WEBDAV_PASSWORD="contraseña-webdav-local"
```

El certificado HTTPS es autofirmado. La opción `-k` solo debe utilizarse para
esta prueba local de compatibilidad.

```sh
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X PROPFIND -H "Depth: 1" "$HA_URL/"
```

El resultado esperado es `HTTP/1.1 207 Multi-Status`.

Comprueba también que una petición sin autenticación sea rechazada:

```sh
curl -k -i -X PROPFIND -H "Depth: 1" "$HA_URL/"
```

Crea una carpeta y sube un archivo:

```sh
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X MKCOL "$HA_URL/HomeAssistantTest"

printf 'prueba\n' > prueba.txt
curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X PUT --data-binary @prueba.txt \
  "$HA_URL/HomeAssistantTest/prueba.txt"
```

Descarga y elimina el archivo:

```sh
curl -k -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  "$HA_URL/HomeAssistantTest/prueba.txt"

curl -k -i -u "$WEBDAV_USER:$WEBDAV_PASSWORD" \
  -X DELETE "$HA_URL/HomeAssistantTest/prueba.txt"
```

Confirma que el archivo aparece en Internxt Drive. Después reinicia la
aplicación y repite `PROPFIND`.

## Integración WebDAV de Home Assistant

La compatibilidad con copias sigue sin estar confirmada en esta versión, pero
la configuración prevista es:

- URL: `https://IP_DE_HOME_ASSISTANT:3005`
- Usuario: usuario WebDAV local configurado en la aplicación
- Contraseña: contraseña WebDAV local configurada en la aplicación
- Ruta de copias: una carpeta `HomeAssistant` creada previamente
- Verificar SSL: desactivado, debido al certificado local autofirmado

Crea inicialmente una copia manual pequeña con datos no esenciales. Conserva
el almacenamiento local como segundo destino, mantén el cifrado de las copias,
guarda el kit de emergencia y comprueba tanto la subida como la descarga antes
de confiar en WebDAV.

## Solución de problemas

- **Error de configuración:** completa todos los campos obligatorios. Nunca
  publiques `options.json` en una incidencia.
- **El acceso falla después de reiniciar:** sustituye el código 2FA caducado o
  configura el secreto OTP.
- **401 Unauthorized:** comprueba las credenciales WebDAV locales.
- **Error de certificado:** desactiva su verificación únicamente para este
  endpoint local autofirmado.
- **Puerto no disponible:** revisa el puerto publicado en la sección **Red**.
- **Sin Internet:** el proceso oficial comprueba la sesión y WebDAV cada 30
  segundos e intenta recuperarlos.
- **Fallo con archivos grandes:** reproduce primero el problema con un archivo
  pequeño y conserva los registros después de eliminar cualquier dato
  personal.

## Advertencias de seguridad

- No expongas el puerto 3005 mediante el router ni un proxy inverso público.
- Home Assistant guarda las opciones en `/data/options.json`; protege el acceso
  al host y a sus copias de seguridad.
- El secreto OTP puede permitir acceso desatendido a la cuenta de Internxt.
- No publiques credenciales, correo de la cuenta, registros con datos
  personales ni archivos de copia en incidencias de GitHub.
