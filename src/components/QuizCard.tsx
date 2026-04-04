"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Star, Lightbulb } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number, correct: boolean) => void;
  showResult: boolean;
  timeLimit?: number; // seconds
}

export default function QuizCard({
  question,
  onAnswer,
  showResult,
  timeLimit,
}: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0);
  const [timedOut, setTimedOut] = useState(false);

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult || selectedIndex !== null || timedOut) return;
      setSelectedIndex(index);
      onAnswer(index, index === question.correctAnswer);
    },
    [showResult, selectedIndex, timedOut, onAnswer, question.correctAnswer]
  );

  // Timer
  useEffect(() => {
    if (!timeLimit || showResult || selectedIndex !== null) return;
    setTimeLeft(timeLimit);
    setTimedOut(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimedOut(true);
          onAnswer(-1, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, question.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCorrect = selectedIndex === question.correctAnswer;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-bold">
              {question.points} pts
            </span>
          </div>
          {timeLimit && !showResult && selectedIndex === null && (
            <div
              className={`flex items-center gap-1.5 text-sm font-mono font-bold ${
                timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-slate-300"
              }`}
            >
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          )}
        </div>

        <h3 className="text-white font-bold text-lg leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="px-5 pb-3 space-y-2">
        {question.options.map((option, i) => {
          let optionClass =
            "bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 cursor-pointer";

          if (showResult || selectedIndex !== null) {
            if (i === question.correctAnswer) {
              optionClass =
                "bg-emerald-500/20 border-emerald-500 text-emerald-300";
            } else if (i === selectedIndex && !isCorrect) {
              optionClass = "bg-red-500/20 border-red-500 text-red-300";
            } else {
              optionClass =
                "bg-slate-700/30 border-slate-700 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult || selectedIndex !== null || timedOut}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200 ${optionClass}`}
            >
              <span className="w-7 h-7 rounded-full bg-slate-600/50 flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {(showResult || selectedIndex !== null) &&
                i === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              {(showResult || selectedIndex !== null) &&
                i === selectedIndex &&
                !isCorrect &&
                i !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
            </button>
          );
        })}
      </div>

      {/* Result / Explanation */}
      {(showResult || selectedIndex !== null) && (
        <div className="px-5 pb-5 space-y-3">
          {/* Correct / Wrong banner */}
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold ${
              isCorrect
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Correct! +{question.points} points
              </>
            ) : timedOut ? (
              <>
                <Clock className="w-5 h-5" />
                Time&apos;s up! The answer was{" "}
                {String.fromCharCode(65 + question.correctAnswer)}
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                Not quite! The answer was{" "}
                {String.fromCharCode(65 + question.correctAnswer)}
              </>
            )}
          </div>

          {/* Explanation */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-slate-300 text-sm">{question.explanation}</p>
          </div>

          {/* Vedic Math Tip */}
          {question.vedicMathTip && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wide">
                  Vedic Math Tip
                </span>
              </div>
              <p className="text-amber-200/80 text-sm">
                {question.vedicMathTip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
