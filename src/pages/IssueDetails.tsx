import { useParams, useNavigate } from 'react-router-dom';
import { useIssue } from '@/context/IssueContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { PriorityBadge } from '@/components/ui-components/PriorityBadge';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { MediaAttachment } from '@/components/ui-components/MediaAttachment';
import { ArrowLeft, CheckCircle, MessageCircle, ThumbsUp, X } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { FileAttachment } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const IssueDetails = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getIssueById, claimIssue, resolveIssue, verifyResolution, addComment, likeComment, isLoading } = useIssue();
  const { toast } = useToast();
  
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [resolutionProof, setResolutionProof] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!issueId || !user) return null;
  
  const issue = getIssueById(issueId);
  
  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl font-semibold mb-4">Issue Not Found</h2>
        <p className="mb-6 text-gray-600">The issue you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }
  
  const canClaim = 
    user.role === 'volunteer' || 
    user.role === 'panchayat' && 
    issue.status === 'reported' && 
    !issue.assignedTo;
    
  const canResolve = 
    issue.status !== 'resolved' && 
    issue.status !== 'verified' && 
    issue.assignedTo?.id === user.id;
    
  const canVerify = 
    issue.status === 'resolved' && 
    (issue.reportedBy.id === user.id || user.role === 'panchayat');
  
  const handleClaimIssue = async () => {
    try {
      await claimIssue(issue.id);
      toast({
        title: "Issue claimed",
        description: "You have claimed this issue and can now work on it",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to claim the issue",
        variant: "destructive",
      });
    }
  };
  
  const handleResolveIssue = async () => {
    if (resolutionProof.length === 0) {
      toast({
        title: "Proof required",
        description: "Please provide proof of resolution (photo or video)",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resolveIssue(issue.id, resolutionProof[0]);
      toast({
        title: "Issue resolved",
        description: "Your resolution is pending verification",
      });
      setResolutionProof([]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mark issue as resolved",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVerifyResolution = async (verified: boolean) => {
    setIsSubmitting(true);
    
    try {
      await verifyResolution(issue.id, verified);
      
      toast({
        title: verified ? "Resolution verified" : "Resolution rejected",
        description: verified 
          ? "The issue has been marked as verified" 
          : "The issue has been returned for further work",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to verify resolution",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() && attachments.length === 0) {
      toast({
        title: "Empty comment",
        description: "Please add a message or attachment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addComment(
        issue.id, 
        comment,
        attachments.length > 0 ? attachments : undefined
      );
      
      setComment('');
      setAttachments([]);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added to the issue",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(issue.id, commentId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Issue Details</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{issue.title}</CardTitle>
              <CardDescription className="mt-1 flex gap-2 items-center">
                <TimeAgo date={issue.createdAt} />
                <span className="text-gray-500">•</span>
                <StatusBadge status={issue.status} />
                <span className="text-gray-500">•</span>
                <PriorityBadge priority={issue.priority} />
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <UserAvatar 
              name={issue.reportedBy.name} 
              size="sm" 
            />
            <span>Reported by <strong>{issue.reportedBy.name}</strong></span>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Description</h3>
            <p className="text-sm">{issue.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Location</h3>
            <p className="text-sm">{issue.location}</p>
          </div>
          
          {issue.assignedTo && (
            <div className="flex gap-2 items-center">
              <h3 className="font-medium text-sm text-gray-500">Assigned to:</h3>
              <UserAvatar 
                name={issue.assignedTo.name} 
                size="sm" 
              />
              <span className="text-sm">{issue.assignedTo.name}</span>
            </div>
          )}
          
          {issue.attachments && issue.attachments.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">Attachments</h3>
              <div className="grid grid-cols-2 gap-2">
                {issue.attachments.map((attachment) => (
                  <MediaAttachment 
                    key={attachment.id} 
                    attachment={attachment} 
                    alt={`Attachment for ${issue.title}`} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {issue.resolutionProof && (
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">Resolution Proof</h3>
              <div className="grid grid-cols-2 gap-2">
                <MediaAttachment 
                  attachment={issue.resolutionProof} 
                  alt={`Resolution proof for ${issue.title}`} 
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          {canClaim && (
            <Button 
              onClick={handleClaimIssue} 
              disabled={isLoading || isSubmitting}
            >
              Claim Issue
            </Button>
          )}
          
          {canResolve && (
            <div className="w-full space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Resolution Proof</h3>
                <MediaUploader 
                  onMediaSelected={setResolutionProof} 
                  maxFiles={1}
                  existingFiles={resolutionProof}
                />
              </div>
              <Button 
                onClick={handleResolveIssue} 
                disabled={isLoading || isSubmitting || resolutionProof.length === 0}
                className="w-full"
              >
                Mark as Resolved
              </Button>
            </div>
          )}
          
          {canVerify && (
            <div className="flex gap-3">
              <Button 
                variant="destructive"
                onClick={() => handleVerifyResolution(false)} 
                disabled={isLoading || isSubmitting}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button 
                variant="default"
                onClick={() => handleVerifyResolution(true)} 
                disabled={isLoading || isSubmitting}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Verify
              </Button>
            </div>
          )}
          
          {!canClaim && !canResolve && !canVerify && (
            <div className="flex gap-2 text-sm text-gray-500 italic">
              <span>Status:</span>
              <StatusBadge status={issue.status} />
            </div>
          )}
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Discussion</h2>
        
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
        
        <div className="space-y-4 mt-6">
          {issue.comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
          ) : (
            issue.comments.map((comment) => (
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
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className={`h-3.5 w-3.5 ${comment.likes?.includes(user.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                          <span>{comment.likes?.length || 0}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
