const sharedPublicFirebaseProjectId = "cothecoconutcompany";

export function verifyFirebaseAdminProjectId(
  credentialProjectId: string | undefined,
  declaredProjectId: string | undefined,
  deploymentEnvironment: string | undefined
) {
  const projectId = typeof credentialProjectId === "string" ? credentialProjectId.trim() : "";
  if (!projectId) throw new Error("Firebase Admin credential has no project ID.");

  if (deploymentEnvironment === "preview") {
    if (!declaredProjectId) throw new Error("Preview Firebase Admin project ID is not declared.");
    if (projectId !== declaredProjectId.trim()) throw new Error("Preview Firebase Admin project ID mismatch.");
    if (projectId === sharedPublicFirebaseProjectId) throw new Error("Preview Firebase Admin cannot use the shared public Firebase project.");
  }

  return projectId;
}
