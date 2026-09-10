"use client";
import { useState } from "react";
import {
  CommerceHero,
  CommerceSurface,
  CommerceTrust,
  CommerceLink,
} from "./Primitives";
export function TrackingSurface() {
  const [status, setStatus] = useState("");
  return (
    <CommerceSurface>
      <CommerceHero
        eyebrow="Order tracking"
        title={
          <>
            Good things
            <br />
            <em>find their way.</em>
          </>
        }
        body="Order tracking will activate alongside live checkout. No order reference is created by this preview."
      />
      <div className="cm-container">
        <section className="cm-panel cm-tracking">
          <h2>Track an order.</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus(
                "Tracking activates when live ordering launches. No matching live order exists yet.",
              );
            }}
          >
            <label htmlFor="order-reference">Order reference</label>
            <input
              id="order-reference"
              name="reference"
              required
              minLength={4}
              autoComplete="off"
              placeholder="Your order reference"
            />
            <button className="cm-button">Check status</button>
            <p role="status">{status}</p>
          </form>
          <CommerceLink href="/contact" secondary>
            Contact support
          </CommerceLink>
        </section>
        <CommerceTrust />
      </div>
    </CommerceSurface>
  );
}
