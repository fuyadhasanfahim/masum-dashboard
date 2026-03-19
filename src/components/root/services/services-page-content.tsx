"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IService } from "@/types/service.type";

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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateServiceDialog } from "./create-service-dialog";
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
  description: string;
}

export function ServicesPageContent() {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editService, setEditService] = useState<IService | null>(null);
  const [deleteService, setDeleteService] = useState<IService | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditFormValues>();

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services/get-services");
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (editService) {
      reset({
        name: editService.name,
        description: editService.description || "",
      });
    }
  }, [editService, reset]);

  const onEditSubmit = async (data: EditFormValues) => {
    if (!editService) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/services/update-service", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editService._id,
          name: data.name,
          description: data.description || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Service updated");
      setEditService(null);
      fetchServices();
    } catch {
      toast.error("Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteService) return;
    try {
      const res = await fetch(
        `/api/services/delete-service?id=${deleteService._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Service deleted");
      setDeleteService(null);
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <CreateServiceDialog onCreated={fetchServices} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No services found. Add your first service to get started.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description || "—"}</TableCell>
                  <TableCell>{formatDate(service.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditService(service)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteService(service)}
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
        open={!!editService}
        onOpenChange={(open) => !open && setEditService(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form
            id="edit-service-form"
            onSubmit={handleSubmit(onEditSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="edit-sname">Name *</Label>
              <Input id="edit-sname" {...register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sdesc">Description</Label>
              <Textarea
                id="edit-sdesc"
                rows={3}
                {...register("description")}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="edit-service-form"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteService}
        onOpenChange={(open) => !open && setDeleteService(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteService?.name}&quot;?
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
