import type { FAQEntry, Conversation, Ticket } from "./types";
import { DEFAULT_FAQS } from "./mockData";

const KEYS = {
  FAQS: "helpdesk_faqs",
  CONVERSATIONS: "helpdesk_conversations",
  TICKETS: "helpdesk_tickets",
  CURRENT_CONVERSATION: "helpdesk_current_conv",
} as const;

// FAQ Storage
export function getFAQs(): FAQEntry[] {
  const stored = localStorage.getItem(KEYS.FAQS);
  if (!stored) {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
    return DEFAULT_FAQS;
  }
  return JSON.parse(stored);
}

export function saveFAQs(faqs: FAQEntry[]): void {
  localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
}

// Conversation Storage
export function getConversations(): Conversation[] {
  const stored = localStorage.getItem(KEYS.CONVERSATIONS);
  return stored ? JSON.parse(stored) : [];
}

export function saveConversation(conv: Conversation): void {
  const all = getConversations();
  const idx = all.findIndex((c) => c.id === conv.id);
  if (idx >= 0) all[idx] = conv;
  else all.push(conv);
  localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(all));
}

export function getCurrentConversationId(): string | null {
  return localStorage.getItem(KEYS.CURRENT_CONVERSATION);
}

export function setCurrentConversationId(id: string): void {
  localStorage.setItem(KEYS.CURRENT_CONVERSATION, id);
}

// Ticket Storage
export function getTickets(): Ticket[] {
  const stored = localStorage.getItem(KEYS.TICKETS);
  return stored ? JSON.parse(stored) : [];
}

export function saveTicket(ticket: Ticket): void {
  const all = getTickets();
  const idx = all.findIndex((t) => t.id === ticket.id);
  if (idx >= 0) all[idx] = ticket;
  else all.push(ticket);
  localStorage.setItem(KEYS.TICKETS, JSON.stringify(all));
}

export function saveTickets(tickets: Ticket[]): void {
  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
}
