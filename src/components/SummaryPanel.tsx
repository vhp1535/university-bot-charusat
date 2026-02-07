import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Hash } from 'lucide-react';
import { ParseResult } from '../mockApi';

interface SummaryPanelProps {
  result: ParseResult | null;
  className?: string;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  result,
  className = ''
}) => {
  if (!result) {
    return (
      <div className={`space-y-6 ${className}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="polaroid-card p-8 text-center animate-float"
        >
          <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2 handwriting">📋 Waiting for your story...</h3>
          <p className="text-muted-foreground text-sm">
            Upload a PDF document to create a beautiful summary scrapbook
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="animate-writing"
      >
        <h2 className="text-3xl font-bold mb-2 handwriting">📖 Summary</h2>
        <p className="text-muted-foreground">
          AI-crafted insights from your document, beautifully presented
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {/* Document Info */}
        <div className="polaroid-card p-4 animate-polaroid-drop">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center handwriting text-lg">
              <FileText className="w-4 h-4 mr-2 text-primary" />
              {result.fileName}
            </h4>
            <span className="text-sm text-muted-foreground flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              {result.pages} pages
            </span>
          </div>
        </div>

        {/* Summary Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="scrapbook-card p-6 tape-effect animate-bob paper-texture"
        >
          <h4 className="font-semibold mb-4 flex items-center handwriting text-lg">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            ✨ Document Summary
          </h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-foreground/90 leading-relaxed animate-writing"
          >
            {result.summary}
          </motion.p>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="polaroid-card p-6 animate-drift"
        >
          <h4 className="font-semibold mb-4 handwriting text-lg">🔍 Key Insights</h4>
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start space-x-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse-glow" />
              <p className="text-sm text-foreground/80">
                📊 Comprehensive analysis with detailed methodology
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0 animate-pulse-glow" />
              <p className="text-sm text-foreground/80">
                🎯 Evidence-based findings and recommendations
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-start space-x-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse-glow" />
              <p className="text-sm text-foreground/80">
                🚀 Practical implications for implementation
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};