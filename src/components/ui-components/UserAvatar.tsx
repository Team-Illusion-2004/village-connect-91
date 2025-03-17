
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getRandomColor } from "@/lib/utils";
import { useMemo } from "react";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const UserAvatar = ({ 
  name, 
  avatarUrl, 
  size = "md", 
  className = "" 
}: UserAvatarProps) => {
  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm": return "h-8 w-8 text-xs";
      case "lg": return "h-14 w-14 text-xl";
      case "xl": return "h-20 w-20 text-2xl";
      default: return "h-10 w-10 text-sm"; // md
    }
  }, [size]);

  // We use a deterministic "random" color based on the user's name
  const colorClass = useMemo(() => {
    const nameSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[nameSum % colors.length];
  }, [name]);

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback className={colorClass}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
