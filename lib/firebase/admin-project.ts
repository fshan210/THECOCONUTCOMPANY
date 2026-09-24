const previewFirebaseProjectId = "cothecoconutcompany-preview";

export function verifyFirebasePublicProjectId(projectId: string | undefined, deploymentEnvironment: string | undefined) {
  const actual = projectId?.trim();
  if (deploymentEnvironment === "preview" && actual !== previewFirebaseProjectId) {
    throw new Error("Preview Firebase public project ID mismatch.");
  }
  if (deploymentEnvironment === "production" && actual === previewFirebaseProjectId) {
    throw new Error("Production Firebase public project cannot use the Preview project.");
  }
  return actual;
}

export function verifyFirebaseAdminProjectId(
  credentialProjectId: string | undefined,
  declaredProjectId: string | undefined,
  deploymentEnvironment: string | undefined,
  publicProjectId?: string
) {
  const projectId = typeof credentialProjectId === "string" ? credentialProjectId.trim() : "";
  if (!projectId) throw new Error("Firebase Admin credential has no project ID.");

  if (deploymentEnvironment === "preview") {
    if (!declaredProjectId) throw new Error("Preview Firebase Admin project ID is not declared.");
    if (projectId !== declaredProjectId.trim()) throw new Error("Preview Firebase Admin project ID mismatch.");
    if (projectId !== previewFirebaseProjectId) throw new Error("Preview Firebase Admin must use the Preview project.");
    if (verifyFirebasePublicProjectId(publicProjectId, deploymentEnvironment) !== projectId) {
      throw new Error("Preview Firebase Admin and public project IDs differ.");
    }
  }
  if (deploymentEnvironment === "production") {
    verifyFirebasePublicProjectId(publicProjectId, deploymentEnvironment);
    if (projectId === previewFirebaseProjectId) throw new Error("Production Firebase Admin cannot use the Preview project.");
  }

  return projectId;
}
