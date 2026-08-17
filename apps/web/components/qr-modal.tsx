"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";

interface QrModalProps {
  url: string;
  trigger?: React.ReactNode;
}

export function QrModal({ url, trigger }: QrModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Set proper sizing for high quality PNG
    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      // Draw white background
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog>
      <DialogTrigger 
        render={
          (trigger as React.ReactElement) || (
            <Button variant="outline" size="sm" className="gap-2">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm" ref={qrRef}>
            <QRCode value={url} size={256} className="h-auto max-w-full" />
          </div>
          <p className="text-sm text-muted-foreground text-center break-all">
            {url}
          </p>
          <Button onClick={downloadQR} className="w-full gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
