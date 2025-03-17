
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileAttachment } from '@/lib/types';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { MessageCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface CommentFormProps {
  isLoading: boolean;
  onAddComment: (content: string, attachments?: FileAttachment[]) => Promise<void>;
}

export const CommentForm = ({ isLoading, onAddComment }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() && attachments.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(comment, attachments.length > 0 ? attachments : undefined);
      setComment('');
      setAttachments([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAddComment} className="space-y-3">
      <Textarea
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[80px]"
      />
      
      <div className="space-y-2">
        <MediaUploader 
          onMediaSelected={setAttachments} 
          maxFiles={2}
          existingFiles={attachments}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading || isSubmitting || (!comment.trim() && attachments.length === 0)}
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          Comment
        </Button>
      </div>
    </form>
  );
};
