
import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const colorClass = getStatusColor(status);
  const formattedStatus = status.replace("_", " ");
  
  return (
    <span 
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass} ${className}`}
    >
      {formattedStatus}
    </span>
  );
};
