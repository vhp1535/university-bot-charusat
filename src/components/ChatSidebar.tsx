import { getConversations } from "@/lib/storage";
import type { Conversation } from "@/lib/types";
import { useEffect, useState } from "react";
import { MessageSquare, Plus, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  currentConversationId: string;
  onSelectConversation: (conv: Conversation) => void;
  onNewChat: () => void;
  onClose?: () => void;
  studentName: string;
}

const ChatSidebar = ({
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onClose,
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
    <>
      {/* Mobile overlay */}
      {onClose && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />
      )}
      <div className={cn(
        "bg-card border-r border-border flex flex-col h-full z-40",
        "fixed inset-y-0 left-0 w-64 md:relative md:w-64"
      )}>
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Button
            onClick={onNewChat}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Chat
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
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
                onClick={() => { onSelectConversation(conv); onClose?.(); }}
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
    </>
  );
};

export default ChatSidebar;
