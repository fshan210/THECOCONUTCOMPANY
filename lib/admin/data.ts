import {
  BarChart3,
  BookOpen,
  Boxes,
  Brush,
  ClipboardList,
  FileText,
  FileClock,
  FolderKanban,
  GalleryVertical,
  Globe2,
  Home,
  ImageIcon,
  Layers3,
  LayoutDashboard,
  ListTree,
  Mail,
  Menu,
  MessageSquareQuote,
  Package,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Users,
  type LucideIcon
} from "lucide-react";
import { impactMetrics, journalEntries, products } from "@/lib/content";
import { productCategories, recipes, shopProducts } from "@/lib/catalog";

export type AdminNavItem = {
  title: string;
  href: string;
  permission: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", permission: "analytics", icon: LayoutDashboard },
  { title: "Analytics", href: "/admin/analytics", permission: "analytics", icon: BarChart3 },
  { title: "CMS", href: "/admin/cms", permission: "content", icon: FolderKanban },
  { title: "Website", href: "/admin/website", permission: "content", icon: Globe2 },
  { title: "Products", href: "/admin/products", permission: "commerce", icon: Package },
  { title: "Categories", href: "/admin/categories", permission: "commerce", icon: Boxes },
  { title: "Recipes", href: "/admin/recipes", permission: "content", icon: BookOpen },
  { title: "Journal", href: "/admin/journal", permission: "content", icon: FileText },
  { title: "Testimonials", href: "/admin/testimonials", permission: "content", icon: MessageSquareQuote },
  { title: "Homepage", href: "/admin/homepage", permission: "content", icon: Home },
  { title: "Media Library", href: "/admin/media-library", permission: "media", icon: ImageIcon },
  { title: "Orders", href: "/admin/orders", permission: "orders", icon: ShoppingBag },
  { title: "Customers", href: "/admin/customers", permission: "customers", icon: Users },
  { title: "Newsletter", href: "/admin/newsletter", permission: "newsletter", icon: Mail },
  { title: "Forms", href: "/admin/forms", permission: "forms", icon: ClipboardList },
  { title: "SEO", href: "/admin/seo", permission: "seo", icon: Search },
  { title: "Brand Assets", href: "/admin/brand-assets", permission: "media", icon: Brush },
  { title: "Menus", href: "/admin/menus", permission: "content", icon: Menu },
  { title: "Pages", href: "/admin/pages", permission: "content", icon: Layers3 },
  { title: "Founders", href: "/admin/founders", permission: "content", icon: GalleryVertical },
  { title: "Sustainability", href: "/admin/sustainability", permission: "content", icon: Sprout },
  { title: "Settings", href: "/admin/settings", permission: "settings", icon: Settings },
  { title: "Users", href: "/admin/users", permission: "users", icon: ShieldCheck },
  { title: "Audit Logs", href: "/admin/audit-logs", permission: "users", icon: FileClock },
  { title: "Activity Logs", href: "/admin/activity-logs", permission: "users", icon: ListTree },
  { title: "Revenue Ops", href: "/admin/revenue", permission: "commerce", icon: ReceiptText },
  { title: "CMS Planner", href: "/admin/cms-planner", permission: "content", icon: FolderKanban }
];

export const adminStats = [
  { label: "Today's visitors", value: "1,248", delta: "+18.4%", source: "GA4 ready" },
  { label: "Weekly visitors", value: "8,920", delta: "+12.8%", source: "GA4 ready" },
  { label: "Monthly visitors", value: "36.4K", delta: "+21.6%", source: "GA4 ready" },
  { label: "Returning users", value: "31.8%", delta: "+4.2%", source: "Audience" },
  { label: "Page views", value: "94.7K", delta: "+16.1%", source: "GA4 ready" },
  { label: "Bounce rate", value: "38.6%", delta: "-5.4%", source: "GA4 ready" },
  { label: "Conversions", value: "412", delta: "+9.7%", source: "Events" },
  { label: "Newsletter signups", value: "186", delta: "+14.2%", source: "Forms" },
  { label: "Contact submissions", value: "42", delta: "+6", source: "Forms" },
  { label: "Orders", value: "0", delta: "Pre-launch", source: "Commerce" },
  { label: "Revenue", value: "Future", delta: "Ready", source: "Commerce" },
  { label: "Realtime visitors", value: "27", delta: "Live", source: "GA4 realtime" }
];

export const trafficSources = [
  { label: "Organic Search", value: "42%", detail: "Search Console connected-ready" },
  { label: "Instagram", value: "24%", detail: "Social profile schema active" },
  { label: "Direct", value: "21%", detail: "Brand-led discovery" },
  { label: "Referral", value: "13%", detail: "Partners and press" }
];

