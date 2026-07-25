ARG INTERNXT_VERSION=v1.6.7
FROM internxt/webdav:${INTERNXT_VERSION}

ARG BUILD_VERSION
ARG BUILD_ARCH

LABEL \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.type="app" \
  io.hass.arch="${BUILD_ARCH}" \
  org.opencontainers.image.title="Home Assistant App: Internxt WebDAV" \
  org.opencontainers.image.description="Experimental Home Assistant adapter for the official Internxt WebDAV server" \
  org.opencontainers.image.source="https://github.com/ldelvalleh/ha-internxt-webdav" \
  org.opencontainers.image.licenses="Apache-2.0"

ENV HOME="/data" \
    XDG_CACHE_HOME="/data/.cache" \
    XDG_CONFIG_HOME="/data/.config"

# Internxt v1.6.7 resolves its CLI directory with os.homedir(), which reads the
# Unix account database, while its Docker entrypoint also contains a literal
# /root/.internxt-cli path. Point both mechanisms at Home Assistant's writable
# and persistent /data mount without altering the upstream entrypoint.
RUN sed -i \
      's#^\(root:[^:]*:[^:]*:[^:]*:[^:]*:\)/root:#\1/data:#' \
      /etc/passwd \
    && test "$(awk -F: '$1 == "root" { print $6 }' /etc/passwd)" = "/data" \
    && test ! -e /root/.internxt-cli \
    && ln -s /data/.internxt-cli /root/.internxt-cli

# Abort the build if the pinned upstream upload implementation has drifted.
RUN echo "4636f82c0b34fc85acbfa886c72b42196861a94f4576a9535e09f366f4d539d5  /app/node_modules/@internxt/inxt-js/build/lib/core/upload/multipart.js" \
      | sha256sum --check --strict -

# Keep Internxt's encryption and WebDAV implementation intact. This targeted
# transport patch only lowers multipart concurrency and retries transient part
# connections for large Home Assistant backups.
COPY patches/multipart.js \
     /app/node_modules/@internxt/inxt-js/build/lib/core/upload/multipart.js
COPY rootfs /

RUN chmod 0755 /usr/local/bin/ha-entrypoint.mjs

ENTRYPOINT ["node", "/usr/local/bin/ha-entrypoint.mjs"]
CMD ["/app/docker/entrypoint.sh"]

# The upstream healthcheck prints the Internxt account email. Check the same
# state silently so health diagnostics cannot expose account information.
HEALTHCHECK --interval=120s --timeout=30s --start-period=60s --retries=3 \
  CMD internxt whoami --json >/dev/null 2>&1 \
    && internxt webdav status --json 2>/dev/null \
      | jq -e '.message | endswith("online")' >/dev/null
