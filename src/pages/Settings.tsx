
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/ui-components/UserAvatar';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Languages, Moon, Save, SunMedium } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('english');
  
  if (!user) return null;
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update notification preferences
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved",
    });
  };
  
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update appearance settings
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been saved",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Village</Label>
                <Input value={user.village.name} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <Input 
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                  disabled 
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSaveNotifications}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit">
                  <BellRing className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSaveAppearance}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the application
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SunMedium className="h-4 w-4 text-amber-500" />
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                      <Moon className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <Label htmlFor="language">Language</Label>
                    </div>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="gujarati">Gujarati</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit">
                  Save Appearance
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
