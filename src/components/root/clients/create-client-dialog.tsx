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
import { Plus } from "lucide-react";
import useClientStore from "@/store/client/client.store";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
}

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const { createClient, isCreating } = useClientStore();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      currency: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.name || !data.email) {
      toast.error("Name and email are required");
      return;
    }

    const success = await createClient({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address || undefined,
      currency: data.currency || undefined,
    });

    if (success) {
      toast.success("Client created successfully");
      reset();
      setOpen(false);
    } else {
      toast.error("Failed to create client");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form
          id="create-client-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Client name"
              {...register("name")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              {...register("email")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 890"
              {...register("phone")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City"
              {...register("address")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              placeholder="USD"
              {...register("currency")}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-client-form"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
