import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockApi, ParseResult, AskResult } from '../mockApi';

interface QuestionPanelProps {
  document: ParseResult | null;
  className?: string;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  document,
  className = ''
}) => {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<AskResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document || !question.trim() || isAsking) return;

    const currentQuestion = question.trim();
    setQuestion('');
    setIsAsking(true);

    try {
      const result = await mockApi.ask(currentQuestion, document.id);
      setQaHistory(prev => [...prev, result]);
    } catch (error) {
      console.error('Failed to ask question:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const isDisabled = !document || isAsking;

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="animate-writing"
      >
        <h2 className="text-3xl font-bold mb-2 handwriting">💬 Ask a Question</h2>
        <p className="text-muted-foreground">
          {document 
            ? 'Start a conversation with your document - ask anything!' 
            : 'Upload a document first to begin our chat'
          }
        </p>
      </motion.div>

      {/* Question Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="scrapbook-card p-6 space-y-4 tape-effect"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                isDisabled 
                  ? 'Upload a PDF to start asking questions...' 
                  : 'Type your question here...'
              }
              disabled={isDisabled}
              className="pr-12 bg-background/50 border-border/50 focus:border-primary/50"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isDisabled || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 btn-gradient"
            >
              {isAsking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Thinking Animation */}
        <AnimatePresence>
          {isAsking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 text-sm text-muted-foreground"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Notebook LLM is thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Q&A History */}
      {qaHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold flex items-center handwriting">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            💭 Conversation History
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {qaHistory.map((qa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                {/* Question */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 animate-bob">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="polaroid-card p-4 flex-1 animate-float">
                    <p className="text-sm handwriting">{qa.question}</p>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="scrapbook-card p-4 animate-drift paper-texture">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm leading-relaxed animate-writing"
                      >
                        {qa.answer}
                      </motion.p>
                    </div>
                    <div className="text-xs text-muted-foreground italic pl-4 handwriting">
                      📄 Source: {qa.sourceSnippet}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {qaHistory.length === 0 && document && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="polaroid-card p-8 text-center animate-float"
        >
          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4 animate-bob" />
          <h4 className="text-lg font-semibold mb-2 handwriting">💫 Start a Conversation</h4>
          <p className="text-muted-foreground text-sm">
            Ask questions about "<span className="handwriting font-medium">{document?.fileName}</span>" to get AI-powered insights
          </p>
        </motion.div>
      )}
    </div>
  );
};