import assert from "node:assert/strict";
import test from "node:test";
import { verifyFirebaseAdminProjectId } from "../../lib/firebase/admin-project";

test("Preview accepts a declared non-Production Firebase Admin project", () => {
  assert.equal(
    verifyFirebaseAdminProjectId("cothecoconutcompany-preview", "cothecoconutcompany-preview", "preview"),
    "cothecoconutcompany-preview"
  );
});

test("Preview fails closed when its project is undeclared, mismatched, or the shared public project", () => {
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", undefined, "preview"));
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", "another-project", "preview"));
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany", "cothecoconutcompany", "preview"));
  assert.throws(() => verifyFirebaseAdminProjectId(undefined, "cothecoconutcompany-preview", "preview"));
});

test("Production retains its existing Firebase Admin project behavior", () => {
  assert.equal(verifyFirebaseAdminProjectId("cothecoconutcompany", undefined, "production"), "cothecoconutcompany");
});
