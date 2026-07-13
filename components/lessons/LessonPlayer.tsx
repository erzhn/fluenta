"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Lesson } from "@/types";

interface LessonPlayerProps {
  lesson: Lesson;
  onStartExercises: () => void;
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-background text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-muted-foreground ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-muted-foreground ml-4 list-decimal">$2</li>')
    .replace(/^✅ (.+)$/gm, '<p class="flex gap-2"><span>✅</span><span>$1</span></p>')
    .replace(/^❌ (.+)$/gm, '<p class="flex gap-2"><span>❌</span><span>$1</span></p>')
    .replace(/^❓ (.+)$/gm, '<p class="flex gap-2"><span>❓</span><span>$1</span></p>')
    .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed">')
    .replace(/^(?!<)(.+)$/gm, '<p class="text-muted-foreground leading-relaxed">$1</p>');
}

export function LessonPlayer({ lesson, onStartExercises }: LessonPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }}
      />

      <div className="flex justify-end">
        <Button
          onClick={onStartExercises}
          className="bg-primary hover:bg-[#5558E3] text-white gap-2"
        >
          Start exercises
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
