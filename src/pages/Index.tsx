
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-components/StatusBadge";
import { PriorityBadge } from "@/components/ui-components/PriorityBadge";
import { TimeAgo } from "@/components/ui-components/TimeAgo";
import { MediaAttachment } from "@/components/ui-components/MediaAttachment";
import { useAuth } from "@/context/AuthContext";
import { getMockAnnouncements, getMockIssues, getMockMeetings } from "@/lib/mockData";
import { formatDate, formatTime } from "@/lib/utils";
import { AlertTriangle, Calendar, ChevronRight, MessageSquare, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Announcement, Issue, Meeting } from "@/lib/types";

const Index = () => {
  const { user } = useAuth();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const villageId = user.village.id;
      setRecentIssues(getMockIssues(villageId).slice(0, 3));
      setAnnouncements(getMockAnnouncements(villageId));
      setUpcomingMeetings(getMockMeetings(villageId).filter(meeting => meeting.date > new Date()));
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [user]);
  
  if (!user) return null;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 font-medium">
            {user.village.name} Village
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/report">
            <Card className="hover:shadow-md transition-shadow border border-border/60">
              <CardContent className="p-6 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Report Issue</h3>
                  <p className="text-sm text-muted-foreground">Report local problems</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/chat">
            <Card className="hover:shadow-md transition-shadow border border-border/60">
              <CardContent className="p-6 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Village Chat</h3>
                  <p className="text-sm text-muted-foreground">Discuss with community</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/meetings">
            <Card className="hover:shadow-md transition-shadow border border-border/60">
              <CardContent className="p-6 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Meetings</h3>
                  <p className="text-sm text-muted-foreground">View upcoming events</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Announcements</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/announcements">View all</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <Card className="border border-border/60">
            <CardContent className="p-6 min-h-[120px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </CardContent>
          </Card>
        ) : announcements.length > 0 ? (
          <Card className="border border-border/60">
            <CardContent className="p-6 space-y-4">
              {announcements.map((announcement, index) => (
                <div key={announcement.id} className={`${index !== 0 ? 'pt-4 border-t' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <TimeAgo date={announcement.createdAt} className="mt-1" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {announcement.attachments.map(attachment => (
                        <MediaAttachment
                          key={attachment.id}
                          attachment={attachment}
                          className="h-28 md:h-36 w-full"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border/60">
            <CardContent className="p-6 py-10 text-center">
              <p className="text-muted-foreground">No announcements at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>
      
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Issues</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/issues">View all</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentIssues.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentIssues.map(issue => (
              <Link to={`/issues/${issue.id}`} key={issue.id}>
                <Card className="h-full border border-border/60 hover:shadow-md transition-shadow">
                  {issue.attachments && issue.attachments.length > 0 && (
                    <MediaAttachment
                      attachment={issue.attachments[0]}
                      className="w-full h-32 rounded-none rounded-t-lg"
                    />
                  )}
                  <CardHeader className="pt-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{issue.title}</CardTitle>
                    </div>
                    <CardDescription>{issue.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex gap-2 mb-2">
                      <StatusBadge status={issue.status} />
                      <PriorityBadge priority={issue.priority} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4 text-sm text-muted-foreground justify-between">
                    <span>Reported by {issue.reportedBy.name}</span>
                    <TimeAgo date={issue.createdAt} />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border border-border/60">
            <CardContent className="p-6 py-10 text-center">
              <p className="text-muted-foreground mb-4">No issues reported yet.</p>
              <Button asChild>
                <Link to="/report">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Report an Issue
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/meetings">
              View all
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <Card className="border border-border/60">
            <CardContent className="p-6 min-h-[120px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </CardContent>
          </Card>
        ) : upcomingMeetings.length > 0 ? (
          <Card className="border border-border/60">
            <CardContent className="p-0">
              <div className="divide-y">
                {upcomingMeetings.map(meeting => (
                  <Link to={`/meetings/${meeting.id}`} key={meeting.id} className="block hover:bg-muted/30 transition-colors">
                    <div className="p-4 flex items-center space-x-4">
                      <div className="min-w-16 text-center">
                        <div className="text-sm font-medium">
                          {formatDate(meeting.date).split(" ")[0]}
                        </div>
                        <div className="text-xl font-bold">
                          {meeting.date.getDate()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{meeting.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatTime(meeting.date)} • {meeting.location}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border/60">
            <CardContent className="p-6 py-10 text-center">
              <p className="text-muted-foreground">No upcoming meetings scheduled.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Index;
