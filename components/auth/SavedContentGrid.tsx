"use client";
import { SavedCollection } from "@/components/account/AccountCollections";
export type SavedCard = { id: string; kind: "product" | "recipe" | "journal" | "community" | "recent"; title: string; detail: string; image: string; href: string; cartSlug?: string };
export function SavedContentGrid({initialItems}:{initialItems:SavedCard[]}) { return <SavedCollection items={initialItems}/>; }
