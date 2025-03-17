
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Issue, FileAttachment } from '@/lib/types';
import { CheckCircle, X } from 'lucide-react';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { useState } from 'react';

interface IssueActionsProps {
  issue: Issue;
  user: any;
  isLoading: boolean;
  onClaimIssue: () => Promise<void>;
  onResolveIssue: (resolutionProof: FileAttachment) => Promise<void>;
  onVerifyResolution: (verified: boolean) => Promise<void>;
}

export const IssueActions = ({ 
  issue, 
  user, 
  isLoading, 
  onClaimIssue, 
  onResolveIssue, 
  onVerifyResolution 
}: IssueActionsProps) => {
  const [resolutionProof, setResolutionProof] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleResolveIssue = async () => {
    if (resolutionProof.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await onResolveIssue(resolutionProof[0]);
      setResolutionProof([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyResolution = async (verified: boolean) => {
    setIsSubmitting(true);
    
    try {
      await onVerifyResolution(verified);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardFooter className="flex justify-between border-t pt-4">
      {canClaim && (
        <Button 
          onClick={onClaimIssue} 
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
  );
};
