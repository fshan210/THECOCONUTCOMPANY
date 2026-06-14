export const supabaseAuthConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  redirectTo: "https://cothecoconutcompany.com/account"
};

export function isSupabaseAuthConfigured() {
  return Boolean(supabaseAuthConfig.url && supabaseAuthConfig.anonKey);
}
