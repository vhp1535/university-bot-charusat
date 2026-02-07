import type { FAQEntry, ChatMessage, Ticket } from "./types";
import { getFAQs } from "./storage";
import { DEPARTMENTS } from "./mockData";

function matchFAQ(query: string): FAQEntry | null {
  const faqs = getFAQs();
  const words = query.toLowerCase().split(/\s+/);

  let bestMatch: FAQEntry | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    let score = 0;
    const allKeywords = [
      ...faq.keywords,
      ...faq.question.toLowerCase().split(/\s+/),
    ];
    for (const word of words) {
      if (word.length < 3) continue;
      for (const kw of allKeywords) {
        if (kw.includes(word) || word.includes(kw)) {
          score++;
          break;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

function generateTicketId(): string {
  return "TKT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function guessDepartment(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("fee") || q.includes("pay") || q.includes("finance")) return "Student Finance";
  if (q.includes("exam") || q.includes("test") || q.includes("grade")) return "Examination Office";
  if (q.includes("scholar") || q.includes("grant") || q.includes("aid")) return "Scholarships Office";
  if (q.includes("hostel") || q.includes("room") || q.includes("housing")) return "Housing Office";
  if (q.includes("computer") || q.includes("wifi") || q.includes("portal")) return "IT Support";
  return "General Inquiry";
}

export interface BotResponse {
  message: ChatMessage;
  ticket?: Ticket;
}

export async function getBotResponse(
  query: string,
  studentName: string
): Promise<BotResponse> {
  // Simulate AI delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon"];
  if (greetings.some((g) => query.toLowerCase().trim().startsWith(g))) {
    return {
      message: {
        id: crypto.randomUUID(),
        sender: "bot",
        text: `Hello ${studentName}! 👋 I'm UniBot, your university helpdesk assistant. I can help you with questions about fees, exams, timetables, scholarships, and more. How can I help you today?`,
        timestamp: Date.now(),
      },
    };
  }

  const faq = matchFAQ(query);

  if (faq) {
    return {
      message: {
        id: crypto.randomUUID(),
        sender: "bot",
        text: faq.answer,
        timestamp: Date.now(),
      },
    };
  }

  // No match — escalate
  const ticketId = generateTicketId();
  const dept = guessDepartment(query);
  const ticket: Ticket = {
    id: ticketId,
    studentName,
    question: query,
    status: "open",
    department: dept,
    createdAt: Date.now(),
  };

  return {
    message: {
      id: crypto.randomUUID(),
      sender: "bot",
      text: `I'm sorry, I couldn't find a specific answer to your question. I've created a support ticket **${ticketId}** and escalated it to the **${dept}** department. A staff member will get back to you soon.\n\nYou can track your ticket status in the "My Tickets" section.`,
      timestamp: Date.now(),
    },
    ticket,
  };
}
