
import { FileAttachment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, ExternalLink, Maximize, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would initiate a proper download
    const link = document.createElement('a');
    link.href = attachment.url;
    
    // Generate a default filename since the property doesn't exist in the type
    const fileExtension = attachment.type === 'image' ? 'jpg' : 'mp4';
    const defaultFilename = `download.${fileExtension}`;
    
    link.download = defaultFilename;
    link.click();
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(attachment.url, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    if (attachment.type === "image") {
      return (
        <div className={`relative rounded-md overflow-hidden group ${className}`}>
          {isLoading && (
            <Skeleton className="absolute inset-0 w-full h-full bg-muted" />
          )}
          <img
            src={attachment.url}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={handleLoad}
            onClick={onClick || handleOpenDialog}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/30">
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Maximize className="text-white h-8 w-8" />
          </div>
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
            onClick={onClick || handleOpenDialog}
          >
            <Play className="w-12 h-12 text-white" />
          </div>
          <img
            src={attachment.thumbnailUrl || attachment.url}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={handleLoad}
          />
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {renderContent()}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-1 bg-black/95">
          <div className="flex items-center justify-center h-full w-full max-h-[80vh] overflow-hidden">
            {attachment.type === "image" ? (
              <img 
                src={attachment.url} 
                alt={alt} 
                className="max-h-full max-w-full object-contain"
              />
            ) : attachment.type === "video" ? (
              <video 
                src={attachment.url} 
                controls 
                autoPlay 
                className="max-h-full max-w-full"
              />
            ) : null}
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleExternalLink}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
