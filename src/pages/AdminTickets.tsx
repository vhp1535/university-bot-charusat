import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getTickets, saveTickets } from "@/lib/storage";
import type { Ticket } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Ticket as TicketIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusConfig = {
  open: { label: "Open", variant: "destructive" as const, icon: AlertCircle },
  "in-progress": { label: "In Progress", variant: "default" as const, icon: Clock },
  resolved: { label: "Resolved", variant: "secondary" as const, icon: CheckCircle2 },
};

const AdminTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resolveDialog, setResolveDialog] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    setTickets(getTickets().sort((a, b) => b.createdAt - a.createdAt));
  }, [user, navigate]);

  const handleResolve = () => {
    if (!resolveDialog) return;
    const updated = tickets.map((t) =>
      t.id === resolveDialog.id
        ? { ...t, status: "resolved" as const, resolvedAt: Date.now(), response }
        : t
    );
    saveTickets(updated);
    setTickets(updated);
    setResolveDialog(null);
    setResponse("");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tickets & Escalations</h1>
          <p className="text-muted-foreground text-sm">{tickets.length} total tickets</p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <TicketIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const cfg = statusConfig[ticket.status];
              const Icon = cfg.icon;
              return (
                <Card key={ticket.id} style={{ animation: "fadeInUp 0.4s ease-out" }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm font-bold text-accent-foreground bg-accent/20 px-2 py-0.5 rounded">{ticket.id}</code>
                          <Badge variant={cfg.variant} className="flex items-center gap-1">
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                          <Badge variant="outline">{ticket.department}</Badge>
                        </div>
                        <p className="text-sm mb-1">{ticket.question}</p>
                        <p className="text-xs text-muted-foreground">
                          By {ticket.studentName} · {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                        {ticket.response && (
                          <div className="mt-2 p-2 bg-success/10 rounded text-sm">
                            <span className="text-xs font-semibold text-success">Response: </span>
                            {ticket.response}
                          </div>
                        )}
                      </div>
                      {ticket.status !== "resolved" && (
                        <Button
                          size="sm"
                          onClick={() => { setResolveDialog(ticket); setResponse(""); }}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!resolveDialog} onOpenChange={(open) => !open && setResolveDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Ticket {resolveDialog?.id}</DialogTitle>
            </DialogHeader>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Question: {resolveDialog?.question}</p>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response to the student..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setResolveDialog(null)}>Cancel</Button>
              <Button onClick={handleResolve} disabled={!response.trim()} className="bg-success text-success-foreground hover:bg-success/90">
                Mark Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
