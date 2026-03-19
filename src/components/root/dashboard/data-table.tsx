'use client';

import * as React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface RecentOrder {
    _id: string;
    title?: string;
    client?: { name: string } | string;
    service?: { name: string } | string;
    images?: number;
    totalPrice?: number;
    status: string;
    createdAt: string;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    completed: 'default',
    in_progress: 'secondary',
    pending: 'outline',
    cancelled: 'destructive',
};

const statusLabel: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In Progress',
    pending: 'Pending',
    cancelled: 'Cancelled',
};

export function DataTable({
    data,
    isLoading,
}: {
    data?: RecentOrder[];
    isLoading: boolean;
}) {
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    const orders = data || [];
    const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
    const paginatedData = orders.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize,
    );

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    if (isLoading) {
        return (
            <div className="space-y-4 px-4 lg:px-6">
                <Skeleton className="h-5 w-32" />
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead className="text-right">Images</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 px-4 lg:px-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead className="text-right">Images</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length ? (
                            paginatedData.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium">
                                        {order.title || 'Untitled'}
                                    </TableCell>
                                    <TableCell>
                                        {typeof order.client === 'object'
                                            ? order.client?.name
                                            : '—'}
                                    </TableCell>
                                    <TableCell>
                                        {typeof order.service === 'object'
                                            ? order.service?.name
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {order.images || 0}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        ${(order.totalPrice || 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[order.status] || 'outline'}>
                                            {statusLabel[order.status] || order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No recent orders.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {orders.length > 0 && (
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {orders.length} order(s)
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium"
                            >
                                Rows per page
                            </Label>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={(value) => {
                                    setPageSize(Number(value));
                                    setPageIndex(0);
                                }}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-20"
                                    id="rows-per-page"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={`${size}`}
                                        >
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {pageIndex + 1} of {pageCount}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setPageIndex(0)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">
                                    Go to first page
                                </span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => setPageIndex((i) => i - 1)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => setPageIndex((i) => i + 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">
                                    Go to next page
                                </span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => setPageIndex(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">
                                    Go to last page
                                </span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
