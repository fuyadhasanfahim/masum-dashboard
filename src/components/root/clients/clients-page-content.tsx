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
import { Skeleton } from "@/components/ui/skeleton";
import { CreateClientDialog } from "./create-client-dialog";
import { Pencil, Trash2 } from "lucide-react";

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
  const [editClient, setEditClient] = useState<IClient | null>(null);
  const [deleteClient, setDeleteClient] = useState<IClient | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditFormValues>();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients/get-clients");
      const data = await res.json();
      if (data.success) setClients(data.data);
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No clients found. Add your first client to get started.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
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
