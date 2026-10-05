import { resolveDeployment } from './environment.mjs';

// Verified from the live DEV stack on 2026-10-03. Changing these requires a new resource audit.
const dev = {
  COGNITO_USER_POOL_ID: 'ap-south-1_XlJmCJYXS',
  COGNITO_APP_CLIENT_ID: '4md7svldn4dndr9gtfijgfl80',
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: 'ap-south-1_XlJmCJYXS',
  NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: '4md7svldn4dndr9gtfijgfl80',
  SERVER_API_BASE_URL: 'https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com',
  NEXT_PUBLIC_DOTCO_API_BASE_URL: 'https://evba5qgrqi.execute-api.ap-south-1.amazonaws.com',
  FIREBASE_PROJECT_ID: 'cothecoconutcompany-preview',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'cothecoconutcompany-preview'
};

export function assertResourceIsolation(env = process.env, { startup = false } = {}) {
  const deployment = resolveDeployment(env);
  if (deployment.environment !== 'production') {
    for (const [name, expected] of Object.entries(dev)) {
      const actual = env[name]?.trim().replace(/\/$/, '');
      if (actual && actual !== expected) throw new Error(`Non-production resource mismatch: ${name}.`);
    }
    if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      let account;
      try { account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON); }
      catch { throw new Error('Invalid Firebase Admin credential JSON.'); }
      if (account.project_id !== dev.FIREBASE_PROJECT_ID) throw new Error('Non-production Firebase Admin project mismatch.');
    }
  }
  if (startup && deployment.platform === 'railway') {
    for (const name of ['COGNITO_USER_POOL_ID', 'COGNITO_APP_CLIENT_ID', 'SERVER_API_BASE_URL',
      'FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_SERVICE_ACCOUNT_JSON',
      'COGNITO_SESSION_SECRET', 'ADMIN_SESSION_SECRET']) {
      if (!env[name]?.trim()) throw new Error(`Missing Railway runtime variable: ${name}.`);
    }
    for (const name of ['COGNITO_SESSION_SECRET', 'ADMIN_SESSION_SECRET']) {
      if (env[name].length < 32) throw new Error(`Railway session secret too short: ${name}.`);
    }
    let account;
    try { account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON); }
    catch { throw new Error('Invalid Firebase Admin credential JSON.'); }
    if (!account.private_key || !account.client_email || account.project_id !== env.FIREBASE_PROJECT_ID ||
      account.project_id !== env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) throw new Error('Railway Firebase Admin configuration mismatch.');
  }
  return deployment;
}
