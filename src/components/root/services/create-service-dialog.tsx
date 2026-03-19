"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface FormValues {
  name: string;
  description: string;
}

interface CreateServiceDialogProps {
  onCreated: () => void;
}

export function CreateServiceDialog({ onCreated }: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.name) {
      toast.error("Name is required");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/services/create-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create service");
      }

      toast.success("Service created successfully");
      reset();
      setOpen(false);
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create service"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <form
          id="create-service-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="service-name">Name *</Label>
            <Input
              id="service-name"
              placeholder="Service name"
              {...register("name")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              placeholder="What this service involves..."
              rows={3}
              {...register("description")}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-service-form"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Add Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
