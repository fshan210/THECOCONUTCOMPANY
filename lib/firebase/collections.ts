export const firestoreCollections = {
  users: "users",
  admins: "admins",
  products: "products",
  recipes: "recipes",
  journal: "journal",
  newsletter: "newsletter",
  wishlist: "wishlist",
  orders: "orders",
  activityLogs: "activityLogs",
  roles: "roles",
  permissions: "permissions",
  brandAssets: "brandAssets",
  settings: "settings",
  mediaLibrary: "mediaLibrary",
  contactForms: "contactForms"
} as const;

export type FirestoreCollectionName = keyof typeof firestoreCollections;
