'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartDataPoint {
    date: string;
    revenue: number;
    images: number;
}

const chartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'var(--primary)',
    },
    images: {
        label: 'Images',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function ChartAreaInteractive({
    data,
    isLoading,
}: {
    data?: ChartDataPoint[];
    isLoading: boolean;
}) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState('90d');

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    const filteredData = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === '30d') daysToSubtract = 30;
        else if (timeRange === '7d') daysToSubtract = 7;

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return data.filter((item) => new Date(item.date) >= startDate);
    }, [data, timeRange]);

    if (isLoading) {
        return (
            <Card className="@container/card">
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Revenue & Images</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Daily revenue and images processed
                    </span>
                    <span className="@[540px]/card:hidden">
                        Revenue & images
                    </span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d">
                            Last 30 days
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d">
                            Last 7 days
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {filteredData.length === 0 ? (
                    <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                        No data available for the selected period.
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient
                                    id="fillRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={1.0}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="fillImages"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-images)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-images)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(
                                                value,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="images"
                                type="natural"
                                fill="url(#fillImages)"
                                stroke="var(--color-images)"
                                stackId="a"
                            />
                            <Area
                                dataKey="revenue"
                                type="natural"
                                fill="url(#fillRevenue)"
                                stroke="var(--color-revenue)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
