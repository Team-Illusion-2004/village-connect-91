
import { Award } from 'lucide-react';
import { useKarma } from '@/context/KarmaContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface KarmaCounterProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function KarmaCounter({ className, showIcon = true, size = 'md' }: KarmaCounterProps) {
  const { karmaPoints } = useKarma();
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevPoints, setPrevPoints] = useState(karmaPoints);
  
  useEffect(() => {
    if (karmaPoints !== prevPoints) {
      setIsPulsing(true);
      const timeout = setTimeout(() => setIsPulsing(false), 1000);
      setPrevPoints(karmaPoints);
      
      return () => clearTimeout(timeout);
    }
  }, [karmaPoints, prevPoints]);
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-medium"
  };
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1 transition-all",
        isPulsing && "karma-pulse",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Award className={cn("text-amber-500", iconSizes[size])} />
      )}
      <span>{karmaPoints}</span>
    </div>
  );
}
