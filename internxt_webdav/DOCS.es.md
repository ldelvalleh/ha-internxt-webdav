# Internxt WebDAV — documentación

[English](DOCS.md) | [Español](DOCS.es.md)

Usa **Internxt Drive** como ubicación de copias de seguridad de Home Assistant.
Esta aplicación ejecuta el servidor oficial `internxt/webdav:v1.6.7` dentro de
Home Assistant y lo expone a la integración **WebDAV** nativa.

## Antes de empezar

Todo el cifrado, descifrado, subidas y descargas ocurren dentro del propio
software de Internxt. Esta aplicación solo lo integra en Home Assistant y hace
que las subidas grandes sean fiables (menos concurrencia multipart + reintentos
automáticos).

La sesión de Internxt se guarda en la configuración de la aplicación y **queda
incluida dentro de las copias completas** de Home Assistant. Por eso, usa una
contraseña **fuerte y única** para tu cuenta de Internxt, que no reutilices en
ningún otro sitio. Si quieres aislarla más, usa una cuenta de Internxt dedicada.

## 1. Instalación

1. Abre **Ajustes → Aplicaciones → Tienda de aplicaciones**.
2. Abre el menú **⋯** y elige **Repositorios**.
3. Añade:

   ```text
   https://github.com/ldelvalleh/ha-internxt-webdav
   ```

4. Actualiza la tienda e instala **Internxt WebDAV**.

## 2. Configuración

| Opción | Qué poner |
| --- | --- |
| **Correo y contraseña de Internxt** | Las credenciales de tu cuenta de Internxt. |
| **Código 2FA temporal** | Solo si tu cuenta tiene 2FA y no has puesto un secreto OTP. Caduca y hay que sustituirlo tras cada reinicio. |
| **Secreto OTP** | Secreto base32 para que Internxt genere los códigos 2FA solo (recomendado para funcionamiento desatendido). Protégelo como la contraseña. |
| **Usuario y contraseña WebDAV locales** | Credenciales que te inventas aquí, usadas solo entre Home Assistant y esta aplicación. **No son las de Internxt.** |
| **Protocolo** | Déjalo en **HTTPS**. HTTP solo para diagnóstico en entornos aislados. |

Arranca la aplicación y revisa su registro. Tu correo y tus credenciales deben
aparecer únicamente como `[REDACTED]`. El puerto interno siempre es **3005**; se
recomienda activar el **Watchdog** del complemento para que una sesión caducada
se recupere sola.

## Integración WebDAV de Home Assistant

Con la aplicación en marcha, conecta la integración WebDAV nativa de Home
Assistant.

1. Ve a **Ajustes → Dispositivos y servicios**.
2. Pulsa **Añadir integración** (abajo a la derecha) y busca **WebDAV**.
3. Rellena el diálogo:
   - **URL**: `https://<IP_DE_HOME_ASSISTANT>:3005` — usa la IP de tu Home Assistant; el puerto siempre es `3005`. (Si cambiaste el protocolo a HTTP para pruebas locales, usa `http://`.)
   - **Usuario**: el **usuario WebDAV local** que pusiste en la aplicación (no tu correo de Internxt).
   - **Contraseña**: la **contraseña WebDAV local** que pusiste en la aplicación.
   - **Verificar certificado SSL**: **desactívalo**. La aplicación usa un certificado local autofirmado, así que la verificación fallaría.
   - **Ruta** (si la pide): `/HomeAssistant` — la carpeta donde vivirán tus copias. Se crea automáticamente si no existe.
4. Pulsa **Enviar**. Home Assistant confirma la conexión y añade una entrada WebDAV.

## Elegir Internxt como ubicación de copias

1. Ve a **Ajustes → Sistema → Copias de seguridad**.
2. Abre el menú de ubicaciones (**⋯**, arriba a la derecha) → **Añadir ubicación** → selecciona la ubicación **WebDAV** que acabas de crear.
3. Deja también una copia **local** como segunda ubicación: no lo fíes todo a una sola copia.
4. Mantén el **cifrado de las copias** activado y guarda el kit de emergencia /
   la clave de cifrado **fuera** de Home Assistant. Sin ella, una copia no se
   puede restaurar.

## Crea tu primera copia

1. En **Ajustes → Sistema → Copias de seguridad**, pulsa **Crear copia**. Una
   copia parcial es una buena primera prueba rápida.
2. Cuando termine, abre **Internxt Drive** y comprueba que el archivo `.tar` está
   ahí, con su fecha y su tamaño.
3. De vuelta en Home Assistant, la copia aparece en la ubicación WebDAV y está
   lista para restaurar.

## Solución de problemas

- **Error de configuración:** rellena todos los campos obligatorios. Nunca
  publiques `options.json` en una incidencia.
- **El acceso falla tras reiniciar:** sustituye el código 2FA caducado, o
  configura el secreto OTP para el reinicio automático.
- **401 Unauthorized:** comprueba el usuario y la contraseña WebDAV locales.
- **Error de certificado:** desactiva la verificación del certificado — el
  endpoint local es autofirmado a propósito.
- **Puerto no disponible:** revisa el puerto publicado en la sección **Red**.
- **Falla la subida de una copia grande:** las subidas ya van con concurrencia
  reducida y reintentos automáticos, así que es raro. Reintenta una vez; si
  persiste, suele ser la red o el router local cortando ráfagas de conexiones.
  Conserva los registros de Home Assistant y de la aplicación (sin datos
  personales) si abres una incidencia.

## Seguridad

- No expongas nunca el puerto 3005 por el router ni por un proxy inverso público.
- Home Assistant guarda las opciones en `/data/options.json`; protege el acceso
  al host y a sus copias de seguridad.
- El secreto OTP puede permitir acceso desatendido a la cuenta de Internxt.
- No incluyas credenciales, tu correo de la cuenta, registros con datos
  personales ni archivos de copia en incidencias de GitHub.
