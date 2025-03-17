
import { useContext } from 'react';
import { IssueContext } from './IssueContext';
import { IssueContextType } from './types';

export const useIssue = (): IssueContextType => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssue must be used within an IssueProvider');
  }
  return context;
};
