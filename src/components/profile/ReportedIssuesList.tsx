
import { Card, CardContent } from '@/components/ui/card';
import { Issue } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui-components/PriorityBadge';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { TimeAgo } from '@/components/ui-components/TimeAgo';

interface ReportedIssuesListProps {
  issues: Issue[];
}

export const ReportedIssuesList = ({ issues }: ReportedIssuesListProps) => {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't reported any issues yet.</p>
        <Link to="/report">
          <Button className="mt-4" variant="outline">
            <Flag className="h-4 w-4 mr-2" />
            Report an Issue
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Link key={issue.id} to={`/issues/${issue.id}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{issue.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <TimeAgo date={issue.createdAt} />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
