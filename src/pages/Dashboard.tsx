
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useIssue } from '@/context/IssueContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, BarChart2, CheckCircle, Clock, Flag, Users, MessageSquare, Calendar } from 'lucide-react';
import { Issue, IssueStatus } from '@/lib/types';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui-components/StatusBadge';
import { Button } from '@/components/ui/button';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { getMockMeetings } from '@/lib/mockData';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6'];
const STATUS_COLORS: Record<IssueStatus, string> = {
  reported: '#ef4444',
  assigned: '#f97316',
  in_progress: '#eab308',
  resolved: '#10b981',
  verified: '#3b82f6'
};

const Dashboard = () => {
  const { user } = useAuth();
  const { issues } = useIssue();
  const [issueStats, setIssueStats] = useState<{status: string, count: number}[]>([]);
  const [priorityStats, setPriorityStats] = useState<{priority: string, count: number}[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user || !issues) return;
    
    // Calculate issue stats by status
    const statusCounts: Record<string, number> = {
      reported: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      verified: 0
    };
    
    // Calculate issue stats by priority
    const priorityCounts: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    issues.forEach(issue => {
      statusCounts[issue.status]++;
      priorityCounts[issue.priority]++;
    });
    
    setIssueStats(
      Object.keys(statusCounts).map(status => ({
        status,
        count: statusCounts[status]
      }))
    );
    
    setPriorityStats(
      Object.keys(priorityCounts).map(priority => ({
        priority,
        count: priorityCounts[priority]
      }))
    );
    
    // Get recent issues
    const recent = [...issues]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    
    setRecentIssues(recent);
    
    // Get upcoming meetings
    const meetings = getMockMeetings(user.village.id);
    const upcoming = meetings
      .filter(meeting => meeting.date > new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
    
    setUpcomingMeetings(upcoming);
  }, [user, issues]);
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                <h3 className="text-2xl font-bold">{issues.length}</h3>
              </div>
              <Flag className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter(i => i.status !== 'resolved' && i.status !== 'verified').length}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter(i => i.status === 'resolved' || i.status === 'verified').length}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Village Population</p>
                <h3 className="text-2xl font-bold">2,145</h3>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Issue Status Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issueStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="status" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {issueStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.status as IssueStatus]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Issue Priority Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityStats}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={(entry) => entry.priority}
                  >
                    {priorityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Issues
              </CardTitle>
              <Link to="/">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No issues reported yet.</p>
              ) : (
                recentIssues.map((issue) => (
                  <Link key={issue.id} to={`/issues/${issue.id}`}>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <TimeAgo date={issue.createdAt} />
                          <span>•</span>
                          <span>Reported by {issue.reportedBy.name}</span>
                        </div>
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
              <Link to="/meetings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No upcoming meetings.</p>
              ) : (
                upcomingMeetings.map((meeting) => (
                  <Link key={meeting.id} to={`/meetings/${meeting.id}`}>
                    <div className="border-b pb-3">
                      <h3 className="font-medium">{meeting.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(meeting.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm mt-1 truncate">
                        {meeting.location}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
