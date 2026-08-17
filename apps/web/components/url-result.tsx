"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { QrModal } from "./qr-modal";

interface UrlResultProps {
  shortCode: string;
  originalUrl: string;
}

export function UrlResult({ shortCode, originalUrl }: UrlResultProps) {
  const [copied, setCopied] = React.useState(false);
  
  // Use window.location.origin as fallback if env var is missing during client render
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const shortUrl = `${baseUrl}/${shortCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mt-8 p-6 bg-card border border-border/50 rounded-2xl shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-center">Your short link is ready!</h3>
        
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border/50">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-primary hover:underline truncate"
          >
            {shortUrl}
          </a>
          <Button
            size="icon"
            variant="secondary"
            onClick={copyToClipboard}
            className="shrink-0 transition-all hover:scale-105 active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <QrModal 
            url={shortUrl}
            trigger={
              <Button size="icon" variant="secondary" className="shrink-0 transition-all hover:scale-105 active:scale-95" title="View QR Code">
                <QrCode className="w-4 h-4" />
              </Button>
            }
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
          <span className="truncate max-w-[250px] sm:max-w-[350px]" title={originalUrl}>
            Redirects to: {originalUrl}
          </span>
          <a href={originalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
