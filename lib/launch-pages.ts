export type LaunchPage = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  action?: { label: string; href: string };
  mode?: "search" | "track" | "cart" | "checkout";
};

export const launchPages: Record<string, LaunchPage> = {
  faqs: { eyebrow: "Help", title: "Questions, answered simply.", intro: "Useful guidance for shopping, recipes, accounts and the growing .CO product world.", sections: [
    { title: "Are products available now?", body: "The shop clearly marks current and coming-soon products. Availability is confirmed before checkout goes live." },
    { title: "Where is .CO based?", body: ".CO is rooted in Palakkad, Kerala, with a product world inspired by thoughtful everyday coconut use." },
    { title: "How do I save products?", body: "Use the heart or bag controls, then revisit your wishlist or customer account." }
  ], action: { label: "Contact support", href: "/contact" } },
  "shipping-delivery": { eyebrow: "Delivery", title: "Shipping, without surprises.", intro: "Delivery regions, charges and timelines will always be shown before a live order is confirmed.", sections: [
    { title: "Coverage", body: "Launch delivery coverage is being finalised. Unsupported locations will never be charged." },
    { title: "Timelines", body: "An estimated dispatch and arrival window will appear at checkout when ordering is activated." },
    { title: "Packaging", body: "We are developing protective packaging with material reduction and recovery in mind." }
  ], action: { label: "Track an order", href: "/track-order" } },
  returns: { eyebrow: "Help", title: "Returns made human.", intro: "When commerce is activated, product-specific eligibility and return windows will be shown before purchase.", sections: [
    { title: "Damaged delivery", body: "Keep the parcel and product photographs and contact support promptly so the issue can be reviewed." },
    { title: "Food safety", body: "Opened food and beverage products cannot ordinarily be returned unless damaged, incorrect or unsafe." },
    { title: "Care and homeware", body: "Unused eligible items will follow the return window stated at checkout." }
  ], action: { label: "Contact support", href: "/support" } },
  "refund-policy": { eyebrow: "Policy", title: "A clear refund path.", intro: "Approved refunds will return to the original payment method once live commerce is enabled.", sections: [
    { title: "Review", body: "Support first confirms eligibility, condition and proof of purchase." },
    { title: "Timing", body: "Bank processing time can vary after a refund is issued." },
    { title: "Updates", body: "Final statutory and payment-provider details will be published before checkout activation." }
  ], action: { label: "Read returns", href: "/returns" } },
  "privacy-policy": { eyebrow: "Privacy", title: "Your data, treated thoughtfully.", intro: "We collect only what is needed to operate accounts, preferences, support and—when accepted—analytics.", sections: [
    { title: "What we store", body: "Account details, saved preferences, consent choices and information you intentionally submit." },
    { title: "Optional analytics", body: "Analytics does not load until you accept it through cookie preferences." },
    { title: "Your choices", body: "You may reject optional cookies and request account or data support through our contact route." }
  ], action: { label: "Cookie policy", href: "/cookie-policy" } },
  "cookie-policy": { eyebrow: "Cookies", title: "Small files, clear choices.", intro: "Essential storage keeps accounts, baskets and preferences working. Analytics remains optional.", sections: [
    { title: "Essential", body: "Used for authentication, basket state, consent and core site reliability." },
    { title: "Analytics", body: "Used only after consent to understand anonymous performance and page usage." },
    { title: "Managing consent", body: "Use the cookie control at the lower-left corner of any public page to update preferences." }
  ], action: { label: "Privacy policy", href: "/privacy-policy" } },
  "terms-and-conditions": { eyebrow: "Terms", title: "The terms of using .CO.", intro: "These launch-readiness terms cover site use while the commercial ordering system remains in preparation.", sections: [
    { title: "Site information", body: "Product previews, prices and availability may change before a purchase is confirmed." },
    { title: "Accounts", body: "Keep account credentials private and provide accurate information when using customer features." },
    { title: "Brand material", body: ".CO names, photography and site material may not be reused commercially without permission." }
  ], action: { label: "Contact .CO", href: "/contact" } },
  terms: { eyebrow: "Terms", title: "The terms of using .CO.", intro: "These launch-readiness terms cover site use while the commercial ordering system remains in preparation.", sections: [{ title: "Full terms", body: "Review the complete launch terms and conditions at the link below." }], action: { label: "Terms & conditions", href: "/terms-and-conditions" } },
  careers: { eyebrow: "Careers", title: "Build the coconut future with us.", intro: "We are not advertising open roles today, but thoughtful introductions are welcome.", sections: [
    { title: "What we value", body: "Curiosity, craft, honesty, hospitality and respect for the people and ecosystems behind products." },
    { title: "Future teams", body: "Brand, food, operations, community, retail and technology will grow as .CO grows." }
  ], action: { label: "Introduce yourself", href: "mailto:hello@cothecoconutcompany.com?subject=Careers%20at%20.CO" } },
  community: { eyebrow: "Community", title: "A coconut world built together.", intro: "Discover recipes, rituals, creator stories and the interactive co-creation hub.", sections: [
    { title: "Share a ritual", body: "Bring a real recipe, daily practice or coconut idea to the growing .CO conversation." },
    { title: "Build your day", body: "Use the co-creation hub to arrange community rituals and explore their illustrative impact." }
  ], action: { label: "Open community hub", href: "/journal/social-cocreation-hub" } },
  support: { eyebrow: "Support", title: "We’re here to help.", intro: "Choose the clearest route and we will point you in the right direction.", sections: [
    { title: "Account help", body: "Use password reset for access problems, or contact us if verification does not arrive." },
    { title: "Product help", body: "Include the product name and the question you have." },
    { title: "Order help", body: "Ordering is not yet payment-live. No genuine order should be charged before checkout activation." }
  ], action: { label: "Email support", href: "mailto:hello@cothecoconutcompany.com?subject=.CO%20Support" } },
  search: { eyebrow: "Search", title: "Find your .CO ritual.", intro: "Search products, recipes and stories.", sections: [], mode: "search" },
  "track-order": { eyebrow: "Orders", title: "Track an order.", intro: "Order tracking will activate alongside live checkout. No order reference is created by this preview.", sections: [], mode: "track" },
  cart: { eyebrow: "Basket", title: "Your coconut shelf.", intro: "Use the bag icon to review saved products. Live purchasing will be enabled only after checkout verification.", sections: [], mode: "cart", action: { label: "Continue shopping", href: "/shop" } },
  checkout: { eyebrow: "Checkout", title: "Checkout is being prepared.", intro: "Payments are intentionally unavailable until fulfilment, policies and security have completed their launch gates.", sections: [{ title: "Nothing will be charged", body: "The current website is an ecommerce-ready preview, not a live payment checkout." }], mode: "checkout", action: { label: "Join early access", href: "/register" } },
  "our-story": { eyebrow: "Our story", title: "Rooted in nature. Made for living.", intro: "Meet the people, purpose and coconut thinking behind .CO.", sections: [], action: { label: "Read our story", href: "/about" } }
};

export const launchPageSlugs = Object.keys(launchPages);
