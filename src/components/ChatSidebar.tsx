import { getConversations } from "@/lib/storage";
import type { Conversation } from "@/lib/types";
import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  currentConversationId: string;
  onSelectConversation: (conv: Conversation) => void;
  onNewChat: () => void;
  studentName: string;
}

const ChatSidebar = ({
  currentConversationId,
  onSelectConversation,
  onNewChat,
  studentName,
}: ChatSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const load = () => {
      const all = getConversations().filter((c) => c.studentName === studentName);
      all.sort((a, b) => b.createdAt - a.createdAt);
      setConversations(all);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [studentName]);

  const getPreview = (conv: Conversation) => {
    const userMsg = conv.messages.find((m) => m.sender === "user");
    if (userMsg) return userMsg.text.slice(0, 40) + (userMsg.text.length > 40 ? "…" : "");
    return "New conversation";
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button
          onClick={onNewChat}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors group",
                conv.id === currentConversationId
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <span className="truncate font-medium text-xs">
                  {getPreview(conv)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 ml-5">
                <Clock className="w-3 h-3 opacity-40" />
                <span className="text-[10px] opacity-50">
                  {formatDate(conv.createdAt)}
                </span>
                <span className="text-[10px] opacity-40 ml-auto">
                  {conv.messages.length} msgs
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
