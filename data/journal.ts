import { publicAssets } from "@/lib/public-assets";
import { websiteAssets } from "@/lib/website-assets";

const productImage = {
  water: websiteAssets.products.water.primary,
  melt: websiteAssets.products.melt.primary,
  faceWash: websiteAssets.products["botanica-face-wash"].primary,
  hairSerum: websiteAssets.products["botanica-hair-serum"].primary,
  shampoo: websiteAssets.products["botanica-shampoo"].primary,
  oil: websiteAssets.products["kitchen-oil"].primary,
  milk: websiteAssets.products["kitchen-milk"].primary,
} as const;

export const communityPosts=[
  {handle:"@eco.with.love",time:"2h ago",caption:"Hydration that’s planet-friendly",likes:142,image:productImage.water,category:"Ritual"},
  {handle:"@plant.powered.kitchen",time:"4h ago",caption:"Mango + coconut = summer happiness",likes:189,image:"/assets/recipes/generated/co-mango-nice-cream-editorial-4k.avif",category:"Recipe"},
  {handle:"@minimal.earth",time:"6h ago",caption:"Zero waste is a beautiful lifestyle",likes:117,image:publicAssets.recipes.seasonalBowl,category:"Living"},
  {handle:"@wellness.wanderer",time:"8h ago",caption:"My morning ritual with .CO face wash",likes:203,image:productImage.faceWash,category:"Wellness"},
  {handle:"@conscious.cook",time:"10h ago",caption:"Coconut in every kitchen ritual",likes:98,image:productImage.oil,category:"Kitchen"},
  {handle:"@dotco_couple",time:"12h ago",caption:"Building something meaningful together",likes:241,image:"/assets/founders/refined/fazil-afsala-founder-hero.png",category:"Behind .CO"},
] as const;

export const routineCards=[
  {id:"face",handle:"@botanical_bess",title:".CO Face Wash",image:productImage.faceWash,period:"morning"},
  {id:"melt",handle:"@chef_eco",title:"MELT Coconut Gelato",image:productImage.melt,period:"afternoon"},
  {id:"water",handle:"@fit.with.faiza",title:".CO Coconut Water",image:productImage.water,period:"afternoon"},
  {id:"oil",handle:"@mindful.moments",title:"Coconut Oil Pulling",image:productImage.oil,period:"night"},
  {id:"recipe",handle:"@conscious.cook",title:"Coconut Recipes",image:"/assets/recipes/generated/coconut-milk-veggie-curry.jpg",period:"night"},
  {id:"zero",handle:"@green.tales",title:"Zero Waste Kitchen",image:productImage.milk,period:"morning"},
] as const;

export const journalArticles=[
  ["Sustainability","How we’re rethinking coconut farming","5 min read","/assets/sustainability/refined/raw-materials-farmer.png"],
  ["Recipes","3 refreshing summer recipes with .CO","4 min read","/assets/journal/refined/community-coconut-table.png"],
  ["Community","Meet the changemakers in our community","6 min read","/assets/founders/refined/fazil-afsala-founder-hero.png"],
  ["Behind .CO","The journey from a dream to .CO","7 min read","/assets/home/refined/made-with-care-4k.png"],
  ["Wellness","Simple daily rituals for a better you","4 min read","/assets/skincare/Botanica-Shampoo-Lifestyle Scene.png"],
] as const;

export const communityTestimonials=[
  ["Aisha N.",".CO products have become a part of my daily rituals. Clean, conscious & effective!","/assets/social/afsala-founder-clean.png"],
  ["Rohan P.","Love the coconut water & Melt.CO ice cream! Guilt-free indulgence at its best.","/assets/social/fazil-founder-clean.png"],
  ["Sara K.","Finally a brand that walks the talk. Packaging, products, everything is on point.","/assets/social/afsala-founder-clean.png"],
] as const;
