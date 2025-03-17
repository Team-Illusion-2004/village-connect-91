
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KarmaCounter } from '@/components/ui-components/KarmaCounter';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  reportedCount: number;
  resolvedCount: number;
}

export const ProfileHeader = ({ reportedCount, resolvedCount }: ProfileHeaderProps) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <Card>
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
            <div className="text-2xl font-bold">{reportedCount}</div>
            <div className="text-sm text-gray-500">Reported</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{resolvedCount}</div>
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
  );
};
