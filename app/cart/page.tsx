import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Cart", description: "Your .CO cart.", path: "/cart", index: false });

export default function CartRoute() { return <CartPage/>; }
