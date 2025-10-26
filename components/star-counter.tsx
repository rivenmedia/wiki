'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StarCounter({ targetCount }: { targetCount: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = targetCount / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetCount]);

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm">
      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      <span className="font-semibold tabular-nums">{count.toLocaleString()}</span>
      <span className="text-fd-muted-foreground">stars</span>
    </div>
  );
}