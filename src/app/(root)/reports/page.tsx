import { createMetadata } from '@/lib/metadata';

export async function generateMetadata() {
    return createMetadata('Reports');
}

export default function ReportsPage() {
    return <div>Reports</div>;
}
