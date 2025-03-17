
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, formatDate } from '@/lib/utils';
import { ChatMessage, FileAttachment } from '@/lib/types';
import { Send, Plus, Heart } from 'lucide-react';
import { MediaUploader } from '@/components/ui-components/MediaUploader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MediaAttachment } from '@/components/ui-components/MediaAttachment';

const VillageChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user) return;
    
    // Load messages from storage (simulating API call)
    const fetchMessages = async () => {
      try {
        const storedMessages = localStorage.getItem(`chat_messages_${user.village.id}`);
        
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } else {
          // Initialize with welcome message
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            content: `Welcome to the ${user.village.name} village chat! Use this space to discuss village matters, ask questions, and connect with your community.`,
            sender: {
              id: 'system',
              name: 'CivicConnect',
              avatar: '/logo.png'
            },
            timestamp: new Date(),
            likes: []
          };
          
          setMessages([welcomeMessage]);
          localStorage.setItem(`chat_messages_${user.village.id}`, JSON.stringify([welcomeMessage]));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [user]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!user || (!newMessage.trim() && attachments.length === 0)) return;
    
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      content: newMessage.trim(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      likes: []
    };
    
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem(`chat_messages_${user.village.id}`, JSON.stringify(updatedMessages));
    
    // Clear input
    setNewMessage('');
    setAttachments([]);
    setShowMediaUploader(false);
  };
  
  const handleLike = (messageId: string) => {
    if (!user) return;
    
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        const likes = message.likes || [];
        const userLiked = likes.includes(user.id);
        
        return {
          ...message,
          likes: userLiked 
            ? likes.filter(id => id !== user.id) 
            : [...likes, user.id]
        };
      }
      return message;
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(`chat_messages_${user.village.id}`, JSON.stringify(updatedMessages));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleMediaSelected = (media: FileAttachment[]) => {
    setAttachments(media);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <h1 className="text-2xl font-bold mb-4">Village Chat</h1>
      
      <Card className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = user && message.sender.id === user.id;
                    const likesCount = message.likes?.length || 0;
                    const isLikedByUser = user && message.likes?.includes(user.id);
                    
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] gap-2`}>
                          {message.sender.id !== 'system' && (
                            <Avatar className="h-8 w-8 shrink-0">
                              {message.sender.avatar && <AvatarImage src={message.sender.avatar} alt={message.sender.name} />}
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitials(message.sender.name)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs text-muted-foreground ${isCurrentUser ? 'order-last' : ''}`}>
                                {message.sender.id === 'system' ? message.sender.name : message.sender.name.split(' ')[0]}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                            
                            <div 
                              className={`rounded-lg px-3 py-2 break-words ${
                                message.sender.id === 'system' 
                                  ? 'bg-muted text-foreground border' 
                                  : isCurrentUser 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              {message.content}
                              
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 grid gap-2 grid-cols-1">
                                  {message.attachments.map(attachment => (
                                    <MediaAttachment
                                      key={attachment.id}
                                      attachment={attachment}
                                      className="w-full h-32 md:h-40 rounded-md overflow-hidden"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {message.sender.id !== 'system' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleLike(message.id)}
                              >
                                <Heart 
                                  className={`h-3 w-3 mr-1 ${isLikedByUser ? 'fill-red-500 text-red-500' : ''}`} 
                                />
                                {likesCount > 0 && likesCount}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {showMediaUploader && (
              <div className="mb-4">
                <MediaUploader
                  onMediaSelected={handleMediaSelected}
                  maxFiles={3}
                  existingFiles={attachments}
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Popover open={showMediaUploader} onOpenChange={setShowMediaUploader}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start" alignOffset={-40}>
                  <MediaUploader
                    onMediaSelected={handleMediaSelected}
                    maxFiles={3}
                    existingFiles={attachments}
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              
              <Button
                variant="default"
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && attachments.length === 0}
                className="shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default VillageChat;
