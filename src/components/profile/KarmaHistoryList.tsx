
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { TimeAgo } from '@/components/ui-components/TimeAgo';

interface KarmaHistoryItem {
  id: string;
  points: number;
  reason: string;
  timestamp: Date;
}

interface KarmaHistoryListProps {
  history: KarmaHistoryItem[];
}

export const KarmaHistoryList = ({ history }: KarmaHistoryListProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No karma points earned yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {history.map((item) => (
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
  );
};
