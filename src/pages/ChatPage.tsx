import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getBotResponse } from "@/lib/chatEngine";
import { saveConversation, saveTicket } from "@/lib/storage";
import type { ChatMessage, Conversation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, GraduationCap, LogOut, Ticket, Mic, MicOff, Volume2, VolumeX, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ChatSidebar from "@/components/ChatSidebar";
import { useSpeechRecognition, speakText, isSpeechSupported } from "@/hooks/use-speech";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => crypto.randomUUID());
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, detectedLang, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (!user || user.role !== "student") { navigate("/"); return; }
    initWelcome();
  }, [user, navigate]);

  const initWelcome = () => {
    setMessages([{
      id: crypto.randomUUID(),
      sender: "bot",
      text: `Welcome, ${user!.name}! 👋 I'm **UniBot**, your AI university assistant. Ask me about fees, exams, timetables, scholarships, and more!`,
      timestamp: Date.now(),
    }]);
  };

  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: "user", text: input.trim(), timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    try {
      const response = await getBotResponse(userMsg.text, user!.name);
      const allMessages = [...newMessages, response.message];
      setMessages(allMessages);
      if (response.ticket) saveTicket(response.ticket);
      if (voiceEnabled) speakText(response.message.text, detectedLang);
      const conv: Conversation = { id: conversationId, studentName: user!.name, messages: allMessages, createdAt: allMessages[0].timestamp };
      saveConversation(conv);
    } finally { setIsTyping(false); }
  };

  const handleNewChat = () => { setConversationId(crypto.randomUUID()); initWelcome(); };
  const handleSelectConversation = (conv: Conversation) => { setConversationId(conv.id); setMessages(conv.messages); };
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex h-[100dvh] bg-background">
      {sidebarOpen && (
        <ChatSidebar
          currentConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onClose={() => setSidebarOpen(false)}
          studentName={user?.name || ""}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 bg-indigo-700 text-white shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Toggle history">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg font-bold tracking-tight">UniBot</h1>
              <p className="text-[10px] sm:text-xs text-white/60">AI University Helpdesk</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {isSpeechSupported() && (
              <Button variant="ghost" size="sm" onClick={() => { if (voiceEnabled) speechSynthesis.cancel(); setVoiceEnabled(!voiceEnabled); }}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0"
                title={voiceEnabled ? "Mute voice" : "Enable voice"}>
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            )}
            <Link to="/tickets">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 h-8 sm:h-9 px-2 sm:px-3">
                <Ticket className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">My Tickets</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9 p-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeInUp 0.3s ease-out" }}>
              <div className={`flex gap-2 max-w-[90%] sm:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-indigo-600" : "bg-slate-800"}`}>
                  {msg.sender === "user" ? (
                    <span className="text-[10px] sm:text-xs font-bold text-white">{user?.name[0]}</span>
                  ) : (
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm shadow-sm ${
                  msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-md" : "bg-card text-card-foreground border border-border/50 rounded-tl-md"
                }`}>
                  <div className="prose prose-sm max-w-none [&>p]:m-0">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start" style={{ animation: "fadeInUp 0.3s ease-out" }}>
              <div className="flex gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t bg-card/80 backdrop-blur-sm">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-1.5 sm:gap-2 max-w-3xl mx-auto">
            {isSpeechSupported() && (
              <Button type="button" onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "outline"} size="icon"
                className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-xl ${isListening ? "animate-pulse" : ""}`}
                title={isListening ? "Stop recording" : "Voice input"}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening…" : "Ask about fees, exams..."}
              className="flex-1 h-9 sm:h-10 text-sm rounded-xl" disabled={isTyping} />
            <Button type="submit" disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-500 text-white h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-xl shadow-md" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
            {isListening ? "🎙️ Speak now" : "Try: \"What are the tuition fees?\" or tap 🎤"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
