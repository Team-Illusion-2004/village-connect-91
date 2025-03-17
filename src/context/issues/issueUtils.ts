
import { Issue } from "@/lib/types";

// Save issues to localStorage
export const saveIssuesToStorage = (userId: string, updatedIssues: Issue[]): void => {
  if (!userId) return;
  localStorage.setItem(`issues_${userId}`, JSON.stringify(updatedIssues));
};

// Load issues from localStorage
export const loadIssuesFromStorage = (userId: string): Issue[] => {
  const storedIssues = localStorage.getItem(`issues_${userId}`);
  if (storedIssues) {
    return JSON.parse(storedIssues).map((issue: any) => ({
      ...issue,
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
      comments: issue.comments.map((comment: any) => ({
        ...comment,
        timestamp: new Date(comment.timestamp)
      }))
    }));
  }
  return [];
};
