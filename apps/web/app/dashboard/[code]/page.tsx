import { getToken } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, MousePointerClick, Globe, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "./analytics-charts";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const token = await getToken();

  if (!token) {
    redirect("/");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/urls/${code}/analytics`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-24">
        <h2 className="text-2xl font-bold mb-4">Error loading analytics</h2>
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const data = await res.json();
  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${code}`;

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1 font-mono bg-muted px-2 py-1 rounded-md text-sm"
            >
              {shortUrl} <ExternalLink className="w-3 h-3" />
            </a>
            <span>&rarr;</span>
            <span className="truncate max-w-md" title={data.url.longUrl}>
              {data.url.longUrl}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MousePointerClick className="w-5 h-5" />
            <h3 className="font-medium">Total Clicks</h3>
          </div>
          <p className="text-4xl font-bold">{data.totalClicks}</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Globe className="w-5 h-5" />
            <h3 className="font-medium">Created On</h3>
          </div>
          <p className="text-2xl font-bold">
            {format(new Date(data.url.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <AnalyticsCharts data={data} />
    </main>
  );
}
