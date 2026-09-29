import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateJobMatch,
  getApprovedSkills,
  uniqueSkills,
} from "../utils/match.util.js";

test("uniqueSkills removes case-insensitive duplicates", () => {
  assert.deepEqual(uniqueSkills(["React", " react ", "Node.js", ""]), [
    "React",
    "Node.js",
  ]);
});

test("getApprovedSkills ignores pending and rejected proofs", () => {
  assert.deepEqual(
    getApprovedSkills([
      { skill: "React", status: "approved" },
      { skill: "Node.js", status: "pending" },
      { skill: "SQL", status: "rejected" },
    ]),
    ["React"],
  );
});

test("calculateJobMatch scores only the supplied structured skills", () => {
  const result = calculateJobMatch(
    ["React", "Node.js", "PostgreSQL"],
    ["react", "Node.js"],
  );

  assert.equal(result.score, 67);
  assert.deepEqual(result.matchedSkills, ["React", "Node.js"]);
  assert.deepEqual(result.missingSkills, ["PostgreSQL"]);
});
