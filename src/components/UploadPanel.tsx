import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockApi, ParseResult } from '../mockApi';

interface UploadPanelProps {
  onUploadComplete: (result: ParseResult) => void;
  className?: string;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onUploadComplete,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await mockApi.parse(file);
      setUploadProgress(100);
      setTimeout(() => {
        onUploadComplete(result);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="animate-page-turn"
      >
        <h2 className="text-3xl font-bold mb-2 handwriting">📤 Upload PDF</h2>
        <p className="text-muted-foreground">
          Drop your PDF document here to transform it into an interactive scrapbook of knowledge
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div
          {...getRootProps()}
          className={`
            upload-zone min-h-[300px] flex flex-col items-center justify-center cursor-pointer
            ${isDragActive || dragOver ? 'drag-over' : ''}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-4"
              >
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Processing PDF...</p>
                  <p className="text-sm text-muted-foreground">
                    Notebook LLM is analyzing your document
                  </p>
                  <div className="w-64 mx-auto">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-6"
              >
                <motion.div
                  className="w-16 h-16 mx-auto"
                  animate={{ 
                    y: isDragActive ? -10 : 0,
                    scale: isDragActive ? 1.1 : 1 
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="w-full h-full text-primary/60" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {isDragActive ? 'Drop your PDF here' : 'Drag and drop your PDF'}
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse files
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="btn-scrapbook"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};