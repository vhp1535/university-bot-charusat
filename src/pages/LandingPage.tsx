import { useNavigate } from "react-router-dom";
import { Bot, BookOpen, HeadphonesIcon, TrendingUp, ArrowRight, GraduationCap, Sparkles, Shield, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white selection:bg-indigo-500/30" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="fixed w-full z-50 backdrop-blur-xl bg-[#0a0e1a]/70 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-black/40">
              <Bot className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">UniBot</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-white/[0.06] text-sm"
            onClick={() => navigate("/login")}
          >
            Admin Login <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/[0.12] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/[0.08] rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] mb-5 tracking-tight">
                Your Campus<br />
                <span className="text-indigo-200">
                  Support, Reimagined
                </span>
              </h1>

              <p className="text-base lg:text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Instant answers to every student query — admissions, fees, exams, schedules. 
                Available 24/7 with intelligent escalation.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
                  onClick={() => navigate("/login")}
                >
                  Start as Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 text-sm font-semibold border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] rounded-xl backdrop-blur-sm"
                  onClick={() => navigate("/login")}
                >
                  Admin Portal
                </Button>
              </div>
            </div>

            {/* Right — Chat Preview */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg relative" style={{ animation: "fadeInUp 0.8s ease-out" }}>
              <div className="relative z-10 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.12] shadow-xl shadow-black/40">
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  </div>
                  <span className="text-[10px] text-slate-500 ml-2 font-medium">UniBot Chat</span>
                </div>

                <div className="space-y-4">
                  {/* Student msg */}
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="text-indigo-400 h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-white/[0.04] p-3 rounded-lg rounded-tl-none border border-white/[0.06] text-[13px] text-slate-300">
                      What's the deadline for Spring semester registration?
                    </div>
                  </div>

                  {/* Bot reply */}
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-indigo-600/90 p-3 rounded-lg rounded-tr-none text-[13px] text-white shadow-lg shadow-indigo-600/20">
                      Registration closes on March 15th, 2026. You can apply through the student portal!
                    </div>
                  </div>

                  {/* Typing */}
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="text-indigo-400 h-4 w-4" />
                    </div>
                    <div className="bg-white/[0.04] px-4 py-3 rounded-lg rounded-tl-none border border-white/[0.06] flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 typing-dot" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 typing-dot" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 typing-dot" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-500/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-semibold mb-2 tracking-wider uppercase">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">Streamlining university support with next-generation AI tools.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Bot className="w-5 h-5" />, title: "AI Chatbot", desc: "Instant responses to 90% of student queries using advanced NLP.", color: "from-indigo-500/20 to-indigo-500/5", iconBg: "bg-indigo-500/15 text-indigo-400" },
              { icon: <BookOpen className="w-5 h-5" />, title: "Knowledge Base", desc: "Comprehensive database of university policies and information.", color: "from-cyan-500/20 to-cyan-500/5", iconBg: "bg-cyan-500/15 text-cyan-400" },
              { icon: <HeadphonesIcon className="w-5 h-5" />, title: "Smart Escalation", desc: "Seamless handoff to human staff for complex issues.", color: "from-violet-500/20 to-violet-500/5", iconBg: "bg-violet-500/15 text-violet-400" },
              { icon: <TrendingUp className="w-5 h-5" />, title: "Live Analytics", desc: "Real-time insights into student concerns and query trends.", color: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-400" },
            ].map((f, i) => (
              <div key={i} className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 transition-all hover:-translate-y-0.5 duration-300">
                <div className={`h-10 w-10 rounded-lg ${f.iconBg} flex items-center justify-center mb-3`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-semibold mb-2 tracking-wider uppercase">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Start a Chat", desc: "Open the chatbot from web or mobile" },
              { step: "02", title: "Ask Anything", desc: "AI analyzes intent and context instantly" },
              { step: "03", title: "Get Answers", desc: "Relevant info retrieved from knowledge base" },
              { step: "04", title: "Escalate if Needed", desc: "Complex queries routed to staff automatically" },
            ].map((s, i) => (
              <div key={i} className="relative p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.04] transition-all">
                <span className="text-3xl font-black text-indigo-500/20 mb-2 block">{s.step}</span>
                <h4 className="text-base font-semibold mb-1">{s.title}</h4>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="p-10 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to transform campus support?</h3>
            <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">Join thousands of students already getting instant answers with UniBot AI.</p>
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
              onClick={() => navigate("/login")}
            >
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 border-t border-white/[0.04] text-center text-slate-600 text-xs">
        <p>© 2026 UniBot AI — Built for CHARUSAT</p>
      </footer>
    </div>
  );
};

export default LandingPage;
