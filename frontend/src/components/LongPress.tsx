import { useState, useRef, ReactNode } from 'react';

interface LongPressProps {
  children: ReactNode;
  onReveal: () => void;
  duration?: number;
  className?: string;
}

export function LongPress({ children, onReveal, duration = 1500, className = '' }: LongPressProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      setIsRevealed(true);
      onReveal();
    }, duration);
  };

  const handleEnd = () => {
    setIsHolding(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className={isRevealed ? '' : 'blur-xl select-none'}>
        {children}
      </div>
      {!isRevealed && isHolding && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-sm">Hold to reveal...</div>
        </div>
      )}
    </div>
  );
}

