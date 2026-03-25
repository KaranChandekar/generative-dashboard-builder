"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function StreamingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="col-span-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 sm:p-8"
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
        </div>
      </div>
      <div className="flex flex-col text-center sm:text-left">
        <span className="text-sm font-semibold">AI is building your dashboard</span>
        <span className="text-xs text-muted-foreground">
          Components stream in as they are generated
        </span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
