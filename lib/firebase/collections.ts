export const firestoreCollections = {
  users: "users",
  admins: "admins",
  products: "products",
  recipes: "recipes",
  journal: "journal",
  newsletter: "newsletter",
  wishlist: "wishlist",
  savedRecipes: "savedRecipes",
  orders: "orders",
  activityLogs: "activityLogs",
  auditLogs: "auditLogs",
  securityEvents: "securityEvents",
  roles: "roles",
  permissions: "permissions",
  brandAssets: "brandAssets",
  settings: "settings",
  mediaLibrary: "mediaLibrary",
  contactForms: "contactForms"
} as const;

export type FirestoreCollectionName = keyof typeof firestoreCollections;
