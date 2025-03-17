
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeAgo } from '@/components/ui-components/TimeAgo';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, MapPin, Plus, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getMockMeetings } from '@/lib/mockData';
import { Meeting } from '@/lib/types';

const Meetings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  useEffect(() => {
    if (user) {
      const fetchedMeetings = getMockMeetings(user.village.id);
      setMeetings(fetchedMeetings);
    }
  }, [user]);
  
  if (!user) return null;
  
  const filteredMeetings = meetings.filter(meeting => {
    const now = new Date();
    
    if (filter === 'upcoming') {
      return meeting.date > now;
    } else if (filter === 'past') {
      return meeting.date < now;
    }
    
    return true;
  });
  
  const isPast = (date: Date) => {
    return date < new Date();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Village Meetings</h1>
        
        {user.role === 'panchayat' && (
          <Button onClick={() => navigate('/meetings/new')}>
            <Plus className="mr-1 h-4 w-4" />
            Schedule Meeting
          </Button>
        )}
      </div>
      
      <div className="flex justify-end">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as 'all' | 'upcoming' | 'past')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter meetings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meetings</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredMeetings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No meetings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeetings.map((meeting) => (
            <Link key={meeting.id} to={`/meetings/${meeting.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">
                            {format(meeting.date, 'PPP')}
                          </span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">
                            {format(meeting.date, 'p')}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isPast(meeting.date) 
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isPast(meeting.date) ? 'Past' : 'Upcoming'}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="text-sm line-clamp-2">{meeting.description}</div>
                  
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{meeting.location}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 text-xs text-gray-500 flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{meeting.attendees?.length || 0} attending</span>
                  </div>
                  
                  {meeting.summary && (
                    <div className="text-xs text-blue-500">
                      Minutes available
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
