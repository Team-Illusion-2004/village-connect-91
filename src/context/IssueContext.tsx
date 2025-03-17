
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Issue, IssueStatus } from '@/lib/types';
import { useKarma } from './KarmaContext';
import { useNotification } from './NotificationContext';
import { toast } from '@/hooks/use-toast';

type IssueContextType = {
  issues: Issue[];
  fetchIssues: () => Promise<void>;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Issue>;
  updateIssue: (id: string, data: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
  claimIssue: (id: string) => Promise<void>;
  resolveIssue: (id: string, resolutionProof?: { url: string; type: "image" | "video" }) => Promise<void>;
  verifyResolution: (id: string, verified: boolean) => Promise<void>;
  addComment: (issueId: string, content: string, attachments?: { url: string; type: "image" | "video" }[]) => Promise<void>;
  likeComment: (issueId: string, commentId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssue = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssue must be used within an IssueProvider');
  }
  return context;
};

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { awardKarma } = useKarma();
  const { addNotification } = useNotification();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load of issues
  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const fetchIssues = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      const storedIssues = localStorage.getItem(`issues_${user.village.id}`);
      if (storedIssues) {
        const parsedIssues = JSON.parse(storedIssues).map((issue: any) => ({
          ...issue,
          createdAt: new Date(issue.createdAt),
          updatedAt: new Date(issue.updatedAt),
          comments: issue.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }))
        }));
        setIssues(parsedIssues);
      } else {
        setIssues([]);
      }
    } catch (err) {
      setError('Failed to fetch issues');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveIssuesToStorage = (updatedIssues: Issue[]) => {
    if (!user) return;
    localStorage.setItem(`issues_${user.village.id}`, JSON.stringify(updatedIssues));
  };

  const addIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Issue> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    try {
      const newIssue: Issue = {
        ...issueData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        reportedBy: {
          id: user.id,
          name: user.name
        },
        village: user.village
      };
      
      const updatedIssues = [...issues, newIssue];
      setIssues(updatedIssues);
      saveIssuesToStorage(updatedIssues);
      
      addNotification({
        title: 'New Issue Reported',
        message: `A new issue "${newIssue.title}" has been reported in your village.`,
        type: 'info',
        link: `/issues/${newIssue.id}`
      });
      
      return newIssue;
    } catch (err) {
      setError('Failed to add issue');
      console.error(err);
      throw new Error('Failed to add issue');
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssue = async (id: string, data: Partial<Issue>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    try {
      const updatedIssues = issues.map(issue => 
        issue.id === id ? { ...issue, ...data, updatedAt: new Date() } : issue
      );
      
      setIssues(updatedIssues);
      saveIssuesToStorage(updatedIssues);
    } catch (err) {
      setError('Failed to update issue');
      console.error(err);
      throw new Error('Failed to update issue');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIssue = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    try {
      const filteredIssues = issues.filter(issue => issue.id !== id);
      setIssues(filteredIssues);
      saveIssuesToStorage(filteredIssues);
    } catch (err) {
      setError('Failed to delete issue');
      console.error(err);
      throw new Error('Failed to delete issue');
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueById = (id: string): Issue | undefined => {
    return issues.find(issue => issue.id === id);
  };

  const claimIssue = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    
    if (issue.status !== 'reported') {
      throw new Error('Issue is already claimed or resolved');
    }
    
    await updateIssue(id, {
      status: 'assigned',
      assignedTo: {
        id: user.id,
        name: user.name,
        role: user.role === 'volunteer' || user.role === 'panchayat' 
          ? user.role 
          : 'volunteer' // Fallback to volunteer if the role is not valid
      }
    });
    
    addNotification({
      title: 'Issue Claimed',
      message: `${user.name} has claimed the issue "${issue.title}"`,
      type: 'info',
      link: `/issues/${id}`
    });
  };

  const resolveIssue = async (id: string, resolutionProof?: { url: string; type: "image" | "video" }): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    
    if (issue.status !== 'assigned' && issue.status !== 'in_progress') {
      throw new Error('Issue must be assigned or in progress to resolve');
    }
    
    if (issue.assignedTo?.id !== user.id) {
      throw new Error('Only the assigned person can resolve this issue');
    }
    
    await updateIssue(id, {
      status: 'resolved',
      resolutionProof: resolutionProof ? {
        id: crypto.randomUUID(),
        url: resolutionProof.url,
        type: resolutionProof.type
      } : undefined
    });
    
    addNotification({
      title: 'Issue Resolved',
      message: `${user.name} has resolved the issue "${issue.title}"`,
      type: 'success',
      link: `/issues/${id}`
    });
  };

  const verifyResolution = async (id: string, verified: boolean): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    
    if (issue.status !== 'resolved') {
      throw new Error('Issue must be resolved before verification');
    }
    
    if (issue.reportedBy.id !== user.id && user.role !== 'panchayat') {
      throw new Error('Only the reporter or panchayat can verify this issue');
    }
    
    if (verified) {
      await updateIssue(id, {
        status: 'verified'
      });
      
      // Award karma points to the resolver
      if (issue.assignedTo) {
        awardKarma(10, `Resolved issue: ${issue.title}`);
        
        addNotification({
          title: 'Issue Verified',
          message: `Your resolution for "${issue.title}" has been verified`,
          type: 'success',
          link: `/issues/${id}`
        });
      }
    } else {
      await updateIssue(id, {
        status: 'in_progress'
      });
      
      addNotification({
        title: 'Resolution Rejected',
        message: `Your resolution for "${issue.title}" needs more work`,
        type: 'warning',
        link: `/issues/${id}`
      });
    }
  };

  const addComment = async (
    issueId: string, 
    content: string, 
    attachments?: { url: string; type: "image" | "video" }[]
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    const issue = issues.find(i => i.id === issueId);
    if (!issue) throw new Error('Issue not found');
    
    const newComment = {
      id: crypto.randomUUID(),
      content,
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      timestamp: new Date(),
      attachments: attachments ? attachments.map(att => ({
        id: crypto.randomUUID(),
        ...att
      })) : undefined,
      likes: []
    };
    
    const updatedComments = [...issue.comments, newComment];
    
    await updateIssue(issueId, {
      comments: updatedComments
    });
    
    // Notify the issue reporter if it's not them commenting
    if (issue.reportedBy.id !== user.id) {
      addNotification({
        title: 'New Comment',
        message: `${user.name} commented on your issue "${issue.title}"`,
        type: 'info',
        link: `/issues/${issueId}`
      });
    }
  };

  const likeComment = async (issueId: string, commentId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    const issue = issues.find(i => i.id === issueId);
    if (!issue) throw new Error('Issue not found');
    
    const updatedComments = issue.comments.map(comment => {
      if (comment.id === commentId) {
        // Check if user already liked
        const alreadyLiked = comment.likes?.includes(user.id);
        
        if (alreadyLiked) {
          // Unlike
          return {
            ...comment,
            likes: comment.likes?.filter(id => id !== user.id) || []
          };
        } else {
          // Like
          return {
            ...comment,
            likes: [...(comment.likes || []), user.id]
          };
        }
      }
      return comment;
    });
    
    await updateIssue(issueId, {
      comments: updatedComments
    });
  };

  const value = {
    issues,
    fetchIssues,
    addIssue,
    updateIssue,
    deleteIssue,
    getIssueById,
    claimIssue,
    resolveIssue,
    verifyResolution,
    addComment,
    likeComment,
    isLoading,
    error
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};
