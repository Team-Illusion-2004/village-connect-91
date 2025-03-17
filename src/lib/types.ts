
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
  likes?: string[]; // Array of user IDs who liked the message
};

export type IssueStatus = "reported" | "assigned" | "in_progress" | "resolved" | "verified";

export type Issue = {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  comments: ChatMessage[];
  resolutionProof?: FileAttachment;
  paymentStatus?: "pending" | "paid";
  paymentAmount?: number;
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  attachments?: FileAttachment[];
  likes?: string[]; // Array of user IDs who liked the message
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
  minutesOfMeeting?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
};

export type UserRole = "citizen" | "volunteer" | "panchayat";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  village: {
    id: string;
    name: string;
  };
  avatar?: string;
  bio?: string;
  karmaPoints: number;
  issuesReported: number;
  issuesResolved: number;
  createdAt: Date;
};

export type Village = {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  population: number;
  panchayatMembers: {
    id: string;
    name: string;
    position: string;
  }[];
};

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  link?: string;
};

export type KarmaTransaction = {
  id: string;
  userId: string;
  points: number;
  reason: string;
  issueId?: string;
  timestamp: Date;
};
