import { getToken } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ExternalLink, Link2, MousePointerClick } from "lucide-react";

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
    <main className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Links</h1>
          <p className="text-muted-foreground mt-1">Manage and track your shortened URLs.</p>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-24 bg-primary/5 border border-primary/10 rounded-2xl">
          <Link2 className="w-12 h-12 mx-auto text-primary/50 mb-4" />
          <h3 className="text-lg font-semibold">No links yet</h3>
          <p className="text-muted-foreground mt-1 mb-6">You haven't shortened any URLs.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {urls.map((url: any) => (
            <div key={url.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl gap-4 hover:shadow-md transition-shadow">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`} target="_blank" className="font-semibold text-primary hover:underline flex items-center gap-1.5 truncate">
                    {process.env.NEXT_PUBLIC_API_URL?.replace("http://", "").replace("https://", "")}/{url.shortCode}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground truncate" title={url.longUrl}>
                  {url.longUrl}
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 text-sm text-muted-foreground shrink-0">
                <div className="flex items-center gap-1.5" title="Total Clicks">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{url.clickCount || 0}</span>
                </div>
                <div className="text-right">
                  {format(new Date(url.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
