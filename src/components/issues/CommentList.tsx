
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { MediaAttachment } from '@/components/ui-components/MediaAttachment';
import { ChatMessage } from '@/lib/types';
import { ThumbsUp } from 'lucide-react';

interface CommentListProps {
  comments: ChatMessage[];
  currentUserId: string;
  onLikeComment: (commentId: string) => Promise<void>;
}

export const CommentList = ({ comments, currentUserId, onLikeComment }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <UserAvatar 
                name={comment.sender.name} 
                avatarUrl={comment.sender.avatar} 
                size="sm" 
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{comment.sender.name}</div>
                  <TimeAgo date={comment.timestamp} className="text-xs text-gray-500" />
                </div>
                <p className="text-sm">{comment.content}</p>
                
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {comment.attachments.map((attachment) => (
                      <MediaAttachment 
                        key={attachment.id} 
                        attachment={attachment} 
                        alt={`Comment attachment`} 
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={() => onLikeComment(comment.id)}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${comment.likes?.includes(currentUserId) ? 'fill-blue-500 text-blue-500' : ''}`} />
                    <span>{comment.likes?.length || 0}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
