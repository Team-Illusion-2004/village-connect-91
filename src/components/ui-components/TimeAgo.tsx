
import { formatRelativeTime } from "@/lib/utils";

interface TimeAgoProps {
  date: Date;
  className?: string;
}

export const TimeAgo = ({ date, className = "" }: TimeAgoProps) => {
  return (
    <span className={`text-xs text-muted-foreground ${className}`} title={date.toString()}>
      {formatRelativeTime(date)}
    </span>
  );
};
