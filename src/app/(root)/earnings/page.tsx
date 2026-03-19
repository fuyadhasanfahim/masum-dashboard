import { createMetadata } from '@/lib/metadata';

export async function generateMetadata() {
    return createMetadata('Earnings');
}

export default function EarningsPage() {
    return <div>Earnings</div>;
}
