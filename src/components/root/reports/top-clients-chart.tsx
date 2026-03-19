'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function TopClientsChart({ data }: { data?: { name: string; revenue: number; orders: number }[] }) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Clients</CardTitle>
                    <CardDescription>By Total Revenue</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available.
                </CardContent>
            </Card>
        );
    }

    // Format data slightly for better display
    const formattedData = data.map(item => ({
        ...item,
        name: item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>By Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={formattedData}
                        layout="vertical"
                        margin={{ left: 10, right: 30, top: 20, bottom: 5 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={100}
                            tick={{ fontSize: 12 }}
                        />
                        <XAxis dataKey="revenue" type="number" hide />
                        <ChartTooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={[0, 4, 4, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
