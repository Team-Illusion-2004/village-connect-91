
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileAttachment } from '@/lib/types';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { MessageCircle, Paperclip, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface CommentFormProps {
  isLoading: boolean;
  onAddComment: (content: string, attachments?: FileAttachment[]) => Promise<void>;
}

export const CommentForm = ({ isLoading, onAddComment }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

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
      setShowUploader(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleAddComment}>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment or solution..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            
            {showUploader && (
              <div className="space-y-2 border rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Attachments</p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowUploader(false)}
                  >
                    Hide
                  </Button>
                </div>
                <MediaUploader 
                  onMediaSelected={setAttachments} 
                  maxFiles={2}
                  existingFiles={attachments}
                />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-3">
          {!showUploader && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowUploader(true)}
            >
              <Paperclip className="h-4 w-4 mr-1" />
              Add Media
            </Button>
          )}
          
          <Button 
            type="submit" 
            className="ml-auto"
            disabled={isLoading || isSubmitting || (!comment.trim() && attachments.length === 0)}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-1 h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
