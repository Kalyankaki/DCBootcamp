"use client";

import { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";

interface ScoreBoardProps {
  points: number;
  maxPoints: number;
  label?: string;
}

export default function ScoreBoard({
  points,
  maxPoints,
  label = "Score",
}: ScoreBoardProps) {
  const [displayPoints, setDisplayPoints] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const prevPointsRef = useRef(0);

  const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const starCount = Math.max(
    0,
    Math.min(5, Math.ceil((percentage / 100) * 5))
  );

  // Animated counter
  useEffect(() => {
    const start = prevPointsRef.current;
    const end = points;
    prevPointsRef.current = points;
    if (start === end) {
      setDisplayPoints(end);
      return;
    }

    const duration = 800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPoints(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);

    // Celebrate at 100%
    if (end >= maxPoints && maxPoints > 0) {
      setCelebrating(true);
      const t = setTimeout(() => setCelebrating(false), 2000);
      return () => clearTimeout(t);
    }
  }, [points, maxPoints]);

  return (
    <div
      className={`bg-slate-800 rounded-xl border border-slate-700 p-4 text-center transition-all duration-300 ${
        celebrating ? "animate-[bounce_0.6s_ease-in-out_3]" : ""
      }`}
    >
      {celebrating && (
        <div className="text-2xl mb-1 animate-[bounce_0.5s_ease-in-out_infinite]">
          🎉
        </div>
      )}

      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </p>

      <div className="text-3xl font-extrabold text-white mb-2">
        <span className="text-emerald-400">{displayPoints.toLocaleString()}</span>
        <span className="text-slate-500 text-lg"> / {maxPoints.toLocaleString()}</span>
      </div>

      {/* Star rating */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 transition-all duration-300 ${
              i < starCount
                ? "text-amber-400 fill-amber-400 scale-110"
                : "text-slate-600"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
