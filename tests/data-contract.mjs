import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync("src/data.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const sandbox = { exports: {} };
vm.runInNewContext(compiled.outputText, sandbox, { filename: "src/data.ts" });
const { disciplines } = sandbox.exports;

assert.ok(Array.isArray(disciplines) && disciplines.length > 0, "catalog must contain disciplines");

const disciplineIds = new Set();
const challengeIds = new Set();
const allowedDifficulty = new Set(["Foundation", "Core", "Advanced", "Expert"]);

for (const discipline of disciplines) {
  assert.ok(discipline.id?.trim(), "discipline id is required");
  assert.ok(!disciplineIds.has(discipline.id), `duplicate discipline id: ${discipline.id}`);
  disciplineIds.add(discipline.id);

  for (const field of ["name", "tag", "summary"]) {
    assert.ok(discipline[field]?.trim(), `${discipline.id}.${field} is required`);
  }
  assert.ok(Array.isArray(discipline.companyFit), `${discipline.id} companyFit must be an array`);
  assert.ok(Array.isArray(discipline.preparationTracks) && discipline.preparationTracks.length > 0, `${discipline.id} requires preparation tracks`);
  assert.ok(Array.isArray(discipline.interviewStages) && discipline.interviewStages.length > 0, `${discipline.id} requires interview stages`);
  assert.ok(Array.isArray(discipline.tests) && discipline.tests.length > 0, `${discipline.id} requires challenges`);

  for (const stage of discipline.interviewStages) {
    assert.ok(stage.name?.trim() && stage.focus?.trim(), `${discipline.id} stage requires name and focus`);
    assert.ok(Number.isInteger(stage.minutes) && stage.minutes > 0, `${discipline.id}/${stage.name} requires positive integer minutes`);
    assert.ok(Array.isArray(stage.rubric) && stage.rubric.length >= 2, `${discipline.id}/${stage.name} requires a useful rubric`);
    assert.ok(Array.isArray(stage.followUps) && stage.followUps.length >= 1, `${discipline.id}/${stage.name} requires follow-up prompts`);
  }

  for (const challenge of discipline.tests) {
    assert.ok(challenge.id?.trim(), `${discipline.id} challenge id is required`);
    assert.ok(!challengeIds.has(challenge.id), `duplicate challenge id: ${challenge.id}`);
    challengeIds.add(challenge.id);
    assert.ok(allowedDifficulty.has(challenge.difficulty), `${challenge.id} has invalid difficulty`);
    for (const field of ["title", "prompt", "signal", "starter", "confirms"]) {
      assert.ok(challenge[field]?.trim(), `${challenge.id}.${field} is required`);
    }
  }
}

assert.ok(challengeIds.size >= disciplines.length, "catalog should expose usable challenge coverage");
console.log(`Interview catalog validated: ${disciplineIds.size} disciplines, ${challengeIds.size} challenges.`);
