import type { User, FAQEntry } from "./types";

export const DEMO_USERS: User[] = [
  { username: "student", password: "student123", role: "student", name: "Alex Johnson" },
  { username: "admin", password: "admin123", role: "admin", name: "Dr. Sarah Miller" },
];

export const DEFAULT_FAQS: FAQEntry[] = [
  {
    id: "faq-1",
    question: "What are the tuition fees for undergraduate programs?",
    answer: "Tuition fees for undergraduate programs range from $8,000 to $12,000 per semester depending on your program. Engineering and Medical programs are at the higher end. Financial aid and installment plans are available through the Student Finance Office.",
    category: "Fees",
    keywords: ["tuition", "fees", "cost", "undergraduate", "payment", "price"],
  },
  {
    id: "faq-2",
    question: "When is the exam schedule released?",
    answer: "The final exam schedule is typically released 4 weeks before the examination period begins. You can find it on the university portal under 'Academics > Exam Schedule'. Mid-term schedules are posted by individual departments.",
    category: "Exams",
    keywords: ["exam", "schedule", "final", "midterm", "test", "examination"],
  },
  {
    id: "faq-3",
    question: "How can I view my class timetable?",
    answer: "Your class timetable is available on the student portal under 'My Courses > Timetable'. It updates automatically when you register for new courses. You can also export it to Google Calendar or iCal.",
    category: "Timetable",
    keywords: ["timetable", "schedule", "class", "course", "time", "calendar"],
  },
  {
    id: "faq-4",
    question: "What scholarships are available?",
    answer: "We offer Merit-Based Scholarships (GPA 3.5+), Need-Based Financial Aid, Athletic Scholarships, and Department-Specific Research Grants. Applications open each semester. Visit the Scholarships Office or apply online through the student portal.",
    category: "Scholarships",
    keywords: ["scholarship", "financial", "aid", "grant", "merit", "need-based"],
  },
  {
    id: "faq-5",
    question: "How do I pay my fees online?",
    answer: "Log into the student portal, go to 'Finance > Pay Fees'. We accept credit/debit cards, bank transfers, and digital wallets. Payment plans with 3 installments are available. Contact finance@university.edu for assistance.",
    category: "Fees",
    keywords: ["pay", "online", "payment", "finance", "bank", "card"],
  },
  {
    id: "faq-6",
    question: "What is the GPA requirement to maintain my scholarship?",
    answer: "Most scholarships require a minimum GPA of 3.0 to be maintained. Merit scholarships require 3.5+. If your GPA drops below the threshold, you'll receive a warning for one semester before the scholarship is revoked.",
    category: "Scholarships",
    keywords: ["gpa", "requirement", "maintain", "scholarship", "minimum", "grade"],
  },
  {
    id: "faq-7",
    question: "Where can I find past exam papers?",
    answer: "Past exam papers are available in the university library's digital repository. Go to Library > Digital Resources > Past Papers. Papers from the last 5 years are available for most courses.",
    category: "Exams",
    keywords: ["past", "paper", "previous", "exam", "library", "old"],
  },
  {
    id: "faq-8",
    question: "How do I register for courses?",
    answer: "Course registration opens 2 weeks before each semester. Log into the student portal, go to 'Registration > Add Courses'. Make sure to check prerequisites. Your academic advisor can help with course selection.",
    category: "Registration",
    keywords: ["register", "course", "enrollment", "add", "drop", "semester"],
  },
  {
    id: "faq-9",
    question: "What are the library hours?",
    answer: "The main library is open Monday-Friday 7:00 AM - 11:00 PM, Saturday 9:00 AM - 9:00 PM, and Sunday 10:00 AM - 8:00 PM. Extended hours (24/7) are available during exam periods.",
    category: "Campus",
    keywords: ["library", "hours", "open", "time", "study"],
  },
  {
    id: "faq-10",
    question: "How do I apply for a hostel room?",
    answer: "Hostel applications open in June for the fall semester. Apply through Student Portal > Housing > Apply. Priority is given to first-year and international students. Monthly rent ranges from $300-$600 depending on room type.",
    category: "Housing",
    keywords: ["hostel", "housing", "room", "accommodation", "dorm", "residence"],
  },
];

export const DEPARTMENTS = [
  "Academic Affairs",
  "Student Finance",
  "Examination Office",
  "Scholarships Office",
  "IT Support",
  "Housing Office",
  "General Inquiry",
];
