
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { KarmaCounter } from '@/components/ui-components/KarmaCounter';
import { useIssue } from '@/context/IssueContext';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { Issue } from '@/lib/types';
import { Award, CheckCircle, Flag, History, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriorityBadge } from '@/components/ui-components/PriorityBadge';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { TimeAgo } from '@/components/ui-components/TimeAgo';

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
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UserAvatar name={user.name} avatarUrl={user.avatar} size="lg" />
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              <div className="mt-1">
                {user.village.name} Village
              </div>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-around mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{reportedIssues.length}</div>
                <div className="text-sm text-gray-500">Reported</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{resolvedIssues.length}</div>
                <div className="text-sm text-gray-500">Resolved</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold flex justify-center">
                  <KarmaCounter showIcon={false} size="lg" />
                </div>
                <div className="text-sm text-gray-500">Karma</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/report">
                <Button>
                  <Flag className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <Tabs defaultValue="reported" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reported">Reported Issues</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Issues</TabsTrigger>
              <TabsTrigger value="karma">Karma History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reported" className="p-4">
              {reportedIssues.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't reported any issues yet.</p>
                  <Link to="/report">
                    <Button className="mt-4" variant="outline">
                      <Flag className="h-4 w-4 mr-2" />
                      Report an Issue
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportedIssues.map((issue) => (
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
              )}
            </TabsContent>
            
            <TabsContent value="resolved" className="p-4">
              {resolvedIssues.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't resolved any issues yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolvedIssues.map((issue) => (
                    <Link key={issue.id} to={`/issues/${issue.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{issue.title}</h3>
                              <div className="text-sm text-gray-500 mt-1">
                                <TimeAgo date={issue.updatedAt} />
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <StatusBadge status={issue.status} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="karma" className="p-4">
              {karmaHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No karma points earned yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {karmaHistory.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Award className="h-5 w-5 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">+{item.points} Karma Points</h3>
                              <TimeAgo date={item.timestamp} className="text-sm text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-600">{item.reason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
