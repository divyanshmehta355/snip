"use client";

import * as React from "react";
import { UrlForm } from "@/components/url-form";
import { UrlResult } from "@/components/url-result";
import { Link2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [result, setResult] = React.useState<{
    shortCode: string;
    originalUrl: string;
  } | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-2xl flex flex-col items-center text-center gap-6"
      >
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 border border-primary/20 shadow-inner">
          <Link2 className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground pb-2">
          Shorten Your Links. <br /> Expand Your Reach.
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
          Create short, memorable links in seconds. Perfect for social media, marketing, or sharing with friends.
        </p>

        <div className="w-full mt-8 flex flex-col items-center">
          <UrlForm onSuccess={setResult} />
          {result && (
            <UrlResult
              shortCode={result.shortCode}
              originalUrl={result.originalUrl}
            />
          )}
        </div>
      </motion.div>
    </main>
  );
}
