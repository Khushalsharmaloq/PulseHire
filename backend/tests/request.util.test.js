import test from "node:test";
import assert from "node:assert/strict";

import { escapeRegex, parsePositiveInteger } from "../utils/request.util.js";

test("escapeRegex neutralizes regex metacharacters in public search input", () => {
  const raw = "(react)+node.*";
  const escaped = escapeRegex(raw);
  const regex = new RegExp(escaped, "i");

  assert.equal(regex.test(raw), true);
  assert.equal(regex.test("reactnodeeeee"), false);
});

test("parsePositiveInteger clamps pagination values", () => {
  assert.equal(
    parsePositiveInteger("500", { defaultValue: 25, min: 1, max: 100 }),
    100,
  );
  assert.equal(
    parsePositiveInteger("0", { defaultValue: 25, min: 1, max: 100 }),
    1,
  );
  assert.equal(
    parsePositiveInteger("bad", { defaultValue: 25, min: 1, max: 100 }),
    25,
  );
});
