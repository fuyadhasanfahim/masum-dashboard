import { EarningsPageContent } from "@/components/root/earnings/earnings-page-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata() {
    return createMetadata("Earnings");
}

export default function EarningsPage() {
    return <EarningsPageContent />;
}
