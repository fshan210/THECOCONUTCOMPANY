"use client";
import { RotateCcw, WifiOff } from "lucide-react";
import {
  CommerceHero,
  CommerceLink,
  CommerceSurface,
  CommerceTrust,
} from "./Primitives";
export function RecoverySurface({
  kind = "404",
  retry,
}: {
  kind?: "404" | "500" | "offline";
  retry?: () => void;
}) {
  const missing = kind === "404";
  const offline = kind === "offline";
  return (
    <CommerceSurface>
      <CommerceHero
        scene={missing ? "signpost" : "grove"}
        eyebrow={
          missing
            ? "Oops, this is awkward"
            : offline
              ? "Connection paused"
              : "Something went wrong"
        }
        title={
          missing ? (
            <>
              Even the best
              <br />
              journeys take
              <br />
              <em>a wrong turn.</em>
            </>
          ) : offline ? (
            <>
              Looks like
              <br />
              you’re <em>offline.</em>
            </>
          ) : (
            <>
              Something went
              <br />
              wrong <em>on our end.</em>
            </>
          )
        }
        body={
          missing
            ? "But don’t worry — good things are still here. Let’s get you back to the good stuff."
            : offline
              ? "We can’t reach the coconut grove right now. Check your connection, then try again."
              : "This page couldn’t load. Try again in a moment, or return to the homepage."
        }
      />
      <div className="cm-container">
        <section className="cm-panel cm-recovery">
          <div>
            <p className="cm-eyebrow">{kind}</p>
            <h2>
              {missing ? (
                <>
                  This page seems
                  <br />
                  to be in another grove.
                </>
              ) : offline ? (
                "Goodness will be here when you’re back."
              ) : (
                "Let’s try that again."
              )}
            </h2>
            <p>
              {missing
                ? "The page you’re looking for doesn’t exist or may have moved. The right place is never far."
                : "Use the button below to retry loading the page."}
            </p>
            <div className="cm-actions">
              {!missing && (
                <button
                  className="cm-button"
                  onClick={retry ?? (() => window.location.reload())}
                >
                  {offline ? <WifiOff size={17} /> : <RotateCcw size={17} />}Try
                  again
                </button>
              )}
              <CommerceLink href="/">Go to homepage</CommerceLink>
              {missing && (
                <CommerceLink href="/search" secondary>
                  Search our site
                </CommerceLink>
              )}
            </div>
            {missing && (
              <div className="cm-popular">
                {["Shop", "Recipes", "Sustainability", "Journal"].map((x) => (
                  <a href={`/${x.toLowerCase()}`} key={x}>
                    {x}
                  </a>
                ))}
              </div>
            )}
          </div>
          <span className="cm-recovery-mark" aria-hidden="true">
            {missing ? "404" : offline ? <WifiOff /> : <RotateCcw />}
          </span>
        </section>
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
