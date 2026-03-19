import { ClientsPageContent } from "@/components/root/clients/clients-page-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata() {
    return createMetadata("Clients");
}

export default function ClientsPage() {
    return <ClientsPageContent />;
}
