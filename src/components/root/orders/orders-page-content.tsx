'use client';

import { CreateOrderDialog } from './create-order-dialog';
import { OrdersTable } from './orders-table';

export function OrdersPageContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Orders
                </h1>
                <CreateOrderDialog />
            </div>
            <OrdersTable />
        </div>
    );
}
