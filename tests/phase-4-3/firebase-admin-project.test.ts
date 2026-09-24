import assert from "node:assert/strict";
import test from "node:test";
import { verifyFirebaseAdminProjectId, verifyFirebasePublicProjectId } from "../../lib/firebase/admin-project";

test("Preview accepts a declared non-Production Firebase Admin project", () => {
  assert.equal(
    verifyFirebaseAdminProjectId("cothecoconutcompany-preview", "cothecoconutcompany-preview", "preview", "cothecoconutcompany-preview"),
    "cothecoconutcompany-preview"
  );
  assert.equal(verifyFirebasePublicProjectId("cothecoconutcompany-preview", "preview"), "cothecoconutcompany-preview");
});

test("Preview fails closed when its project is undeclared, mismatched, or the shared public project", () => {
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", undefined, "preview", "cothecoconutcompany-preview"));
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", "another-project", "preview", "cothecoconutcompany-preview"));
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany", "cothecoconutcompany", "preview", "cothecoconutcompany"));
  assert.throws(() => verifyFirebaseAdminProjectId(undefined, "cothecoconutcompany-preview", "preview", "cothecoconutcompany-preview"));
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", "cothecoconutcompany-preview", "preview", "cothecoconutcompany"));
  assert.throws(() => verifyFirebasePublicProjectId("cothecoconutcompany", "preview"));
});

test("Production retains its existing Firebase Admin project behavior", () => {
  assert.equal(verifyFirebaseAdminProjectId("cothecoconutcompany", undefined, "production"), "cothecoconutcompany");
  assert.throws(() => verifyFirebaseAdminProjectId("cothecoconutcompany-preview", undefined, "production"));
  assert.throws(() => verifyFirebasePublicProjectId("cothecoconutcompany-preview", "production"));
});
