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
