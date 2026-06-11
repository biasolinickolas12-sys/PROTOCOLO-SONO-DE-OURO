import React from "react";
import { Chapter } from "../types";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface ReaderProps {
  chapter: Chapter;
  fontSize: number;
  isDarkMode: boolean;
}

export const Reader: React.FC<ReaderProps> = ({ chapter, fontSize, isDarkMode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto py-8"
      >
        <h2 
          className={`text-4xl md:text-5xl font-serif mb-12 text-center italic ${isDarkMode ? "text-gold-accent" : "text-orange-700"}`}
          style={{ fontSize: `${fontSize * 2}px`, lineHeight: 1.1 }}
        >
          {chapter.title}
        </h2>
        <div 
          className={`leading-[1.8] font-reading drop-cap markdown-content ${
            isDarkMode ? "text-text-content" : "text-slate-800"
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
