import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dockerfile = await readFile(
  new URL("../Dockerfile", import.meta.url),
  "utf8",
);

test("maps both Internxt home-directory mechanisms to /data", () => {
  assert.match(dockerfile, /\/etc\/passwd/);
  assert.match(
    dockerfile,
    /ln -s \/data\/\.internxt-cli \/root\/\.internxt-cli/,
  );
});

test("fails the image build if the Unix home remapping does not apply", () => {
  assert.match(dockerfile, /awk -F:.*print \$6.*\/etc\/passwd/);
  assert.match(dockerfile, /\)" = "\/data"/);
});

test("verifies and replaces the pinned Internxt multipart uploader", () => {
  assert.match(
    dockerfile,
    /4636f82c0b34fc85acbfa886c72b42196861a94f4576a9535e09f366f4d539d5/,
  );
  assert.match(dockerfile, /sha256sum --check --strict/);
  assert.match(dockerfile, /COPY patches\/multipart\.js/);
  assert.match(
    dockerfile,
    /@internxt\/inxt-js\/build\/lib\/core\/upload\/multipart\.js/,
  );
});
