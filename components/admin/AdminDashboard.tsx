"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, CircleDot, ExternalLink, Plus, Upload, WandSparkles } from "lucide-react";
import {
  activityLog,
  adminStats,
  cmsPages,
  countrySignals,
  deviceBreakdown,
  mediaAssets,
  mostViewedPages,
  seoTasks,
  topProducts,
  trafficSources
} from "@/lib/admin/data";
import { getAdminPath } from "@/lib/admin/path";

const spring = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      <AdminHero />
      <MetricGrid />
      <div className="grid gap-6 xl:grid-cols-[1.24fr_0.76fr]">
        <AnalyticsBoard />
        <RealtimeBoard />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <CmsOverview />
        <ProductOps />
        <ActivityPanel />
      </div>
    </div>
  );
}

export function AdminModulePage({ module }: { module: string }) {
  const title = module
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const moduleMap: Record<string, React.ReactNode> = {
    analytics: <AnalyticsBoard expanded />,
    website: <CmsOverview expanded />,
    products: <ProductOps expanded />,
    categories: <CategoryManager />,
    recipes: <RecipeManager />,
    journal: <JournalManager />,
    "media-library": <MediaLibrary />,
    seo: <SeoManager />,
    "brand-assets": <BrandAssetManager />,
    users: <UserManager />,
    settings: <SettingsManager />,
    orders: <CommerceReadiness title="Orders" />,
    customers: <CommerceReadiness title="Customers" />,
    newsletter: <NewsletterManager />,
    forms: <FormsManager />,
    menus: <MenuManager />,
    pages: <CmsOverview expanded />,
    founders: <EditorialManager title="Founders" />,
    sustainability: <EditorialManager title="Sustainability" />,
    "activity-logs": <ActivityPanel expanded />,
    revenue: <CommerceReadiness title="Revenue Ops" />,
    "cms-planner": <ContentEditor />
  };

  return (
    <div className="space-y-6">
      <section className="co-glass overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Admin module</p>
            <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl dark:text-paper">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted dark:text-paper/62">
              Enterprise-ready controls for the .CO operating system. Data is wired to the current site content and ready for database persistence.
            </p>
          </div>
          <Link href={getAdminPath()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-coconut/12 px-4 text-sm text-coconut dark:border-paper/20 dark:text-paper">
            Dashboard <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      {moduleMap[module] ?? <ContentEditor />}
    </div>
  );
}

function AdminHero() {
  return (
    <section className="co-glass relative overflow-hidden p-6 md:p-8">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-72 opacity-[0.08]" />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.48fr] lg:items-center">
        <div>
          <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Global FMCG operating system</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl dark:text-paper">Command center for .CO.</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted md:text-base md:leading-8 dark:text-paper/62">
            Manage analytics, content, products, assets, SEO, customers, commerce readiness, roles, and activity from one brand-consistent internal dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Edit homepage", getAdminPath("website")],
              ["Upload media", getAdminPath("media-library")],
              ["Review SEO", getAdminPath("seo")]
            ].map(([label, href]) => (
              <Link key={href} href={href} className="co-neu inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm text-coconut dark:bg-paper">
                {label} <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </div>
        <div className="co-neu relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image src="/assets/generated/composition-poolside.webp" alt=".CO product operating preview" fill priority sizes="(min-width: 1024px) 32vw, 92vw" className="object-contain p-4" />
        </div>
      </div>
    </section>
  );
}

function MetricGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminStats.map((stat, index) => (
        <motion.article key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: index * 0.025 }} className="co-neu p-5 dark:bg-paper">
          <p className="text-[0.65rem] uppercase tracking-editorial text-grove">{stat.source}</p>
          <p className="mt-5 font-display text-4xl leading-none text-ink">{stat.value}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h2 className="text-sm text-muted">{stat.label}</h2>
            <span className="rounded-full bg-grove/10 px-2 py-1 text-xs text-grove">{stat.delta}</span>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

function AnalyticsBoard({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="GA4 / Clarity / Search Console" title={expanded ? "Analytics command center" : "Analytics overview"} action="Connect sources" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
        <div className="co-neu-inset min-h-72 p-5">
          <div className="flex h-52 items-end gap-3">
            {[42, 58, 51, 74, 62, 86, 78, 92, 84, 96, 88, 100].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-coconut to-grove"
              />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-editorial text-muted">
            <span>Weekly visitors</span>
            <span>+12.8%</span>
          </div>
        </div>
        <div className="space-y-3">
          {trafficSources.map((source) => (
            <div key={source.label} className="co-neu p-4 dark:bg-paper">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink">{source.label}</p>
                <p className="font-display text-3xl text-coconut">{source.value}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{source.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {countrySignals.map((country) => (
          <div key={country.country} className="co-glass p-4">
            <p className="text-sm text-ink">{country.country}</p>
            <p className="mt-3 font-display text-4xl text-coconut">{country.value}</p>
            <p className="mt-2 text-xs text-muted">{country.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RealtimeBoard() {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="Live intelligence" title="Realtime and journeys" action="View heatmaps" />
      <div className="mt-6 space-y-4">
        {deviceBreakdown.map((device) => (
          <div key={device.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{device.label}</span>
              <span>{device.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-coconut/10">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${device.value}%` }} viewport={{ once: true }} transition={spring} className="h-full bg-grove" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <p className="mb-4 text-[0.72rem] uppercase tracking-editorial text-grove">Most viewed pages</p>
        <div className="space-y-2">
          {mostViewedPages.map((page) => (
            <div key={page.path} className="flex items-center justify-between gap-4 border-b border-coconut/10 py-3 text-sm last:border-0">
              <div>
                <p className="font-medium">{page.title}</p>
                <p className="text-xs text-muted">{page.path}</p>
              </div>
              <span>{page.views}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CmsOverview({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="co-glass p-5 md:p-6 xl:col-span-1">
      <PanelHeader eyebrow="Website CMS" title="Editable page system" action="Visual editor" />
      <div className="mt-5 space-y-3">
        {cmsPages.slice(0, expanded ? cmsPages.length : 5).map((page) => (
          <div key={page.route} className="co-neu flex items-center justify-between gap-4 p-4 dark:bg-paper">
            <div>
              <p className="font-medium text-ink">{page.title}</p>
              <p className="text-xs text-muted">{page.route} / {page.sections} sections</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-editorial text-grove">{page.status}</p>
              <p className="mt-1 text-xs text-muted">SEO {page.seo}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductOps({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="Product CMS" title="Catalogue operations" action="New product" />
      <div className="mt-5 space-y-3">
        {topProducts.slice(0, expanded ? topProducts.length : 5).map((product) => (
          <div key={product.slug} className="co-neu grid grid-cols-[64px_1fr_auto] items-center gap-4 p-3 dark:bg-paper">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-paper">
              <Image src={product.image} alt={product.name} fill sizes="64px" className="object-contain p-2" />
            </div>
            <div>
              <p className="font-medium text-ink">{product.name}</p>
              <p className="text-xs text-muted">{product.category} / {product.format}</p>
            </div>
            <div className="text-right text-xs">
              <p className="text-grove">{product.interest}</p>
              <p className="text-muted">{product.views}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaLibrary() {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="Asset manager" title="Media library" action="Bulk upload" icon={<Upload size={15} />} />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mediaAssets.map((asset) => (
          <article key={asset.path} className="co-neu p-4 dark:bg-paper">
            <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-paper">
              <Image src={asset.path} alt={asset.name} fill sizes="(min-width: 1024px) 22vw, 90vw" className="object-contain p-3" />
            </div>
            <p className="font-medium text-ink">{asset.name}</p>
            <p className="mt-1 text-xs text-muted">{asset.folder} / {asset.type}</p>
            <p className="mt-3 text-xs leading-5 text-muted">Usage: {asset.usage}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel({ expanded = false }: { expanded?: boolean }) {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="Audit trail" title="Recent activity" action="Export" />
      <div className="mt-5 space-y-4">
        {activityLog.slice(0, expanded ? activityLog.length : 5).map((item) => (
          <div key={`${item.actor}-${item.action}`} className="flex gap-3 border-b border-coconut/10 pb-4 last:border-0">
            <CircleDot className="mt-1 text-grove" size={16} />
            <div>
              <p className="text-sm font-medium">{item.action}</p>
              <p className="mt-1 text-xs text-muted">{item.actor} / {item.area} / {item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeoManager() {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="SEO manager" title="Search, schema and index control" action="Run audit" />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {seoTasks.map((task) => (
          <article key={task.item} className="co-neu p-5 dark:bg-paper">
            <CheckCircle2 className="mb-5 text-grove" size={20} />
            <h2 className="font-display text-3xl text-ink">{task.item}</h2>
            <p className="mt-3 text-xs uppercase tracking-editorial text-grove">{task.status}</p>
            <p className="mt-4 text-sm leading-7 text-muted">{task.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BrandAssetManager() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="co-glass p-5 md:p-6">
        <PanelHeader eyebrow="Brand system" title="Identity controls" action="Edit tokens" />
        <div className="mt-6 grid gap-3">
          {[
            ["Cream Beige", "#F5EBD7"],
            ["Earth Brown", "#3E2E1F"],
            ["Leaf Green", "#4A6F4A"],
            ["Palm Green", "#A8B07B"],
            ["Sun Yellow", "#D8C07A"]
          ].map(([name, value]) => (
            <div key={name} className="co-neu flex items-center gap-3 p-3 dark:bg-paper">
              <span className="h-9 w-9 rounded-full border border-coconut/10" style={{ background: value }} />
              <div>
                <p className="text-sm font-medium text-ink">{name}</p>
                <p className="text-xs text-muted">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MediaLibrary />
    </section>
  );
}

function ContentEditor() {
  return (
    <section className="co-glass p-5 md:p-6">
      <PanelHeader eyebrow="Visual content editor" title="Composable section builder" action="Create section" icon={<Plus size={15} />} />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Text", "Rich Text", "Images", "Video", "SVG", "Background", "Buttons", "Animations", "Cards", "SEO Metadata", "Visibility", "Drag ordering"].map((item) => (
          <article key={item} className="co-neu p-5 dark:bg-paper">
            <WandSparkles className="mb-6 text-grove" size={18} />
            <h2 className="font-display text-3xl text-ink">{item}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">Editable, versionable, and ready for database-backed persistence.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function UserManager() {
  const users = [
    ["Fazil Shersha", "Super Admin", "Active", "Today"],
    ["Afsala Muthali", "Admin", "Active", "Today"],
    ["Content Team", "Content Editor", "Invited", "Pending"],
    ["Marketing Desk", "Marketing", "Active", "Yesterday"],
    ["Support Desk", "Customer Support", "Ready", "This week"],
    ["Analytics Viewer", "Read-only Analytics", "Ready", "This week"]
  ];
  return <SimpleTable eyebrow="RBAC" title="User management" headers={["User", "Role", "Status", "Last active"]} rows={users} />;
}

function SettingsManager() {
  return <ContentEditor />;
}

function CategoryManager() {
  return <SimpleTable eyebrow="Taxonomy" title="Product categories" headers={["Category", "Products", "Homepage", "Status"]} rows={["Coconut Water", "Frozen Desserts", "Kitchen", "Botanica", "Wellness", "Lifestyle"].map((category, index) => [category, String(index < 2 ? 1 : 0), index < 4 ? "Visible" : "Ready", "Active"])} />;
}

function RecipeManager() {
  return <SimpleTable eyebrow="Recipes" title="Editorial recipe CMS" headers={["Recipe", "Category", "Product", "Status"]} rows={["Coconut Mango Cooler", "Tender Coconut Smoothie Bowl", "Coconut Coffee Chill", "Coconut Cream Dessert Cup", "Post-Workout Coconut Hydration"].map((recipe) => [recipe, "Published", ".CO Water", "Live"])} />;
}

function JournalManager() {
  return <SimpleTable eyebrow="Journal" title="Founder and field notes" headers={["Entry", "Category", "SEO", "Status"]} rows={["The Palakkad Standard", "Made for Living", "Beyond the Coconut", "Direct Farm, Direct Memory"].map((entry) => [entry, "Editorial", "100", "Published"])} />;
}

function NewsletterManager() {
  return <SimpleTable eyebrow="CRM" title="Newsletter and launch circle" headers={["Segment", "Contacts", "Growth", "Status"]} rows={[["Early access", "186", "+14.2%", "Active"], ["Distributor", "42", "+6", "Active"], ["Recipes", "73", "+9.1%", "Active"]]} />;
}

function FormsManager() {
  return <SimpleTable eyebrow="Forms" title="Lead capture workflows" headers={["Form", "Submissions", "Routing", "Status"]} rows={[["Newsletter", "186", "Marketing", "Active"], ["Distributor enquiry", "42", "Sales", "Active"], ["Account interest", "91", "CRM", "Active"]]} />;
}

function MenuManager() {
  return <SimpleTable eyebrow="Navigation" title="Menus and footer" headers={["Menu", "Items", "Location", "Status"]} rows={[["Primary", "7", "Header", "Published"], ["Footer pages", "7", "Footer", "Published"], ["Commerce", "2", "Shop CTA", "Ready"]]} />;
}

function EditorialManager({ title }: { title: string }) {
  return <SimpleTable eyebrow="Editorial CMS" title={`${title} content`} headers={["Section", "Blocks", "Assets", "Status"]} rows={[["Hero", "Text, doodle", "Brand SVG", "Published"], ["Story", "Cards", "WebP", "Published"], ["SEO", "Metadata", "Schema", "Healthy"]]} />;
}

function CommerceReadiness({ title }: { title: string }) {
  return <SimpleTable eyebrow="Commerce ready" title={title} headers={["Area", "Mode", "Dependency", "Status"]} rows={[["Checkout", "Future", "Payment gateway", "Ready"], ["Inventory", "Future", "ERP sync", "Ready"], ["Revenue", "Future", "Commerce events", "Ready"]]} />;
}

function SimpleTable({ eyebrow, title, headers, rows }: { eyebrow: string; title: string; headers: string[]; rows: string[][] }) {
  return (
    <section className="co-glass overflow-hidden p-5 md:p-6">
      <PanelHeader eyebrow={eyebrow} title={title} action="Manage" />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs uppercase tracking-editorial text-grove">
            <tr>{headers.map((header) => <th key={header} className="border-b border-coconut/10 px-4 py-3 font-medium">{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-b border-coconut/10 last:border-0">
                {row.map((cell) => <td key={cell} className="px-4 py-4 text-muted">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PanelHeader({ eyebrow, title, action, icon }: { eyebrow: string; title: string; action: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="mb-3 text-[0.68rem] uppercase tracking-editorial text-grove">{eyebrow}</p>
        <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl dark:text-paper">{title}</h2>
      </div>
      <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-coconut/12 px-4 text-sm text-coconut dark:border-paper/20 dark:text-paper">
        {icon ?? <ExternalLink size={15} />} {action}
      </button>
    </div>
  );
}
