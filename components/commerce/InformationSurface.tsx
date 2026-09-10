import { HelpQuestions } from "./HelpQuestions";
import Link from "next/link";
import { BookOpen, Heart, Leaf, Mail, Package, UserRound } from "lucide-react";
import { launchPages } from "@/lib/launch-pages";
import { ContactQuickForm } from "@/components/launch/ContactQuickForm";
import { CookiePreferencesButton } from "@/components/launch/CookiePreferencesButton";
import {
  CommerceHero,
  CommerceSurface,
  CommerceLink,
  CommerceTrust,
  CommerceClose,
} from "./Primitives";
import { PrintButton } from "./PrintButton";
const legal = [
  ["Privacy Policy", "privacy-policy"],
  ["Terms & Conditions", "terms-and-conditions"],
  ["Cookie Policy", "cookie-policy"],
] as const;
const help = [
  ["Overview", "shipping-returns"],
  ["Shipping", "shipping-delivery"],
  ["Returns", "returns"],
  ["Refunds", "refund-policy"],
  ["FAQs", "faqs"],
] as const;
export function InformationSurface({ slug }: { slug: string }) {
  const isLegal =
    slug === "legal" || slug === "terms" || legal.some((x) => x[1] === slug);
  const isContact = slug === "contact" || slug === "support";
  const page =
    launchPages[
      slug === "legal"
        ? "privacy-policy"
        : slug === "terms"
          ? "terms-and-conditions"
          : slug === "shipping-returns"
            ? "shipping-delivery"
            : slug
    ] ?? launchPages.support;
  const selected =
    slug === "legal"
      ? "privacy-policy"
      : slug === "terms"
        ? "terms-and-conditions"
        : slug;
  return (
    <CommerceSurface>
      <CommerceHero
        eyebrow={
          isLegal
            ? "Legal centre"
            : isContact
              ? "Support & contact"
              : "Help & support"
        }
        title={
          isLegal ? (
            <>
              Clear today.
              <br />
              <em>A brighter tomorrow.</em>
            </>
          ) : isContact ? (
            <>
              We’re here
              <br />
              for a{" "}
              <em>
                kinder
                <br />
                tomorrow.
              </em>
            </>
          ) : (
            <>
              Returns, refunds
              <br />
              <em>and shipping.</em>
            </>
          )
        }
        body={
          isLegal
            ? "Good business is built on trust. Explore our current policies and the choices you have when using .CO."
            : isContact
              ? "Questions, products, ideas or partnerships — we’d love to hear from you. Real people. Real support."
              : "Thoughtful guidance for your coconut journey. Our current delivery and returns information, all in one place."
        }
      />
      <div className="cm-container">
        {isLegal ? (
          <>
            <nav className="cm-tabs" aria-label="Legal documents">
              {legal.map(([label, path]) => (
                <Link
                  key={path}
                  href={`/${path}`}
                  aria-current={selected === path ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="cm-legal-layout">
              <aside className="cm-stack">
                <nav
                  className="cm-panel cm-document-nav"
                  aria-label="In this page"
                >
                  <h2>In this page</h2>
                  {page.sections.map((section, i) => (
                    <a key={section.title} href={`#document-${i}`}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  ))}
                  <PrintButton />
                </nav>
                <section className="cm-panel">
                  <p className="cm-eyebrow">Have a question?</p>
                  <h2>
                    We’re here
                    <br />
                    <em>for you.</em>
                  </h2>
                  <p>For legal or privacy questions, contact our team.</p>
                  <CommerceLink href="/contact">Contact support</CommerceLink>
                </section>
              </aside>
              <article className="cm-panel cm-document">
                <p className="cm-eyebrow">{page.eyebrow}</p>
                <h2>{page.title}</h2>
                <p>{page.intro}</p>
                {page.sections.map((section, i) => (
                  <section
                    id={`document-${i}`}
                    tabIndex={-1}
                    key={section.title}
                  >
                    <span className="cm-section-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  </section>
                ))}
                {selected === "cookie-policy" && (
                  <CookiePreferencesButton className="cm-button" />
                )}
              </article>
            </div>
          </>
        ) : isContact ? (
          <>
            <div className="cm-support-categories">
              {[
                {
                  title: "My order",
                  body: "Ordering and tracking",
                  href: "/track-order",
                  Icon: Package,
                },
                {
                  title: "Products",
                  body: "Explore the collection",
                  href: "/shop",
                  Icon: BookOpen,
                },
                {
                  title: "My account",
                  body: "Your saved details",
                  href: "/account",
                  Icon: UserRound,
                },
                {
                  title: "Returns & refunds",
                  body: "Current guidance",
                  href: "/returns",
                  Icon: Heart,
                },
                {
                  title: "Sustainability",
                  body: "Our coconut story",
                  href: "/sustainability",
                  Icon: Leaf,
                },
                {
                  title: "Wholesale & media",
                  body: "Start a conversation",
                  href: "#contact-form",
                  Icon: Mail,
                },
              ].map(({ title, body, href, Icon }) => (
                <Link className="cm-panel" key={title} href={href}>
                  <Icon />
                  <h2>{title}</h2>
                  <p>{body}</p>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <div className="cm-split">
              <div className="cm-stack">
                <FAQ />
                <section id="contact-form" className="cm-contact-form">
                  <ContactQuickForm />
                </section>
              </div>
              <aside className="cm-stack">
                <section className="cm-panel cm-contact-card">
                  <Mail />
                  <p className="cm-eyebrow">Email support</p>
                  <h2>
                    Good questions.
                    <br />
                    <em>Real conversations.</em>
                  </h2>
                  <p>
                    Product questions, account help or an idea to share — our
                    team is here to help.
                  </p>
                  <CommerceLink href="mailto:hello@cothecoconutcompany.com">
                    Email our team
                  </CommerceLink>
                </section>
                <section className="cm-panel">
                  <p className="cm-eyebrow">Wholesale, partnerships & media</p>
                  <h2>Let’s make something good.</h2>
                  <p>
                    For retail, cafe, hospitality and distributor conversations,
                    tell us a little about your business.
                  </p>
                  <a
                    className="cm-email"
                    href="mailto:hello@cothecoconutcompany.com"
                  >
                    hello@cothecoconutcompany.com
                  </a>
                </section>
                <section className="cm-panel">
                  <BookOpen />
                  <h2>
                    More resources.
                    <br />
                    Clear answers.
                  </h2>
                  <p>
                    Explore our current delivery guidance, account help and
                    product information.
                  </p>
                  <CommerceLink href="/faqs" secondary>
                    Visit our help centre
                  </CommerceLink>
                </section>
              </aside>
            </div>
          </>
        ) : (
          <>
            <nav className="cm-tabs" aria-label="Help topics">
              {help.map(([label, path]) => (
                <Link
                  href={`/${path}`}
                  key={path}
                  aria-current={slug === path ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="cm-split">
              <section className="cm-panel cm-help-intro">
                <p className="cm-eyebrow">Our commitment</p>
                <h2>
                  A smoother experience
                  <br />
                  <em>for a brighter tomorrow.</em>
                </h2>
                <p>{page.intro}</p>
              </section>
              <section className="cm-panel">
                <Mail />
                <p className="cm-eyebrow">Still need help?</p>
                <h2>We’re here for you.</h2>
                <CommerceLink href="/contact">Contact support</CommerceLink>
              </section>
            </div>
            <section className="cm-panel cm-policy">
              <p className="cm-eyebrow">{page.eyebrow}</p>
              <h2>{page.title}</h2>
              <div className="cm-policy-grid">
                {page.sections.map((section) => (
                  <article key={section.title}>
                    <Package />
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </article>
                ))}
              </div>
              {page.action && (
                <CommerceLink href={page.action.href}>
                  {page.action.label}
                </CommerceLink>
              )}
            </section>
            {slug !== "faqs" && <FAQ />}
          </>
        )}
        <CommerceClose />
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
function FAQ() {
  return (
    <HelpQuestions
      questions={[
        ...launchPages.faqs.sections,
        ...launchPages.support.sections,
      ]}
    />
  );
}
