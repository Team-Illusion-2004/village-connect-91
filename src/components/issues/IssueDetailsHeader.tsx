
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IssueDetailsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">Issue Details</h1>
    </div>
  );
};
