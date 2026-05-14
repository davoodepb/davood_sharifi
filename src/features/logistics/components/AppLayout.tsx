import { Link, useLocation } from "react-router-dom";
import { ClipboardCheck, FileUp, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logisticsService } from "@/features/logistics/services/logisticsService";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/upload", label: "PDF Upload", icon: FileUp },
];

interface AppLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AppLayout = ({ title, children }: AppLayoutProps) => {
  const location = useLocation();

  const handleLogout = () => {
    logisticsService.logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-blue-700">
            <ClipboardCheck className="h-5 w-5" />
            <span className="text-sm font-semibold sm:text-base">Logística Checklist PWA</span>
          </div>
          <Button variant="outline" className="h-9" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <nav className="mx-auto flex max-w-5xl gap-2 px-4 py-3">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm font-medium ${
                active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white"
              }`}
              to={link.to}
            >
              <link.icon className="mx-auto mb-1 h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <main className="mx-auto max-w-5xl px-4 pb-8">
        <h1 className="mb-4 text-2xl font-bold text-blue-700">{title}</h1>
        {children}
      </main>
    </div>
  );
};
