"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useOrderStore from "@/store/order/order.store";
import { IClient } from "@/types/client.type";
import { IService } from "@/types/service.type";
import { IOrder } from "@/types/order.type";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ImageIcon,
  ExternalLink,
  FolderOpen,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

const statusVariants: Record<
  IOrder["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
};

const statusLabels: Record<IOrder["status"], string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value?: number, currency?: string) {
  if (value === undefined || value === null) return "—";
  const symbol = currency || "$";
  return `${symbol}${value.toFixed(2)}`;
}

function getClientName(client?: string | IClient): string {
  if (!client) return "—";
  if (typeof client === "string") return client;
  return client.name;
}

function getClientId(client?: string | IClient): string {
  if (!client) return "";
  if (typeof client === "string") return client;
  return client._id;
}

function getClientCurrency(client?: string | IClient): string | undefined {
  if (!client || typeof client === "string") return undefined;
  return client.currency;
}

function getServiceName(service?: string | IService): string {
  if (!service) return "—";
  if (typeof service === "string") return service;
  return service.name;
}

function getServiceId(service?: string | IService): string {
  if (!service) return "";
  if (typeof service === "string") return service;
  return service._id;
}

interface EditFormValues {
  title: string;
  images: string;
  downloadLink: string;
  localFileLocation: string;
  perImagePrice: string;
  totalPrice: string;
  client: string;
  service: string;
  status: string;
  date: string;
}

