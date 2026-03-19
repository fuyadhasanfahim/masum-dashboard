"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IEarningAggregated } from "@/types/earning.type";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface InvoiceOrder {
  title: string;
  images: number;
  perImagePrice: number;
  totalPrice: number;
}

interface InvoiceDialogProps {
  earning: IEarningAggregated | null;
  orders: InvoiceOrder[];
  open: boolean;
  onClose: () => void;
}

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

export function InvoiceDialog({
  earning,
  orders,
  open,
  onClose,
}: InvoiceDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!earning) return null;

  const clientName =
    typeof earning.client === "object" ? earning.client.name : "Unknown Client";
  const clientEmail =
    typeof earning.client === "object" ? earning.client.email : "";
  const currency =
    typeof earning.client === "object" && earning.client.currency
      ? earning.client.currency
      : "$";

  const monthName = monthNames[earning.month - 1];
  const fileName = `Invoice-${clientName.replace(/\s+/g, "_")}-${monthName}-${earning.year}.pdf`;

  const handleSend = async () => {
    if (!clientEmail) {
      toast.error("Client email is not available");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/earnings/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId:
            typeof earning.client === "object"
              ? earning.client._id
              : earning.client,
          clientName,
          clientEmail,
          month: earning.month,
          year: earning.year,
          totalImages: earning.totalImages,
          totalPrice: earning.totalPrice,
          currency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Invoice sent to ${clientEmail}`);
        onClose();
      } else {
        toast.error(data.message || "Failed to send invoice");
      }
    } catch {
      toast.error("Failed to send invoice");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { InvoiceTemplate } = await import("./invoice-template");

      const doc = (
        <InvoiceTemplate
          clientName={clientName}
          clientEmail={clientEmail}
          month={earning.month}
          year={earning.year}
          totalImages={earning.totalImages}
          totalPrice={earning.totalPrice}
          currency={currency}
          orders={orders}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice — {clientName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {monthName} {earning.year} • {earning.totalImages} images •{" "}
            {currency}
            {earning.totalPrice.toFixed(2)}
          </p>
          {clientEmail && (
            <p className="text-sm text-muted-foreground">
              Email: {clientEmail}
            </p>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              <>
                <Download />
                Download
              </>
            )}
          </Button>
          <Button onClick={handleSend} disabled={isSending || !clientEmail}>
            {isSending ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              <>
                <Send />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
