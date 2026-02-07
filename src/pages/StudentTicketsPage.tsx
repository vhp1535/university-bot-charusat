import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getTickets } from "@/lib/storage";
import type { Ticket } from "@/lib/types";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig = {
  open: { label: "Open", variant: "destructive" as const, icon: AlertCircle },
  "in-progress": { label: "In Progress", variant: "default" as const, icon: Clock },
  resolved: { label: "Resolved", variant: "secondary" as const, icon: CheckCircle2 },
};

const StudentTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student") { navigate("/"); return; }
    setTickets(getTickets().filter((t) => t.studentName === user.name));
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
        <Link to="/chat">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold font-sans">My Tickets</h1>
          <p className="text-xs opacity-75">Track your support requests</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <TicketIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No tickets yet</p>
            <p className="text-sm text-muted-foreground/70">Questions I can't answer will create a ticket automatically.</p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const cfg = statusConfig[ticket.status];
            const Icon = cfg.icon;
            return (
              <Card key={ticket.id} style={{ animation: "fadeInUp 0.4s ease-out" }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-sm font-bold text-accent-foreground bg-accent/20 px-2 py-0.5 rounded">{ticket.id}</code>
                    <Badge variant={cfg.variant} className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{ticket.question}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Dept: {ticket.department}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  {ticket.response && (
                    <div className="mt-3 p-3 bg-success/10 rounded-md text-sm">
                      <p className="font-semibold text-success text-xs mb-1">Admin Response:</p>
                      <p>{ticket.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentTicketsPage;
