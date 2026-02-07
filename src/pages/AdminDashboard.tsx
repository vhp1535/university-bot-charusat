import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getConversations, getTickets, getFAQs } from "@/lib/storage";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Ticket, BookOpen, AlertTriangle, TrendingUp, Users } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ chats: 0, tickets: 0, resolved: 0, faqs: 0, openTickets: 0, topQueries: [] as string[] });

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    const convs = getConversations();
    const tickets = getTickets();
    const faqs = getFAQs();

    const categories: Record<string, number> = {};
    tickets.forEach((t) => { categories[t.department] = (categories[t.department] || 0) + 1; });
    const topQueries = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([dept, count]) => `${dept} (${count})`);

    setStats({
      chats: convs.length,
      tickets: tickets.length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      openTickets: tickets.filter((t) => t.status === "open").length,
      faqs: faqs.length,
      topQueries,
    });
  }, [user, navigate]);

  const cards = [
    { title: "Total Conversations", value: stats.chats, icon: MessageSquare, color: "bg-primary/10 text-primary" },
    { title: "Total Tickets", value: stats.tickets, icon: Ticket, color: "bg-accent/20 text-accent-foreground" },
    { title: "Open Tickets", value: stats.openTickets, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
    { title: "Resolved", value: stats.resolved, icon: TrendingUp, color: "bg-success/10 text-success" },
    { title: "FAQ Entries", value: stats.faqs, icon: BookOpen, color: "bg-primary/10 text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of helpdesk activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {cards.map((card) => (
            <Card key={card.title} style={{ animation: "fadeInUp 0.4s ease-out" }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{card.title}</span>
                  <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Escalation Departments</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topQueries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No escalations yet. Student chats will generate tickets when questions can't be answered.</p>
            ) : (
              <div className="space-y-2">
                {stats.topQueries.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
