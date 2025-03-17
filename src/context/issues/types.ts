
import { Issue, FileAttachment, ChatMessage } from '@/lib/types';

export type IssueContextType = {
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
