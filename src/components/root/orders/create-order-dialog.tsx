"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import useOrderStore from "@/store/order/order.store";
import { IClient } from "@/types/client.type";
import { IService } from "@/types/service.type";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon, Plus } from "lucide-react";

interface FormValues {
  date: Date;
  title: string;
  images: string;
  downloadLink: string;
  localFileLocation: string;
  perImagePrice: string;
  totalPrice: string;
  client: string;
  service: string;
}

export function CreateOrderDialog() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<IClient[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [lastPriceEdited, setLastPriceEdited] = useState<
    "perImage" | "total" | null
  >(null);
  const { createOrder, isCreating } = useOrderStore();

    const { register, handleSubmit, reset, setValue, control } =
    useForm<FormValues>({
      defaultValues: {
        date: new Date(),
        title: "",
        images: "",
        downloadLink: "",
        localFileLocation: "",
        perImagePrice: "",
        totalPrice: "",
        client: "",
        service: "",
      },
    });

  const dateValue = useWatch({ control, name: "date" });
  const clientValue = useWatch({ control, name: "client" });
  const serviceValue = useWatch({ control, name: "service" });
  const imagesValue = useWatch({ control, name: "images" });
  const perImagePriceValue = useWatch({ control, name: "perImagePrice" });
  const totalPriceValue = useWatch({ control, name: "totalPrice" });

  // Auto-calculate prices
  useEffect(() => {
    const imgs = Number(imagesValue);
    if (!imgs || imgs <= 0) return;

    if (lastPriceEdited === "perImage" && perImagePriceValue) {
      const perImage = Number(perImagePriceValue);
      if (perImage > 0) {
        setValue("totalPrice", (perImage * imgs).toFixed(2));
      }
    } else if (lastPriceEdited === "total" && totalPriceValue) {
      const total = Number(totalPriceValue);
      if (total > 0) {
        setValue("perImagePrice", (total / imgs).toFixed(2));
      }
    }
  }, [
    imagesValue,
    perImagePriceValue,
    totalPriceValue,
    lastPriceEdited,
    setValue,
  ]);

  useEffect(() => {
    if (!open) return;

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
        toast.error("Failed to load clients or services");
      }
    };

    fetchData();
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      date: data.date,
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
    };

    const success = await createOrder(payload);

    if (success) {
      toast.success("Order created successfully");
      reset();
      setLastPriceEdited(null);
      setOpen(false);
    } else {
      toast.error("Failed to create order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <form
            id="create-order-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 pr-4"
          >
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!dateValue}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => date && setValue("date", date)}
                    defaultMonth={dateValue}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Order title"
                {...register("title")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={clientValue}
                onValueChange={(val) => setValue("client", val)}
              >
                <SelectTrigger id="client" className="w-full">
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
              <Label htmlFor="service">Service</Label>
              <Select
                value={serviceValue}
                onValueChange={(val) => setValue("service", val)}
              >
                <SelectTrigger id="service" className="w-full">
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
              <Label htmlFor="images">Number of Images</Label>
              <Input
                id="images"
                type="number"
                min="0"
                placeholder="0"
                {...register("images")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="downloadLink">Download Link</Label>
              <Input
                id="downloadLink"
                placeholder="https://drive.google.com/..."
                {...register("downloadLink")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="localFileLocation">Local File Location</Label>
              <Input
                id="localFileLocation"
                placeholder="D:\Projects\client-name\..."
                {...register("localFileLocation")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="perImagePrice">Per Image Price</Label>
                <Input
                  id="perImagePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("perImagePrice", {
                    onChange: () => setLastPriceEdited("perImage"),
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("totalPrice", {
                    onChange: () => setLastPriceEdited("total"),
                  })}
                />
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form="create-order-form"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
