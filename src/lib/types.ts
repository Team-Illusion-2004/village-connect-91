
export type MessageType = "text" | "image" | "video";

export type FileAttachment = {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
};

export type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  attachments?: FileAttachment[];
  isAnnouncement?: boolean;
};

export type IssueStatus = "reported" | "assigned" | "in_progress" | "resolved" | "verified";

export type Issue = {
  id: string;
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  priority: "low" | "medium" | "high";
  reportedBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: "volunteer" | "panchayat";
  };
  village: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  attachments?: FileAttachment[];
  comments: Message[];
  resolutionProof?: FileAttachment;
  paymentStatus?: "pending" | "paid";
  paymentAmount?: number;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  village: {
    id: string;
    name: string;
  };
  createdAt: Date;
  attachments?: FileAttachment[];
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  village: {
    id: string;
    name: string;
  };
  attendees?: {
    id: string;
    name: string;
  }[];
  summary?: string;
};
