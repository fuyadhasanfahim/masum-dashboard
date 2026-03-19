"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IClient } from "@/types/client.type";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateClientDialog } from "./create-client-dialog";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface EditFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
}

export function ClientsPageContent() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const pageCount = Math.max(1, Math.ceil(clients.length / pageSize));
  const paginatedData = clients.slice(
      pageIndex * pageSize,
      pageIndex * pageSize + pageSize
  );
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;
  const [editClient, setEditClient] = useState<IClient | null>(null);
  const [deleteClient, setDeleteClient] = useState<IClient | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditFormValues>();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients/get-clients");
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
        setPageIndex(0);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (editClient) {
      reset({
        name: editClient.name,
        email: editClient.email,
        phone: editClient.phone || "",
        address: editClient.address || "",
        currency: editClient.currency || "",
      });
    }
  }, [editClient, reset]);

  const onEditSubmit = async (data: EditFormValues) => {
    if (!editClient) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/clients/update-client", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editClient._id,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          address: data.address || undefined,
          currency: data.currency || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Client updated");
      setEditClient(null);
      fetchClients();
    } catch {
      toast.error("Failed to update client");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteClient) return;
    try {
      const res = await fetch(
        `/api/clients/delete-client?id=${deleteClient._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Client deleted");
      setDeleteClient(null);
      fetchClients();
    } catch {
      toast.error("Failed to delete client");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <CreateClientDialog onCreated={fetchClients} />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-24">Actions</TableHead>
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
                  No clients found. Add your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || "—"}</TableCell>
                  <TableCell>{client.address || "—"}</TableCell>
                  <TableCell>{client.currency || "—"}</TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditClient(client)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteClient(client)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {clients.length > 0 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {clients.length} client(s)
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

      {/* Edit Dialog */}
      <Dialog
        open={!!editClient}
        onOpenChange={(open) => !open && setEditClient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <form
            id="edit-client-form"
            onSubmit={handleSubmit(onEditSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input id="edit-name" {...register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input id="edit-email" type="email" {...register("email")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" {...register("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" {...register("address")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Input id="edit-currency" {...register("currency")} />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="edit-client-form"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteClient}
        onOpenChange={(open) => !open && setDeleteClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteClient?.name}&quot;?
              This action cannot be undone.
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
