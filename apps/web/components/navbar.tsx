import Link from "next/link";
import { getToken, logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Link2, LogIn, LogOut, LayoutDashboard } from "lucide-react";

export async function Navbar() {
  const token = await getToken();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity">
          <Link2 className="w-5 h-5" />
          <span>Snip</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <form action={logout}>
                <Button variant="secondary" size="sm" type="submit" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
