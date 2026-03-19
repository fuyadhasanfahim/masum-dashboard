'use client';

import * as React from 'react';
import { Pie, PieChart, Label } from 'recharts';

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
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export function OrderStatusChart({ data }: { data?: { status: string; count: number }[] }) {
    const totalOrders = React.useMemo(() => {
        return data?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Order Statuses</CardTitle>
                    <CardDescription>Breakdown by Status</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center min-h-[250px] text-muted-foreground">
                    No data available.
                </CardContent>
            </Card>
        );
    }

    // Dynamically build ChartConfig and chart data with proper keys/colors
    const chartConfig: ChartConfig = {
        count: {
            label: 'Orders',
        },
    };

    const chartData = data.map((item, index) => {
        // Create a safe key for the status
        const key = item.status.toLowerCase().replace(/\s+/g, '-');
        const color = COLORS[index % COLORS.length]; // Using the nice hex colors directly for consistent look

        chartConfig[key] = {
            label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            color: color,
        };

        return {
            ...item,
            statusKey: key,
            fill: `var(--color-${key})`,
        };
    });

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Order Statuses</CardTitle>
                <CardDescription>Breakdown by Status</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-4">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="statusKey"
                            innerRadius={70}
                            outerRadius={100}
                            strokeWidth={4}
                            paddingAngle={2}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {totalOrders.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Total Orders
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent />}
                            className="flex-wrap justify-center gap-2 pt-6"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
