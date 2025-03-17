
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Issue } from '@/lib/types';
import { useKarma } from '@/context/KarmaContext';
import { toast } from '@/hooks/use-toast';
import { IssueContextType } from './types';
import { saveIssuesToStorage, loadIssuesFromStorage } from './issueUtils';

// Create the context
export const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { awardKarma } = useKarma();
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
      const loadedIssues = loadIssuesFromStorage(user.village.id);
      setIssues(loadedIssues);
    } catch (err) {
      setError('Failed to fetch issues');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
      saveIssuesToStorage(user.village.id, updatedIssues);
      
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
      saveIssuesToStorage(user.village.id, updatedIssues);
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
      saveIssuesToStorage(user.village.id, filteredIssues);
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
      }
    } else {
      await updateIssue(id, {
        status: 'in_progress'
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
