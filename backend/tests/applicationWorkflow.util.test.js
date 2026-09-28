import test from "node:test";
import assert from "node:assert/strict";

import {
  canTransitionApplication,
  isTerminalApplicationStatus,
} from "../utils/applicationWorkflow.util.js";

test("application workflow allows the intended forward path", () => {
  assert.equal(canTransitionApplication("applied", "reviewing"), true);
  assert.equal(canTransitionApplication("reviewing", "shortlisted"), true);
  assert.equal(canTransitionApplication("shortlisted", "interview"), true);
  assert.equal(canTransitionApplication("interview", "hired"), true);
});

test("application workflow allows rejection before a terminal state", () => {
  assert.equal(canTransitionApplication("applied", "rejected"), true);
  assert.equal(canTransitionApplication("reviewing", "rejected"), true);
  assert.equal(canTransitionApplication("shortlisted", "rejected"), true);
  assert.equal(canTransitionApplication("interview", "rejected"), true);
});

test("application workflow blocks regressions and terminal transitions", () => {
  assert.equal(canTransitionApplication("shortlisted", "reviewing"), false);
  assert.equal(canTransitionApplication("hired", "rejected"), false);
  assert.equal(canTransitionApplication("rejected", "reviewing"), false);
  assert.equal(isTerminalApplicationStatus("hired"), true);
  assert.equal(isTerminalApplicationStatus("rejected"), true);
  assert.equal(isTerminalApplicationStatus("interview"), false);
});
