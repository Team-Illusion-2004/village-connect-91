
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getMockMeetings } from '@/lib/mockData';
import { Meeting } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const MeetingDetails = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [attending, setAttending] = useState(false);
  
  useEffect(() => {
    if (user && meetingId) {
      const meetings = getMockMeetings(user.village.id);
      const foundMeeting = meetings.find(m => m.id === meetingId);
      
      if (foundMeeting) {
        setMeeting(foundMeeting);
        
        // Check if user is attending
        const isAttending = foundMeeting.attendees?.some(a => a.id === user.id);
        setAttending(!!isAttending);
      }
    }
  }, [user, meetingId]);
  
  if (!user || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl font-semibold mb-4">Meeting Not Found</h2>
        <p className="mb-6 text-gray-600">The meeting you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/meetings')}>Back to Meetings</Button>
      </div>
    );
  }
  
  const isPast = meeting.date < new Date();
  
  const toggleAttendance = () => {
    setAttending(!attending);
    // In a real app, this would update the backend
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/meetings')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Meeting Details</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{meeting.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{format(meeting.date, 'PPP')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{format(meeting.date, 'p')}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <div className={`text-sm px-2 py-1 rounded-full ${
              isPast 
                ? 'bg-gray-100 text-gray-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {isPast ? 'Past' : 'Upcoming'}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Location</h3>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
              <span>{meeting.location}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Description</h3>
            <p>{meeting.description}</p>
          </div>
          
          {meeting.attendees && meeting.attendees.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span>Attendees ({meeting.attendees.length})</span>
                </div>
              </h3>
              <div className="flex flex-wrap gap-2">
                {meeting.attendees.map((attendee) => (
                  <div 
                    key={attendee.id}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  >
                    {attendee.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {meeting.summary && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-base mb-2">Meeting Minutes</h3>
                <p className="text-sm whitespace-pre-line">{meeting.summary}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          {!isPast ? (
            <Button 
              onClick={toggleAttendance}
              variant={attending ? "outline" : "default"}
              className={attending ? "" : "bg-green-500 hover:bg-green-600"}
            >
              {attending ? "Cancel Attendance" : "Mark as Attending"}
            </Button>
          ) : !meeting.summary && user.role === 'panchayat' ? (
            <Button>Add Meeting Minutes</Button>
          ) : (
            <div className="text-sm text-gray-500">
              {meeting.summary 
                ? "This meeting has concluded and minutes are available." 
                : "This meeting has concluded."}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MeetingDetails;
