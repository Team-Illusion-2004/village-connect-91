
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIssue } from '@/context/issues';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { FileAttachment } from '@/lib/types';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { LocationPicker } from '@/components/ui-components/LocationPicker';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const ReportIssue = () => {
  const { user } = useAuth();
  const { addIssue, isLoading } = useIssue();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;
  
  const handleLocationSelect = (selectedLocation: { name: string; coordinates: { latitude: number; longitude: number } }) => {
    setLocation(selectedLocation.name);
    setCoordinates(selectedLocation.coordinates);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const issue = await addIssue({
        title,
        description,
        location,
        coordinates: coordinates || undefined,
        status: 'reported',
        priority,
        reportedBy: {
          id: user.id,
          name: user.name
        },
        village: user.village,
        attachments: attachments.length > 0 ? [...attachments] : undefined,
      });
      
      toast({
        title: "Issue Reported",
        description: "Your issue has been successfully reported",
      });
      
      // Navigate to the issue details page
      navigate(`/issues/${issue.id}`);
    } catch (error) {
      console.error('Error reporting issue:', error);
      
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Report an Issue</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>
            Provide details about the issue you're reporting
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Brief title describing the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Provide details about the issue..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority <span className="text-red-500">*</span></Label>
              <RadioGroup 
                value={priority} 
                onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">High</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Location <span className="text-red-500">*</span></Label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>
            
            <div className="space-y-2">
              <Label>Attachments</Label>
              <MediaUploader 
                onMediaSelected={setAttachments} 
                maxFiles={3}
                existingFiles={attachments}
              />
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-md">
              <AlertTriangle className="text-amber-500 h-5 w-5 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important</p>
                <p>Your issue will be visible to all members of your village and local authorities.</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Submitting...
                </>
              ) : (
                'Submit Issue'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReportIssue;
