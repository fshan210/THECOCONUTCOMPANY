import type { Metadata } from "next";
import { SocialCocreationHub } from "@/components/journal/SocialCocreationHub";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata:Metadata=createPageMetadata({title:"Social Co-Creation Hub",description:"Build a community-powered .CO daily routine and see its live impact.",path:"/journal/social-cocreation-hub",index:true});
export default function SocialCocreationHubPage(){return <><StructuredData breadcrumbs={[{name:"Home",path:"/"},{name:"Journal",path:"/journal"},{name:"Social Co-Creation Hub",path:"/journal/social-cocreation-hub"}]}/><SocialCocreationHub/></>;}
