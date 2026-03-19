import { OrdersPageContent } from '@/components/root/orders/orders-page-content';
import { createMetadata } from '@/lib/metadata';

export async function generateMetadata() {
    return createMetadata('Orders');
}

export default function OrdersPage() {
    return <OrdersPageContent />;
}
