"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUrlSchema, CreateUrlRequest } from "shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link2, Loader2, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UrlFormProps {
  onSuccess: (data: { shortCode: string; originalUrl: string }) => void;
  token?: string;
}

export function UrlForm({ onSuccess, token }: UrlFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUrlRequest>({
    resolver: zodResolver(CreateUrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleExpirationChange = (val: string) => {
    if (val === "never") {
      setValue("expiresAt", undefined);
    } else {
      const hours = parseInt(val, 10);
      const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      setValue("expiresAt", expires);
    }
  };

  const onSubmit = async (data: CreateUrlRequest) => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/urls",
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const result = await response.json();
      toast.success("URL successfully shortened!");
      onSuccess(result);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
      <div className="relative flex items-center">
        <Link2 className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <Input
          {...register("url")}
          type="url"
          placeholder="https://example.com/very/long/url..."
          className="pl-10 pr-24 h-14 text-base lg:text-lg bg-background/50 backdrop-blur-sm border-zinc-200 dark:border-white/10 shadow-sm transition-all focus-visible:ring-primary rounded-xl"
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="absolute right-1.5 h-11 rounded-lg px-6 font-semibold"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Shorten"}
        </Button>
      </div>
      {errors.url && (
        <p className="text-sm text-destructive mt-2 ml-1">
          {errors.url.message}
        </p>
      )}
      
      <div className="mt-3 flex items-center justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <Select onValueChange={handleExpirationChange} defaultValue="never">
            <SelectTrigger className="w-[140px] h-8 bg-background/50 text-xs">
              <SelectValue placeholder="Never expire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never expire</SelectItem>
              <SelectItem value="1">1 Hour</SelectItem>
              <SelectItem value="24">24 Hours</SelectItem>
              <SelectItem value="168">7 Days</SelectItem>
              <SelectItem value="720">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}
