"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { IEarningAggregated } from "@/types/earning.type";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const InvoiceDialog = dynamic(
  () =>
    import("./invoice-dialog").then((mod) => ({
      default: mod.InvoiceDialog,
    })),
  { ssr: false }
);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  partial: "secondary",
  unpaid: "destructive",
};

interface InvoiceOrder {
  title: string;
  images: number;
  perImagePrice: number;
  totalPrice: number;
}

export function EarningsPageContent() {
  const [earnings, setEarnings] = useState<IEarningAggregated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const pageCount = Math.max(1, Math.ceil(earnings.length / pageSize));
  const paginatedData = earnings.slice(
      pageIndex * pageSize,
      pageIndex * pageSize + pageSize
  );
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // Edit
  const [editEarning, setEditEarning] = useState<IEarningAggregated | null>(null);
  const [editStatus, setEditStatus] = useState("unpaid");
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [deleteEarning, setDeleteEarning] = useState<IEarningAggregated | null>(null);

  // Invoice
  const [invoiceEarning, setInvoiceEarning] = useState<IEarningAggregated | null>(null);
  const [invoiceOrders, setInvoiceOrders] = useState<InvoiceOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchEarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/earnings/get-earnings");
      const data = await res.json();
      if (data.success) {
        setEarnings(data.data);
        setPageIndex(0);
      }
    } catch {
      toast.error("Failed to load earnings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const getCurrency = (earning: IEarningAggregated) => {
    if (typeof earning.client === "object" && earning.client?.currency) {
      return earning.client.currency;
    }
    return "$";
  };

  const getClientName = (earning: IEarningAggregated) => {
    if (typeof earning.client === "object") return earning.client.name;
    return "Unknown";
  };

  // Edit handler
  const handleEdit = (earning: IEarningAggregated) => {
    setEditEarning(earning);
    setEditStatus(earning.status);
  };

  const onEditSubmit = async () => {
    if (!editEarning) return;
    setIsSaving(true);
    try {
      const clientId =
        typeof editEarning.client === "object"
          ? editEarning.client._id
          : editEarning.client;

      const res = await fetch("/api/earnings/update-earning", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          month: editEarning.month,
          year: editEarning.year,
          status: editStatus,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Payment status updated");
      setEditEarning(null);
      fetchEarnings();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const onDelete = async () => {
    if (!deleteEarning) return;
    try {
      const clientId =
        typeof deleteEarning.client === "object"
          ? deleteEarning.client._id
          : deleteEarning.client;

      const res = await fetch(
        `/api/earnings/delete-earning?clientId=${clientId}&month=${deleteEarning.month}&year=${deleteEarning.year}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Earning record deleted");
      setDeleteEarning(null);
      fetchEarnings();
    } catch {
      toast.error("Failed to delete earning");
    }
  };

  // Invoice handler — fetch orders for this client+month before opening dialog
  const handleInvoice = async (earning: IEarningAggregated) => {
    setIsLoadingOrders(true);
    setInvoiceEarning(earning);
    try {
      const clientId =
        typeof earning.client === "object"
          ? earning.client._id
          : earning.client;

      const start = new Date(earning.year, earning.month - 1, 1).toISOString();
      const end = new Date(earning.year, earning.month, 1).toISOString();

      const res = await fetch(
        `/api/orders/get-orders?clientId=${clientId}&startDate=${start}&endDate=${end}&perPage=100`
      );
      const data = await res.json();
      if (data.success) {
        setInvoiceOrders(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.data.map((o: any) => ({
            title: o.title || "Untitled",
            images: o.images || 0,
            perImagePrice: o.perImagePrice || 0,
            totalPrice: o.totalPrice || 0,
          }))
        );
      }
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Earnings</h1>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Images</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No earnings yet. Create orders to see earnings here.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((earning) => {
                const currency = getCurrency(earning);
                return (
                  <TableRow key={earning._id}>
                    <TableCell className="font-medium">
                      {monthNames[earning.month - 1]} {earning.year}
                    </TableCell>
                    <TableCell>{getClientName(earning)}</TableCell>
                    <TableCell>{earning.orderCount}</TableCell>
                    <TableCell>{earning.totalImages}</TableCell>
                    <TableCell>
                      {currency}
                      {earning.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[earning.status] || "secondary"}>
                        {earning.status.charAt(0).toUpperCase() +
                          earning.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleInvoice(earning)}
                          disabled={isLoadingOrders}
                        >
                          <FileText className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(earning)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteEarning(earning)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {earnings.length > 0 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {earnings.length} earning record(s)
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
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
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setPageIndex((i) => i - 1)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Go to previous page</span>
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
      )}

      {/* Invoice Dialog */}
      <InvoiceDialog
        earning={invoiceEarning}
        orders={invoiceOrders}
        open={!!invoiceEarning && !isLoadingOrders}
        onClose={() => setInvoiceEarning(null)}
      />

      {/* Edit Status Dialog */}
      <Dialog
        open={!!editEarning}
        onOpenChange={(open) => !open && setEditEarning(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {editEarning &&
                `${getClientName(editEarning)} — ${monthNames[editEarning.month - 1]} ${editEarning.year}`}
            </p>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger id="edit-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onEditSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteEarning}
        onOpenChange={(open) => !open && setDeleteEarning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Earning Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the earning record for{" "}
              {deleteEarning && getClientName(deleteEarning)} (
              {deleteEarning &&
                `${monthNames[deleteEarning.month - 1]} ${deleteEarning.year}`}
              )? This will also delete all associated orders. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
