'use client';

import { useEffect, useState } from 'react';
import { ChartAreaInteractive } from '@/components/root/dashboard/chart-area-interactive';
import { DataTable } from '@/components/root/dashboard/data-table';
import { SectionCards } from '@/components/root/dashboard/section-cards';

interface DashboardData {
    cards: {
        totalRevenue: { value: number; change: number };
        totalClients: { value: number };
        totalOrders: { value: number; change: number };
        totalImages: { value: number; change: number };
    };
    chartData: { date: string; revenue: number; images: number }[];
    recentOrders: {
        _id: string;
        title?: string;
        client?: { name: string } | string;
        service?: { name: string } | string;
        images?: number;
        totalPrice?: number;
        status: string;
        createdAt: string;
    }[];
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard/stats');
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch {
                // silently fail, components show empty state
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="space-y-4 md:space-y-6">
            <SectionCards data={data?.cards} isLoading={isLoading} />
            <ChartAreaInteractive data={data?.chartData} isLoading={isLoading} />
            <DataTable data={data?.recentOrders} isLoading={isLoading} />
        </div>
    );
}
