import { CoconutLoader } from "@/components/motion/CoconutLoader";

export default function Loading() {
  return (
    <div className="co-route-transition" aria-label="Loading .CO experience">
      <div className="co-route-leaf" />
      <CoconutLoader mode="route" label="Gathering the good stuff" />
    </div>
  );
}
