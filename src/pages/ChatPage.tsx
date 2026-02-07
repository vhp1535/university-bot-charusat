import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getBotResponse } from "@/lib/chatEngine";
import { saveConversation, getConversations, saveTicket } from "@/lib/storage";
import type { ChatMessage, Conversation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, GraduationCap, LogOut, Ticket, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/");
      return;
    }
    initWelcome();
  }, [user, navigate]);

  const initWelcome = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "bot",
        text: `Welcome, ${user!.name}! 👋 I'm **UniBot**, your AI university assistant. Ask me about fees, exams, timetables, scholarships, and more!`,
        timestamp: Date.now(),
      },
    ]);
  };

  // When voice transcript arrives, set it as input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getBotResponse(userMsg.text, user!.name);
      const allMessages = [...newMessages, response.message];
      setMessages(allMessages);

      if (response.ticket) {
        saveTicket(response.ticket);
      }

      // Speak bot response if voice is enabled
      if (voiceEnabled) {
        speakText(response.message.text);
      }

      const conv: Conversation = {
        id: conversationId,
        studentName: user!.name,
        messages: allMessages,
        createdAt: allMessages[0].timestamp,
      };
      saveConversation(conv);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setConversationId(crypto.randomUUID());
    initWelcome();
  };

  const handleSelectConversation = (conv: Conversation) => {
    setConversationId(conv.id);
    setMessages(conv.messages);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleVoice = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
    } else {
      speechSynthesis.cancel();
      setVoiceEnabled(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          currentConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          studentName={user?.name || ""}
        />
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors"
              title="Toggle history"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans">UniBot</h1>
              <p className="text-xs opacity-75">AI University Helpdesk</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isSpeechSupported() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            )}
            <Link to="/tickets">
              <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Ticket className="w-4 h-4 mr-1" />
                My Tickets
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              style={{ animation: "fadeInUp 0.3s ease-out" }}
            >
              <div className={`flex gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "user" ? "bg-accent" : "bg-primary"
                }`}>
                  {msg.sender === "user" ? (
                    <span className="text-xs font-bold text-accent-foreground">{user?.name[0]}</span>
                  ) : (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "user"
                    ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
                    : "bg-chat-bot text-chat-bot-foreground rounded-tl-md"
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
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-chat-bot rounded-2xl rounded-tl-md px-4 py-3 flex gap-1">
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
        <div className="p-4 border-t bg-card">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            {isSpeechSupported() && (
              <Button
                type="button"
                onClick={handleMicToggle}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className={isListening ? "animate-pulse" : ""}
                title={isListening ? "Stop recording" : "Voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening…" : "Ask about fees, exams, scholarships..."}
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={!input.trim() || isTyping} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isListening ? "🎙️ Speak now — your words will appear above" : "Try: \"What are the tuition fees?\" or tap 🎤 to speak"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
