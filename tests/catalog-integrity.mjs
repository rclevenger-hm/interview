import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/data.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`;
const { disciplines } = await import(moduleUrl);

assert.ok(Array.isArray(disciplines) && disciplines.length > 0, "catalog must contain disciplines");

const disciplineIds = new Set();
const challengeIds = new Set();
const allowedDifficulties = new Set(["Foundation", "Core", "Advanced", "Expert"]);

for (const discipline of disciplines) {
  assert.ok(discipline.id && !disciplineIds.has(discipline.id), `duplicate or missing discipline id: ${discipline.id}`);
  disciplineIds.add(discipline.id);
  assert.ok(discipline.name && discipline.summary, `${discipline.id} must have a name and summary`);
  assert.ok(Array.isArray(discipline.interviewStages) && discipline.interviewStages.length > 0, `${discipline.id} must define interview stages`);
  assert.ok(Array.isArray(discipline.tests) && discipline.tests.length > 0, `${discipline.id} must define practice challenges`);

  for (const stage of discipline.interviewStages) {
    assert.ok(stage.name && stage.focus, `${discipline.id} has an incomplete interview stage`);
    assert.ok(Number.isFinite(stage.minutes) && stage.minutes > 0, `${discipline.id}/${stage.name} must have a positive duration`);
    assert.ok(stage.followUps.length > 0 && stage.rubric.length > 0, `${discipline.id}/${stage.name} must include follow-ups and rubric signals`);
  }

  for (const challenge of discipline.tests) {
    assert.ok(challenge.id && !challengeIds.has(challenge.id), `duplicate or missing challenge id: ${challenge.id}`);
    challengeIds.add(challenge.id);
    assert.ok(challenge.title && challenge.prompt && challenge.signal, `${challenge.id} is missing required practice content`);
    assert.ok(allowedDifficulties.has(challenge.difficulty), `${challenge.id} has unsupported difficulty ${challenge.difficulty}`);
  }
}

console.log(`Validated ${disciplineIds.size} disciplines and ${challengeIds.size} unique practice challenges.`);
