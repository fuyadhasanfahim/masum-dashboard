'use client';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, DollarSign, Users, ShoppingCart, ImageIcon } from 'lucide-react';

interface CardStats {
    totalRevenue: { value: number; change: number };
    totalClients: { value: number };
    totalOrders: { value: number; change: number };
    totalImages: { value: number; change: number };
}

export function SectionCards({ data, isLoading }: { data?: CardStats; isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="@container/card">
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32 mt-2" />
                        </CardHeader>
                        <CardFooter>
                            <Skeleton className="h-4 w-40" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const cards = [
        {
            label: 'Total Revenue',
            value: `$${data.totalRevenue.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: data.totalRevenue.change,
            icon: DollarSign,
            footer: data.totalRevenue.change >= 0 ? 'Revenue is growing' : 'Revenue declined',
        },
        {
            label: 'Total Clients',
            value: data.totalClients.value.toLocaleString(),
            change: null,
            icon: Users,
            footer: `${data.totalClients.value} active clients`,
        },
        {
            label: 'Orders This Month',
            value: data.totalOrders.value.toLocaleString(),
            change: data.totalOrders.change,
            icon: ShoppingCart,
            footer: data.totalOrders.change >= 0 ? 'Orders are up' : 'Orders declined',
        },
        {
            label: 'Images This Month',
            value: data.totalImages.value.toLocaleString(),
            change: data.totalImages.change,
            icon: ImageIcon,
            footer: data.totalImages.change >= 0 ? 'Image volume is growing' : 'Image volume declined',
        },
    ];

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                const isUp = card.change !== null && card.change >= 0;
                const TrendIcon = isUp ? TrendingUp : TrendingDown;

                return (
                    <Card key={card.label} className="@container/card">
                        <CardHeader>
                            <CardDescription className="flex items-center gap-1.5">
                                <Icon className="size-3.5" />
                                {card.label}
                            </CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {card.value}
                            </CardTitle>
                            {card.change !== null && (
                                <CardAction>
                                    <Badge variant="outline">
                                        <TrendIcon />
                                        {isUp ? '+' : ''}{card.change}%
                                    </Badge>
                                </CardAction>
                            )}
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                {card.footer}{' '}
                                {card.change !== null && <TrendIcon className="size-4" />}
                            </div>
                            <div className="text-muted-foreground">
                                Compared to last month
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
