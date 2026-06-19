import { existsSync, readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && existsSync(credentialsPath)) {
    return JSON.parse(readFileSync(credentialsPath, "utf8")) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
  }

  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.");
}

const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
if (!configuredAdminEmail) {
  console.error("Missing ADMIN_EMAIL. Set it to an existing Firebase Auth user email before bootstrapping.");
  process.exit(1);
}
const adminEmail = configuredAdminEmail;

const serviceAccount = getServiceAccount();
const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })
  });

const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const user = await auth.getUserByEmail(adminEmail);
  const now = new Date().toISOString();

  await db.collection("admins").doc(user.uid).set(
    {
      uid: user.uid,
      email: adminEmail,
      displayName: user.displayName || process.env.ADMIN_NAME || adminEmail.split("@")[0],
      role: "super_admin",
      roleKey: "super_admin",
      permissions: ["*"],
      status: "active",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    },
    { merge: true }
  );

  await db.collection("auditLogs").add({
    adminUid: user.uid,
    adminEmail,
    adminRole: "super_admin",
    action: "admin_bootstrap",
    resourceType: "admins",
    resourceId: user.uid,
    before: null,
    after: { role: "super_admin", permissions: ["*"], isActive: true },
    ipAddress: "local-bootstrap",
    userAgent: "scripts/bootstrap-admin.ts",
    createdAt: now
  });

  console.log(`Admin bootstrap complete for Firebase Auth uid ${user.uid}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin bootstrap failed.");
  process.exit(1);
});
