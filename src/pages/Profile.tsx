
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useIssue } from '@/context/issues';
import { Issue } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ReportedIssuesList } from '@/components/profile/ReportedIssuesList';
import { ResolvedIssuesList } from '@/components/profile/ResolvedIssuesList';
import { KarmaHistoryList } from '@/components/profile/KarmaHistoryList';

const Profile = () => {
  const { user } = useAuth();
  const { issues } = useIssue();
  const [reportedIssues, setReportedIssues] = useState<Issue[]>([]);
  const [resolvedIssues, setResolvedIssues] = useState<Issue[]>([]);
  const [karmaHistory, setKarmaHistory] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user || !issues) return;
    
    // Filter issues reported by user
    const reported = issues.filter(issue => issue.reportedBy.id === user.id);
    setReportedIssues(reported);
    
    // Filter issues resolved by user
    const resolved = issues.filter(
      issue => issue.assignedTo?.id === user.id && 
      (issue.status === 'resolved' || issue.status === 'verified')
    );
    setResolvedIssues(resolved);
    
    // Mock karma history
    setKarmaHistory([
      {
        id: 'k1',
        points: 10,
        reason: 'Resolved an issue: Water supply disruption',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'k2',
        points: 5,
        reason: 'Attended village meeting',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'k3',
        points: 10,
        reason: 'Resolved an issue: Street light not working',
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
    ]);
  }, [user, issues]);
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Link to="/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileHeader 
            reportedCount={reportedIssues.length} 
            resolvedCount={resolvedIssues.length} 
          />
        </div>
        
        <Card className="md:col-span-2">
          <Tabs defaultValue="reported" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reported">Reported Issues</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Issues</TabsTrigger>
              <TabsTrigger value="karma">Karma History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reported" className="p-4">
              <ReportedIssuesList issues={reportedIssues} />
            </TabsContent>
            
            <TabsContent value="resolved" className="p-4">
              <ResolvedIssuesList issues={resolvedIssues} />
            </TabsContent>
            
            <TabsContent value="karma" className="p-4">
              <KarmaHistoryList history={karmaHistory} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
