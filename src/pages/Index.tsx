import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../components/ThemeProvider';
import { Floating3D } from '../components/Floating3D';
import { UploadPanel } from '../components/UploadPanel';
import { SummaryPanel } from '../components/SummaryPanel';
import { QuestionPanel } from '../components/QuestionPanel';
import { ParseResult } from '../mockApi';

const Index = () => {
  const [uploadResult, setUploadResult] = useState<ParseResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Pause animations when tab is hidden
    const handleVisibilityChange = () => {
      const elements = document.querySelectorAll('.animate-float, .animate-pulse-glow');
      elements.forEach(el => {
        if (document.hidden) {
          el.classList.add('animation-paused');
        } else {
          el.classList.remove('animation-paused');
        }
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleUploadComplete = (result: ParseResult) => {
    setUploadResult(result);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
        {/* Scrapbook Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-bob" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
          
          {/* Floating Paper Scraps */}
          <div className="absolute top-1/4 right-1/4 w-16 h-20 bg-card/20 rounded-sm rotate-12 animate-drift" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-12 h-16 bg-card/15 rounded-sm -rotate-6 animate-bob" style={{ animationDelay: '3s' }} />
          <div className="absolute top-2/3 right-1/3 w-20 h-12 bg-card/10 rounded-sm rotate-3 animate-float" style={{ animationDelay: '5s' }} />
        </div>

        {/* Navigation */}
        <Navbar />

        {/* 3D Hero Element */}
        <div className="fixed top-20 right-10 w-64 h-64 pointer-events-none z-10">
          <Floating3D className="w-full h-full" />
        </div>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4 md:px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 animate-page-turn"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text handwriting">📚 Notebook LLM</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your PDFs into beautiful, interactive scrapbooks with AI-powered summaries and conversations
              </p>
              <motion.div 
                className="mt-6 text-sm text-muted-foreground/80 handwriting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                ✨ Where documents become stories ✨
              </motion.div>
            </motion.div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Upload */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <UploadPanel 
                  onUploadComplete={handleUploadComplete}
                  className="sticky top-32"
                />
              </motion.div>

              {/* Right Column - Summary & Q&A */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8"
              >
                <SummaryPanel result={uploadResult} />
                <QuestionPanel document={uploadResult} />
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="relative z-20 py-8 mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="polaroid-card p-6 text-center animate-float">
              <p className="text-sm text-muted-foreground handwriting">
                ✨ Crafted with React, Three.js, and AI magic • Scrapbook Demo ✨
              </p>
              <div className="mt-2 text-xs text-muted-foreground/60">
                Where every document tells a beautiful story
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;