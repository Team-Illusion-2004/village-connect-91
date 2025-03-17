
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface LocationPickerProps {
  onLocationSelect: (location: { name: string; coordinates: Coordinates }) => void;
  defaultLocation?: { name: string; coordinates: Coordinates };
}

export function LocationPicker({ onLocationSelect, defaultLocation }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{ name: string; coordinates: Coordinates } | null>(
    defaultLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding with Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) throw new Error('Failed to get location name');
          
          const data = await response.json();
          const locationName = data.display_name || 'Selected Location';
          
          const newLocation = {
            name: locationName,
            coordinates: { latitude, longitude }
          };
          
          setLocation(newLocation);
          onLocationSelect(newLocation);
          setOpen(false);
        } catch (error) {
          console.error('Error getting location:', error);
          toast({
            title: "Error",
            description: "Failed to get location information",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
        
        let errorMsg = "Failed to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full flex justify-between items-center border-dashed"
          >
            <span className="truncate">
              {location ? location.name : "Select location"}
            </span>
            <MapPin className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Location</DialogTitle>
            <DialogDescription>
              Share your current location or select a location on the map
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50 min-h-[200px]">
              {location ? (
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No location selected</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full sm:w-auto" 
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                  Getting location...
                </>
              ) : (
                <>Use Current Location</>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {location && (
        <div className="mt-2 flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <span className="text-sm">{location.name}</span>
        </div>
      )}
    </div>
  );
}
