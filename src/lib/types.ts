export interface User {
  username: string;
  password: string;
  role: "student" | "admin";
  name: string;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  studentName: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface Ticket {
  id: string;
  studentName: string;
  question: string;
  status: "open" | "in-progress" | "resolved";
  department: string;
  createdAt: number;
  resolvedAt?: number;
  response?: string;
}
