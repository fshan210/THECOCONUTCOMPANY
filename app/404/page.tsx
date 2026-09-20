import NotFound from "@/app/not-found";
import { createNotFoundMetadata } from "@/lib/seo/metadata";

export const metadata = createNotFoundMetadata();

export default function ExplicitNotFoundPage() {
  return <NotFound />;
}
