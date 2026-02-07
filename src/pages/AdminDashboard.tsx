import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getConversations, getTickets, getFAQs } from "@/lib/storage";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Ticket, BookOpen, AlertTriangle, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Activity } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ chats: 0, tickets: 0, resolved: 0, faqs: 0, openTickets: 0, pendingTickets: 0, totalMessages: 0, topQueries: [] as { dept: string; count: number; pct: number }[] });

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    const convs = getConversations();
    const tickets = getTickets();
    const faqs = getFAQs();
    const totalMessages = convs.reduce((sum, c) => sum + c.messages.length, 0);

    const categories: Record<string, number> = {};
    tickets.forEach((t) => { categories[t.department] = (categories[t.department] || 0) + 1; });
    const topQueries = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([dept, count]) => ({ dept, count, pct: tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0 }));

    setStats({
      chats: convs.length,
      tickets: tickets.length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      openTickets: tickets.filter((t) => t.status === "open").length,
      pendingTickets: tickets.filter((t) => t.status === "pending").length,
      faqs: faqs.length,
      totalMessages,
      topQueries,
    });
  }, [user, navigate]);

  const statCards = [
    { title: "Total Conversations", value: stats.chats, icon: MessageSquare, trend: "+12%", up: true, color: "from-indigo-500 to-violet-500", iconBg: "bg-indigo-500/10 text-indigo-500" },
    { title: "Total Messages", value: stats.totalMessages, icon: Activity, trend: "+8%", up: true, color: "from-cyan-500 to-blue-500", iconBg: "bg-cyan-500/10 text-cyan-500" },
    { title: "Open Tickets", value: stats.openTickets, icon: AlertTriangle, trend: stats.openTickets > 0 ? `${stats.openTickets} active` : "None", up: stats.openTickets > 0, color: "from-amber-500 to-orange-500", iconBg: "bg-amber-500/10 text-amber-500" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle2, trend: stats.tickets > 0 ? `${Math.round((stats.resolved / stats.tickets) * 100)}% rate` : "—", up: true, color: "from-emerald-500 to-green-500", iconBg: "bg-emerald-500/10 text-emerald-500" },
    { title: "Knowledge Base", value: stats.faqs, icon: BookOpen, trend: "entries", up: true, color: "from-violet-500 to-purple-500", iconBg: "bg-violet-500/10 text-violet-500" },
  ];

  const resolvedPct = stats.tickets > 0 ? Math.round((stats.resolved / stats.tickets) * 100) : 0;
  const openPct = stats.tickets > 0 ? Math.round((stats.openTickets / stats.tickets) * 100) : 0;
  const pendingPct = stats.tickets > 0 ? Math.round((stats.pendingTickets / stats.tickets) * 100) : 0;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of helpdesk activity</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statCards.map((card, i) => (
            <Card key={card.title} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow" style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${card.up ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {card.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Ticket Breakdown */}
          <Card className="lg:col-span-1 border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Ticket className="w-4 h-4 text-indigo-500" />
                Ticket Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="text-center py-3">
                  <p className="text-4xl font-bold">{stats.tickets}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Tickets</p>
                </div>

                {/* Progress bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Resolved</span>
                      <span className="font-medium">{stats.resolved} ({resolvedPct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${resolvedPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Open</span>
                      <span className="font-medium">{stats.openTickets} ({openPct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${openPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Pending</span>
                      <span className="font-medium">{stats.pendingTickets} ({pendingPct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${pendingPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Departments */}
          <Card className="lg:col-span-2 border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Top Escalation Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.topQueries.length === 0 ? (
                <div className="text-center py-10">
                  <Activity className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No escalations yet</p>
                  <p className="text-xs text-muted-foreground/70">Student chats will generate tickets when questions can't be answered.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topQueries.map((q, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium truncate">{q.dept}</span>
                          <span className="text-xs text-muted-foreground ml-2">{q.count} tickets</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${q.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <Card className="border border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Avg. Response</p>
                <p className="text-xs text-muted-foreground">~1.2s AI response time</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Resolution Rate</p>
                <p className="text-xs text-muted-foreground">{resolvedPct}% tickets resolved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Active Users</p>
                <p className="text-xs text-muted-foreground">{stats.chats} student sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