export const deviceBreakdown = [
  { label: "Mobile", value: 64 },
  { label: "Desktop", value: 29 },
  { label: "Tablet", value: 7 }
];

export const countrySignals = [
  { country: "India", value: "62%", detail: "Launch market" },
  { country: "United Arab Emirates", value: "18%", detail: "GCC route" },
  { country: "United States", value: "8%", detail: "Diaspora interest" },
  { country: "United Kingdom", value: "6%", detail: "Export signal" }
];

export const mostViewedPages = [
  { path: "/", title: "Home", views: "31.2K", status: "Live" },
  { path: "/shop", title: "Shop", views: "14.8K", status: "Pre-commerce" },
  { path: "/about", title: "About", views: "8.9K", status: "Live" },
  { path: "/recipes", title: "Recipes", views: "7.4K", status: "Live" },
  { path: "/sustainability", title: "Sustainability", views: "4.1K", status: "Live" }
];

export const cmsPages = [
  { title: "Home", route: "/", sections: 12, status: "Published", seo: 100 },
  { title: "About", route: "/about", sections: 4, status: "Published", seo: 100 },
  { title: "Products", route: "/products", sections: products.length + 2, status: "Published", seo: 100 },
  { title: "Recipes", route: "/recipes", sections: recipes.length, status: "Published", seo: 100 },
  { title: "Journal", route: "/journal", sections: journalEntries.length + 2, status: "Published", seo: 100 },
  { title: "Founders", route: "/founders", sections: 4, status: "Published", seo: 100 },
  { title: "Sustainability", route: "/sustainability", sections: impactMetrics.length + 3, status: "Published", seo: 100 },
  { title: "Contact", route: "/sign-up", sections: productCategories.length, status: "Lead capture", seo: 100 }
];

export const mediaAssets = [
  { name: "Bottle packshot", type: "Transparent PNG", folder: "Products", path: "/assets/transparent/co-water-bottle.png", usage: "Shop, Products, Hero" },
  { name: "Tender coconut", type: "Transparent PNG", folder: "Hero", path: "/assets/transparent/co-tender-coconut.png", usage: "Hero, ecosystem" },
  { name: "Mango coconut tub", type: "Transparent PNG", folder: "Products", path: "/assets/transparent/co-coconut-icecream.png", usage: "Shop, product detail" },
  { name: "Made for Living", type: "Optimized WebP", folder: "Brand", path: "/optimized/assets-coconut-made-for-living-reference.webp", usage: "Home" },
  { name: "Water lifestyle", type: "Opaque PNG", folder: "Marketing", path: "/assets/Coconut_Water_Assets/lifestyle scene.png", usage: "Home, product detail" },
  { name: "Homepage product scene", type: "Opaque PNG", folder: "Hero", path: "/assets/hero/co-home-hero-background-v2.png", usage: "Home, journal" },
  { name: "Water flat lay", type: "Opaque PNG", folder: "Marketing", path: "/assets/Coconut_Water_Assets/Flat lay.png", usage: "Shop CTA" }
];

export const seoTasks = [
  { item: "Meta titles", status: "Healthy", detail: "Centralized through createPageMetadata" },
  { item: "Open Graph", status: "Healthy", detail: "Dynamic opengraph-image route active" },
  { item: "Schema", status: "Healthy", detail: "Organization, product, recipe and breadcrumbs active" },
  { item: "Sitemap", status: "Review", detail: "Shop and recipe routes can be added when launch-ready" },
  { item: "Redirects", status: "Ready", detail: "No redirect table configured yet" },
  { item: "404 Monitoring", status: "Ready", detail: "Vercel analytics integration-ready" }
];

export const activityLog = [
  { actor: "System", action: "Deployed v1.7.0 flagship FMCG experience", time: "June 18, 2026", area: "Deployment" },
  { actor: "System", action: "Generated optimized composition WebPs", time: "June 18, 2026", area: "Media" },
  { actor: "Content", action: "Updated About journey timeline", time: "June 18, 2026", area: "CMS" },
  { actor: "Commerce", action: "Product catalogue synced from shopProducts", time: "June 18, 2026", area: "Products" },
  { actor: "SEO", action: "Validated Lighthouse SEO 100", time: "June 18, 2026", area: "SEO" }
];

export const topProducts = shopProducts.map((product, index) => ({
  ...product,
  interest: `${Math.max(96 - index * 11, 48)}%`,
  views: `${(14.2 - index * 1.8).toFixed(1)}K`
}));
