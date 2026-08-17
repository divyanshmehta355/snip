"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UrlResultProps {
  shortCode: string;
  originalUrl: string;
}

export function UrlResult({ shortCode, originalUrl }: UrlResultProps) {
  const [copied, setCopied] = React.useState(false);

  // In development, the API is running on localhost:4000
  // In production, this would be your actual domain
  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full mt-6"
    >
      <Card className="p-4 flex items-center justify-between gap-4 bg-primary/5 border-primary/20 backdrop-blur-md shadow-lg rounded-2xl">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground truncate mb-1">
            {originalUrl}
          </p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-primary flex items-center hover:underline truncate"
          >
            {shortUrl}
            <ExternalLink className="ml-2 w-4 h-4 opacity-50" />
          </a>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-xl"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </Button>
      </Card>
    </motion.div>
  );
}
