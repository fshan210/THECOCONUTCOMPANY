export function isAccountRoute(path: string) {
  return ["/account", "/profile", "/orders", "/wishlist", "/saved-recipes"].some((root) => path === root || path.startsWith(`${root}/`));
}
export function isAccountNavigation(fromPath: string, toPath: string) {
  return isAccountRoute(fromPath) && isAccountRoute(toPath);
}
export type AccountView = "overview" | "orders" | "history" | "detail" | "addresses" | "wishlist" | "recipes" | "preferences" | "security" | "payments" | "empty";
