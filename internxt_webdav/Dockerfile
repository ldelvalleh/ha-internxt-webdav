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
