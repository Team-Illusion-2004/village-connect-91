
import { FileAttachment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Play } from "lucide-react";

interface MediaAttachmentProps {
  attachment: FileAttachment;
  className?: string;
  onClick?: () => void;
  alt?: string;
}

export const MediaAttachment = ({ 
  attachment, 
  className = "",
  onClick,
  alt = "Media attachment"
}: MediaAttachmentProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (attachment.type === "image") {
    return (
      <div className={`relative rounded-md overflow-hidden ${className}`}>
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
        )}
        <img
          src={attachment.url}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={handleLoad}
          onClick={onClick}
        />
      </div>
    );
  }

  if (attachment.type === "video") {
    return (
      <div className={`relative rounded-md overflow-hidden group ${className}`}>
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
        )}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors ${isLoading ? "opacity-0" : "opacity-100"}`}
          onClick={onClick}
        >
          <Play className="w-12 h-12 text-white" />
        </div>
        <img
          src={attachment.thumbnailUrl || attachment.url}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  return null;
};
