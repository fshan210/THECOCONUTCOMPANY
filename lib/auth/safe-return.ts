const allowedReturnPaths = new Set([
  "/shop", "/cart", "/wishlist", "/account", "/products", "/saved-recipes", "/orders", "/profile", "/recipes", "/journal"
]);
const allowedReturnPrefixes = ["/shop/", "/products/", "/account/", "/orders/", "/recipes/", "/journal/"];

export function safeReturnTo(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/shop";
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
    if (decoded !== value) decoded = decodeURIComponent(decoded);
  } catch {
    return "/shop";
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return "/shop";
  const path = decoded.split(/[?#]/)[0] || "/shop";
  if (path.split("/").some((part) => part === "." || part === "..")) return "/shop";
  return allowedReturnPaths.has(path) || allowedReturnPrefixes.some((prefix) => path.startsWith(prefix)) ? decoded : "/shop";
}
