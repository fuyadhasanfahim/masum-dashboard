import { ServicesPageContent } from "@/components/root/services/services-page-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata() {
    return createMetadata("Services");
}

export default function ServicesPage() {
    return <ServicesPageContent />;
}
