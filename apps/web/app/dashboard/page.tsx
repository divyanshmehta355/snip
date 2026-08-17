import { getToken } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ExternalLink, Link2, MousePointerClick, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const token = await getToken();

  if (!token) {
    redirect("/");
  }

  // Fetch URLs for the logged in user from Fastify API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urls/me`, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const urls = await res.json();

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your shortened links.</p>
        </div>
        <Link href="/">
          <Button className="gap-2">
            <Link2 className="w-4 h-4" />
            Create New Link
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {urls.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card text-card-foreground shadow-sm">
            <h3 className="text-lg font-medium mb-2">No links yet</h3>
            <p className="text-muted-foreground mb-4">Create your first short link to start tracking it here.</p>
          </div>
        ) : (
          urls.map((url: any) => {
            const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`;
            return (
              <div
                key={url.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline flex items-center gap-1 text-lg"
                    >
                      {shortUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground truncate" title={url.longUrl}>
                    {url.longUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(url.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:ml-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                    <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{url.clickCount || 0}</span>
                  </div>
                  
                  <Link href={`/dashboard/${url.shortCode}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
