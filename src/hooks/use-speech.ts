import { useState, useCallback, useRef, useEffect } from "react";

// ─── Language detection ───────────────────────────────────────────
const HINDI_RANGE = /[\u0900-\u097F]/;

export function detectLanguage(text: string): "hi" | "en" {
  let hindiChars = 0;
  let latinChars = 0;
  for (const ch of text) {
    if (HINDI_RANGE.test(ch)) hindiChars++;
    else if (/[a-zA-Z]/.test(ch)) latinChars++;
  }
  return hindiChars > latinChars ? "hi" : "en";
}

// ─── Voice picker (best available human-sounding voice) ──────────
let voicesLoaded = false;
const voiceCache: Record<string, SpeechSynthesisVoice | null> = {};

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      resolve(speechSynthesis.getVoices());
    };
    // Fallback timeout
    setTimeout(() => resolve(speechSynthesis.getVoices()), 1000);
  });
}

async function pickVoice(lang: "hi" | "en"): Promise<SpeechSynthesisVoice | null> {
  if (voiceCache[lang] !== undefined) return voiceCache[lang];

  const voices = await loadVoices();
  const prefix = lang === "hi" ? "hi" : "en";

  // Preferred quality indicators (Google/Microsoft/Apple voices tend to be higher quality)
  const quality = ["Google", "Microsoft", "Samantha", "Rishi", "Lekha", "Veena", "Neerja"];

  // First pass: quality voice matching language
  let match = voices.find(
    (v) => v.lang.startsWith(prefix) && quality.some((q) => v.name.includes(q))
  );

  // Second pass: any voice matching language
  if (!match) {
    match = voices.find((v) => v.lang.startsWith(prefix));
  }

  voiceCache[lang] = match || null;
  return voiceCache[lang];
}

// ─── Speech Recognition Hook ─────────────────────────────────────
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface UseSpeechRecognitionOptions {
  /** Language for recognition: "hi-IN" | "en-US" | "auto" (default auto) */
  lang?: string;
}

export function useSpeechRecognition(opts: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState<"hi" | "en">("en");
  const recognitionRef = useRef<any>(null);
  const langRef = useRef(opts.lang || "auto");

  useEffect(() => {
    langRef.current = opts.lang || "auto";
  }, [opts.lang]);

  const startListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;

    // If auto, default to Hindi to capture both scripts; otherwise use specified
    if (langRef.current === "auto") {
      recognition.lang = "hi-IN"; // Hindi recognition also captures English words
    } else {
      recognition.lang = langRef.current;
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        setDetectedLang(detectLanguage(text));
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, detectedLang, startListening, stopListening };
}

// ─── Text-to-Speech ──────────────────────────────────────────────
export async function speakText(
  text: string,
  forceLang?: "hi" | "en"
): Promise<void> {
  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const lang = forceLang || detectLanguage(text);

  // Strip markdown for clean speech
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`~]/g, "")
    .replace(/\n+/g, ". ");

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1;

  const voice = await pickVoice(lang);
  if (voice) utterance.voice = voice;

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}

// ─── Support check ───────────────────────────────────────────────
export function isSpeechSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}
