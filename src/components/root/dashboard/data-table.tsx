'use client';

import * as React from 'react';
import { z } from 'zod';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CircleCheck,
    Loader,
    TrendingUp,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const schema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
});

type DataRow = z.infer<typeof schema>;

export function DataTable({ data: initialData }: { data: DataRow[] }) {
    const [data] = React.useState(() => initialData);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    const pageCount = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize,
    );

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="outline">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">
                            Past Performance
                        </SelectItem>
                        <SelectItem value="key-personnel">
                            Key Personnel
                        </SelectItem>
                        <SelectItem value="focus-documents">
                            Focus Documents
                        </SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">
                        Focus Documents
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead>Header</TableHead>
                                <TableHead>Section Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Target
                                </TableHead>
                                <TableHead className="text-right">
                                    Limit
                                </TableHead>
                                <TableHead>Reviewer</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length ? (
                                paginatedData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <TableCellViewer item={row} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-muted-foreground px-1.5"
                                            >
                                                {row.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-muted-foreground px-1.5"
                                            >
                                                {row.status === 'Done' ? (
                                                    <CircleCheck className="fill-green-500 dark:fill-green-400" />
                                                ) : (
                                                    <Loader />
                                                )}
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    toast.promise(
                                                        new Promise((resolve) =>
                                                            setTimeout(
                                                                resolve,
                                                                1000,
                                                            ),
                                                        ),
                                                        {
                                                            loading: `Saving ${row.header}`,
                                                            success: 'Done',
                                                            error: 'Error',
                                                        },
                                                    );
                                                }}
                                            >
                                                <Label
                                                    htmlFor={`${row.id}-target`}
                                                    className="sr-only"
                                                >
                                                    Target
                                                </Label>
                                                <Input
                                                    className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                                                    defaultValue={row.target}
                                                    id={`${row.id}-target`}
                                                />
                                            </form>
                                        </TableCell>
                                        <TableCell>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    toast.promise(
                                                        new Promise((resolve) =>
                                                            setTimeout(
                                                                resolve,
                                                                1000,
                                                            ),
                                                        ),
                                                        {
                                                            loading: `Saving ${row.header}`,
                                                            success: 'Done',
                                                            error: 'Error',
                                                        },
                                                    );
                                                }}
                                            >
                                                <Label
                                                    htmlFor={`${row.id}-limit`}
                                                    className="sr-only"
                                                >
                                                    Limit
                                                </Label>
                                                <Input
                                                    className="hover:bg-input/30 focus-visible:bg-background h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border"
                                                    defaultValue={row.limit}
                                                    id={`${row.id}-limit`}
                                                />
                                            </form>
                                        </TableCell>
                                        <TableCell>
                                            {row.reviewer !==
                                            'Assign reviewer' ? (
                                                row.reviewer
                                            ) : (
                                                <>
                                                    <Label
                                                        htmlFor={`${row.id}-reviewer`}
                                                        className="sr-only"
                                                    >
                                                        Reviewer
                                                    </Label>
                                                    <Select>
                                                        <SelectTrigger
                                                            className="w-38"
                                                            size="sm"
                                                            id={`${row.id}-reviewer`}
                                                        >
                                                            <SelectValue placeholder="Assign reviewer" />
                                                        </SelectTrigger>
                                                        <SelectContent align="end">
                                                            <SelectItem value="Eddie Lake">
                                                                Eddie Lake
                                                            </SelectItem>
                                                            <SelectItem value="Jamik Tashpulatov">
                                                                Jamik
                                                                Tashpulatov
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {data.length} total row(s)
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
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => setPageIndex(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>

            <TabsContent
                value="key-personnel"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>

            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    );
}

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--primary)' },
    mobile: { label: 'Mobile', color: 'var(--primary)' },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: DataRow }) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? 'bottom' : 'right'}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="text-foreground w-fit px-0 text-left"
                >
                    {item.header}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.header}</DrawerTitle>
                    <DrawerDescription>
                        Showing total visitors for the last 6 months
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{ left: 0, right: 10 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) =>
                                            value.slice(0, 3)
                                        }
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="dot" />
                                        }
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month{' '}
                                    <TrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Showing total visitors for the last 6
                                    months.
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Header</Label>
                            <Input id="header" defaultValue={item.header} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Type</Label>
                                <Select defaultValue={item.type}>
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Table of Contents">
                                            Table of Contents
                                        </SelectItem>
                                        <SelectItem value="Executive Summary">
                                            Executive Summary
                                        </SelectItem>
                                        <SelectItem value="Technical Approach">
                                            Technical Approach
                                        </SelectItem>
                                        <SelectItem value="Design">
                                            Design
                                        </SelectItem>
                                        <SelectItem value="Capabilities">
                                            Capabilities
                                        </SelectItem>
                                        <SelectItem value="Focus Documents">
                                            Focus Documents
                                        </SelectItem>
                                        <SelectItem value="Narrative">
                                            Narrative
                                        </SelectItem>
                                        <SelectItem value="Cover Page">
                                            Cover Page
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={item.status}>
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="In Progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="Not Started">
                                            Not Started
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="target">Target</Label>
                                <Input id="target" defaultValue={item.target} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="limit">Limit</Label>
                                <Input id="limit" defaultValue={item.limit} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="reviewer">Reviewer</Label>
                            <Select defaultValue={item.reviewer}>
                                <SelectTrigger id="reviewer" className="w-full">
                                    <SelectValue placeholder="Select a reviewer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Eddie Lake">
                                        Eddie Lake
                                    </SelectItem>
                                    <SelectItem value="Jamik Tashpulatov">
                                        Jamik Tashpulatov
                                    </SelectItem>
                                    <SelectItem value="Emily Whalen">
                                        Emily Whalen
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
