export function isAccountRoute(path: string) {
  return ["/account", "/profile", "/orders", "/wishlist", "/saved-recipes"].some((root) => path === root || path.startsWith(`${root}/`));
}
export type AccountView = "overview" | "orders" | "history" | "detail" | "addresses" | "wishlist" | "recipes" | "preferences" | "security" | "payments" | "empty";
