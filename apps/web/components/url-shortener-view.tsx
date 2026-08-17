"use client";

import * as React from "react";
import { UrlForm } from "./url-form";
import { UrlResult } from "./url-result";
import { motion } from "framer-motion";

export function UrlShortenerView({ token }: { token?: string }) {
  const [result, setResult] = React.useState<{
    shortCode: string;
    originalUrl: string;
  } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8 flex flex-col items-center"
    >
      <UrlForm onSuccess={setResult} token={token} />
      {result && (
        <UrlResult
          shortCode={result.shortCode}
          originalUrl={result.originalUrl}
        />
      )}
    </motion.div>
  );
}
