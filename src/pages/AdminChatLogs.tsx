import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getConversations } from "@/lib/storage";
import type { Conversation } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminChatLogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    setConversations(getConversations().sort((a, b) => b.createdAt - a.createdAt));
  }, [user, navigate]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Chat Logs</h1>
          <p className="text-muted-foreground text-sm">{conversations.length} conversations</p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground/70">Student chats will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Card key={conv.id}>
                <CardContent className="p-4">
                  <button
                    onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{conv.studentName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{conv.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.createdAt).toLocaleString()} · {conv.messages.length} messages
                        </p>
                      </div>
                    </div>
                    {expanded === conv.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expanded === conv.id && (
                    <div className="mt-4 space-y-2 border-t pt-3">
                      {conv.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender === "user"
                              ? "bg-chat-user text-chat-user-foreground"
                              : "bg-chat-bot text-chat-bot-foreground"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChatLogs;
