
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, File, ImageIcon, Trash2, Upload, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FileAttachment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  onMediaSelected: (media: FileAttachment[]) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video')[];
  existingFiles?: FileAttachment[];
  className?: string;
}

export function MediaUploader({
  onMediaSelected,
  maxFiles = 3,
  allowedTypes = ['image', 'video'],
  existingFiles = [],
  className
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate API upload delay
    setTimeout(() => {
      const newFiles: FileAttachment[] = [];

      Array.from(files).forEach((file) => {
        // Check file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if ((isImage && allowedTypes.includes('image')) || 
            (isVideo && allowedTypes.includes('video'))) {
          
          // Create object URL for preview
          const url = URL.createObjectURL(file);
          
          // For a real application, this would be replaced with API upload logic
          const attachment: FileAttachment = {
            id: crypto.randomUUID(),
            url,
            type: isImage ? 'image' : 'video',
            thumbnailUrl: isVideo ? url : undefined
          };
          
          newFiles.push(attachment);
        } else {
          toast({
            title: "Invalid file type",
            description: `File "${file.name}" is not a supported format`,
            variant: "destructive",
          });
        }
      });

      if (newFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        onMediaSelected(updatedFiles);
      }

      setIsUploading(false);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    
    // Release object URL to avoid memory leaks
    const file = updatedFiles[index];
    if (file && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
    
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onMediaSelected(updatedFiles);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determine accepted file types based on allowedTypes
  const acceptedTypes = allowedTypes.map(type => 
    type === 'image' ? 'image/*' : 'video/*'
  ).join(',');

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedTypes}
        onChange={handleFileChange}
        multiple={maxFiles > 1}
      />
      
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {selectedFiles.map((file, index) => (
            <div key={file.id} className="relative group overflow-hidden rounded-md border">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-28 md:h-32 object-cover"
                />
              ) : (
                <div className="relative w-full h-28 md:h-32 bg-muted flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
              )}
              
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {selectedFiles.length < maxFiles && (
        <Button
          variant="outline"
          className="w-full border-dashed h-20 flex flex-col gap-1"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs mt-1">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span className="text-xs mt-1">
                {allowedTypes.length === 2 
                  ? "Upload photos or videos" 
                  : allowedTypes[0] === 'image' 
                    ? "Upload photos" 
                    : "Upload videos"}
              </span>
            </>
          )}
        </Button>
      )}
      
      <div className="text-xs text-muted-foreground">
        {selectedFiles.length}/{maxFiles} files • Max 10MB per file
      </div>
    </div>
  );
}

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