export function OrdersTable() {
  const { orders, pagination, params, isLoading, fetchOrders, setParams } =
    useOrderStore();

  const [editOrder, setEditOrder] = useState<IOrder | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<IOrder | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<IClient[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [statusOrder, setStatusOrder] = useState<IOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [lastPriceEdited, setLastPriceEdited] = useState<
    "perImage" | "total" | null
  >(null);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<EditFormValues>();

  const editClientValue = watch("client");
  const editServiceValue = watch("service");
  const editStatusValue = watch("status");
  const editImagesValue = watch("images");
  const editPerImagePrice = watch("perImagePrice");
  const editTotalPrice = watch("totalPrice");

  // Auto-calculate prices in edit form
  useEffect(() => {
    const imgs = Number(editImagesValue);
    if (!imgs || imgs <= 0) return;

    if (lastPriceEdited === "perImage" && editPerImagePrice) {
      const perImage = Number(editPerImagePrice);
      if (perImage > 0) {
        setValue("totalPrice", (perImage * imgs).toFixed(2));
      }
    } else if (lastPriceEdited === "total" && editTotalPrice) {
      const total = Number(editTotalPrice);
      if (total > 0) {
        setValue("perImagePrice", (total / imgs).toFixed(2));
      }
    }
  }, [
    editImagesValue,
    editPerImagePrice,
    editTotalPrice,
    lastPriceEdited,
    setValue,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!editOrder) return;

    // Fetch clients and services for edit selects
    const fetchData = async () => {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          fetch("/api/clients/get-clients"),
          fetch("/api/services/get-services"),
        ]);
        const clientsData = await clientsRes.json();
        const servicesData = await servicesRes.json();
        if (clientsData.success) setClients(clientsData.data);
        if (servicesData.success) setServices(servicesData.data);
      } catch {
        // silent
      }
    };
    fetchData();

    reset({
      title: editOrder.title || "",
      images: editOrder.images?.toString() || "",
      downloadLink: editOrder.downloadLink || "",
      localFileLocation: editOrder.localFileLocation || "",
      perImagePrice: editOrder.perImagePrice?.toString() || "",
      totalPrice: editOrder.totalPrice?.toString() || "",
      client: getClientId(editOrder.client),
      service: getServiceId(editOrder.service),
      status: editOrder.status,
      date: editOrder.createdAt ? new Date(editOrder.createdAt).toISOString().split('T')[0] : "",
    });
    setLastPriceEdited(null);
  }, [editOrder, reset]);

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 });
  };

  const onEditSubmit = async (data: EditFormValues) => {
    if (!editOrder) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/orders/update-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editOrder._id,
          title: data.title || undefined,
          images: data.images ? Number(data.images) : undefined,
          downloadLink: data.downloadLink || undefined,
          localFileLocation: data.localFileLocation || undefined,
          perImagePrice: data.perImagePrice
            ? Number(Number(data.perImagePrice).toFixed(2))
            : undefined,
          totalPrice: data.totalPrice
            ? Number(Number(data.totalPrice).toFixed(2))
            : undefined,
          client: data.client || undefined,
          service: data.service || undefined,
          status: data.status,
          createdAt: data.date ? new Date(data.date).toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Order updated");
      setEditOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteOrder) return;
    try {
      const res = await fetch(
        `/api/orders/delete-order?id=${deleteOrder._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Order deleted");
      setDeleteOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const onStatusSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!statusOrder) return;
    
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get("status") as string;
    
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/orders/update-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: statusOrder._id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Order status updated");
      setStatusOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={params.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Per Image</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const currency = getClientCurrency(order.client);
                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.title || "—"}
                    </TableCell>
                    <TableCell>{getClientName(order.client)}</TableCell>
                    <TableCell>{getServiceName(order.service)}</TableCell>
                    <TableCell>
                      {order.images ? (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="size-4" />
                          {order.images}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.perImagePrice, currency)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.totalPrice, currency)}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {order.downloadLink && (
                          <a
                            href={order.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                        {order.localFileLocation && (
                          <FolderOpen className="size-4 text-muted-foreground" />
                        )}
                        {!order.downloadLink && !order.localFileLocation && "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Change Status"
                          onClick={() => setStatusOrder(order)}
                        >
                          <RefreshCw className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditOrder(order)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteOrder(order)}
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

      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {pagination.total} order(s)
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${params.perPage || 10}`}
                onValueChange={(value) => {
                  setParams({ perPage: Number(value), page: 1 });
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
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setParams({ page: 1 })}
                disabled={pagination.page <= 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setParams({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => setParams({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => setParams({ page: pagination.totalPages })}
                disabled={pagination.page >= pagination.totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Dialog */}
      <Dialog
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <form
              id="edit-order-form"
              onSubmit={handleSubmit(onEditSubmit)}
              className="grid gap-4 pr-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" {...register("title")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-client">Client</Label>
                <Select
                  value={editClientValue}
                  onValueChange={(val) => setValue("client", val)}
                >
                  <SelectTrigger id="edit-client" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-service">Service</Label>
                <Select
                  value={editServiceValue}
                  onValueChange={(val) => setValue("service", val)}
                >
                  <SelectTrigger id="edit-service" className="w-full">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-images">Number of Images</Label>
                <Input
                  id="edit-images"
                  type="number"
                  min="0"
                  {...register("images")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-downloadLink">Download Link</Label>
                <Input id="edit-downloadLink" {...register("downloadLink")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-localFile">Local File Location</Label>
                <Input
                  id="edit-localFile"
                  {...register("localFileLocation")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-perImage">Per Image Price</Label>
                  <Input
                    id="edit-perImage"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("perImagePrice", {
                      onChange: () => setLastPriceEdited("perImage"),
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-total">Total Price</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("totalPrice", {
                      onChange: () => setLastPriceEdited("total"),
                    })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editStatusValue}
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger id="edit-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-date">Order Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  {...register("date")}
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter>
            <Button
              type="submit"
              form="edit-order-form"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Alert */}
      <AlertDialog
        open={!!deleteOrder}
        onOpenChange={(open) => !open && setDeleteOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order
              {deleteOrder?.title ? ` "${deleteOrder.title}"` : ""}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Status Dialog */}
      <Dialog
        open={!!statusOrder}
        onOpenChange={(open) => !open && setStatusOrder(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Order Status</DialogTitle>
          </DialogHeader>
          <form
            id="change-status-form"
            onSubmit={onStatusSubmit}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="status-select">Status</Label>
              <Select
                name="status"
                defaultValue={statusOrder?.status || "pending"}
              >
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="change-status-form"
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
