
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { PriorityBadge } from '@/components/ui-components/PriorityBadge';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { MediaAttachment } from '@/components/ui-components/MediaAttachment';
import { Issue } from '@/lib/types';

interface IssueDetailsCardProps {
  issue: Issue;
}

export const IssueDetailsCard = ({ issue }: IssueDetailsCardProps) => {
  return (
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
    </Card>
  );
};
