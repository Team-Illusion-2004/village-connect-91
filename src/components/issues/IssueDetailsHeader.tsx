
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIssue } from '@/context/IssueContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export const IssueDetailsHeader = () => {
  const navigate = useNavigate();
  const { issueId } = useParams<{ issueId: string }>();
  const { getIssueById } = useIssue();
  
  const issue = issueId ? getIssueById(issueId) : null;
  
  const handleShare = () => {
    if (navigator.share && issue) {
      navigator.share({
        title: `CivicConnect Issue: ${issue.title}`,
        text: `Check out this issue in our village: ${issue.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Issue link copied to clipboard",
      });
    }
  };
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{issue ? issue.title : 'Issue Details'}</h1>
        {issue && issue.priority && (
          <Badge className={`ml-2 ${
            issue.priority === 'high' 
              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
              : issue.priority === 'medium'
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}>
            {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
          </Badge>
        )}
      </div>
      
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};
