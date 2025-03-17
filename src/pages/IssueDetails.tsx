
import { useParams, useNavigate } from 'react-router-dom';
import { useIssue } from '@/context/issues';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { IssueDetailsHeader } from '@/components/issues/IssueDetailsHeader';
import { IssueDetailsCard } from '@/components/issues/IssueDetailsCard';
import { IssueActions } from '@/components/issues/IssueActions';
import { CommentForm } from '@/components/issues/CommentForm';
import { CommentList } from '@/components/issues/CommentList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const IssueDetails = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getIssueById, 
    claimIssue, 
    resolveIssue, 
    verifyResolution, 
    addComment, 
    likeComment, 
    isLoading 
  } = useIssue();
  const { toast } = useToast();
  
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
  
  const handleResolveIssue = async (resolutionProof: any) => {
    try {
      await resolveIssue(issue.id, resolutionProof);
      toast({
        title: "Issue resolved",
        description: "Your resolution is pending verification",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mark issue as resolved",
        variant: "destructive",
      });
    }
  };
  
  const handleVerifyResolution = async (verified: boolean) => {
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
    }
  };
  
  const handleAddComment = async (content: string, attachments?: any) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      toast({
        title: "Empty comment",
        description: "Please add a message or attachment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addComment(issue.id, content, attachments);
      
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
      <IssueDetailsHeader />
      
      <IssueDetailsCard issue={issue} />
      
      <Card>
        <IssueActions 
          issue={issue}
          user={user}
          isLoading={isLoading}
          onClaimIssue={handleClaimIssue}
          onResolveIssue={handleResolveIssue}
          onVerifyResolution={handleVerifyResolution}
        />
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Discussion</h2>
        
        <CommentForm 
          isLoading={isLoading}
          onAddComment={handleAddComment}
        />
        
        <div className="space-y-4 mt-6">
          <CommentList 
            comments={issue.comments}
            currentUserId={user.id}
            onLikeComment={handleLikeComment}
          />
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
