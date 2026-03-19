import { createMetadata } from '@/lib/metadata';
import { ReportsPageContent } from '@/components/root/reports/reports-page-content';

export async function generateMetadata() {
    return createMetadata('Reports Overview');
}

export default function ReportsPage() {
    return <ReportsPageContent />;
}
