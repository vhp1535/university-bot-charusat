import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, BookOpen, MessageSquare, Ticket, LogOut, GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/knowledge-base", icon: BookOpen, label: "Knowledge Base" },
  { to: "/admin/chat-logs", icon: MessageSquare, label: "Chat Logs" },
  { to: "/admin/tickets", icon: Ticket, label: "Tickets" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const sidebarContent = (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm font-sans">UniBot Admin</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user?.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="md:hidden text-sidebar-foreground h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button variant="ghost" onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-background">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-sidebar text-sidebar-foreground flex items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="text-sidebar-foreground h-8 w-8">
          <Menu className="w-5 h-5" />
        </Button>
        <GraduationCap className="w-5 h-5 text-sidebar-primary" />
        <span className="font-bold text-sm">UniBot Admin</span>
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-sidebar text-sidebar-foreground flex-col">
        {sidebarContent}
      </aside>

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
};

export default AdminLayout;
