'use client';

import { useEffect, useState } from 'react';
import { RevenueChart } from '@/components/root/reports/revenue-chart';
import { TopClientsChart } from '@/components/root/reports/top-clients-chart';
import { OrderStatusChart } from '@/components/root/reports/order-status-chart';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportData {
    monthlyRevenue: { month: string; revenue: number; images: number }[];
    topClients: { name: string; revenue: number; orders: number }[];
    orderStatus: { status: string; count: number }[];
}

export function ReportsPageContent() {
    const [data, setData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await fetch('/api/reports/stats');
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch {
                // components will show empty state
            } finally {
                setIsLoading(false);
            }
        }
        fetchReports();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Reports Overview</h2>
                    <p className="text-muted-foreground">
                        Analytics and metrics for your business.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <Skeleton className="h-[400px] w-full border rounded-xl" />
                    </div>
                    <div className="col-span-3 space-y-4">
                        <Skeleton className="h-[200px] w-full border rounded-xl" />
                        <Skeleton className="h-[200px] w-full border rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Reports Overview</h2>
                <p className="text-muted-foreground">
                    Analytics and metrics for your business.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Revenue Chart (Larger width) */}
                <div className="col-span-4 h-full">
                    <RevenueChart data={data?.monthlyRevenue} />
                </div>
                
                {/* Secondary Charts Stacked */}
                <div className="col-span-3 flex flex-col gap-4">
                    <TopClientsChart data={data?.topClients} />
                    <OrderStatusChart data={data?.orderStatus} />
                </div>
            </div>
        </div>
    );
}
