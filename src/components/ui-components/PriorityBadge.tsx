
import { getPriorityColor } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export const PriorityBadge = ({ priority, className = "" }: PriorityBadgeProps) => {
  const colorClass = getPriorityColor(priority);
  
  return (
    <span 
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`}
    >
      {priority}
    </span>
  );
};
