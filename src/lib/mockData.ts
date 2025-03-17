
import { Issue, Message, Announcement, Meeting, IssueStatus } from "./types";

// Helper function to generate a random date within the last month
const randomRecentDate = () => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  return pastDate;
};

// Mock Issues
export const getMockIssues = (villageId: string): Issue[] => [
  {
    id: "issue1",
    title: "Water supply disruption",
    description: "No water supply in Sector 4 for the past 2 days",
    location: "Sector 4, Main Road",
    status: "reported",
    priority: "high",
    reportedBy: {
      id: "user1",
      name: "Ramesh Kumar",
    },
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    attachments: [
      {
        id: "att1",
        url: "https://images.unsplash.com/photo-1583120138208-98cd25f9d278?q=80&w=600&auto=format&fit=crop",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment1",
        content: "We are working on this issue. Expected to be resolved by tomorrow.",
        sender: {
          id: "panchayat1",
          name: "Panchayat Office",
        },
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "issue2",
    title: "Garbage collection missed",
    description: "Garbage hasn't been collected in our area for a week now",
    location: "Near temple, West End",
    status: "in_progress",
    priority: "medium",
    reportedBy: {
      id: "user2",
      name: "Anita Sharma",
    },
    assignedTo: {
      id: "volunteer1",
      name: "Prakash Singh",
      role: "volunteer",
    },
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    attachments: [
      {
        id: "att2",
        url: "https://images.unsplash.com/photo-1605600659854-3151f12efcf1?q=80&w=600&auto=format&fit=crop",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment2",
        content: "I've volunteered to help clean up the area. Will start tomorrow.",
        sender: {
          id: "volunteer1",
          name: "Prakash Singh",
        },
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "issue3",
    title: "Street light not working",
    description: "The street light at the corner of Main Road and School Road is not working for the past week",
    location: "Main Road and School Road junction",
    status: "resolved",
    priority: "low",
    reportedBy: {
      id: "user3",
      name: "Suresh Patel",
    },
    assignedTo: {
      id: "panchayat1",
      name: "Panchayat Office",
      role: "panchayat",
    },
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    attachments: [
      {
        id: "att3",
        url: "https://images.unsplash.com/photo-1468183654773-77e2f0bb5bf9?q=80&w=600&auto=format&fit=crop",
        type: "image",
      },
    ],
    comments: [
      {
        id: "comment3",
        content: "We have replaced the bulb. It should be working now.",
        sender: {
          id: "panchayat1",
          name: "Panchayat Office",
        },
        timestamp: new Date(),
      },
    ],
    resolutionProof: {
      id: "res1",
      url: "https://images.unsplash.com/photo-1507195258827-85d963781872?q=80&w=600&auto=format&fit=crop",
      type: "image",
    },
  },
];

// Mock messages for a chat
export const getMockMessages = (villageId: string): Message[] => [
  {
    id: "msg1",
    content: "Good morning everyone! Just a reminder that we have a community meeting this Sunday at 10 AM.",
    sender: {
      id: "panchayat1",
      name: "Panchayat Office",
    },
    timestamp: randomRecentDate(),
    isAnnouncement: true,
  },
  {
    id: "msg2",
    content: "I've noticed some potholes developing on the main road. Should I report this as an issue?",
    sender: {
      id: "user2",
      name: "Anita Sharma",
    },
    timestamp: randomRecentDate(),
  },
  {
    id: "msg3",
    content: "Yes, please create a formal issue with pictures if possible so we can address it properly.",
    sender: {
      id: "panchayat1",
      name: "Panchayat Office",
    },
    timestamp: randomRecentDate(),
  },
  {
    id: "msg4",
    content: "The new solar-powered water pump installation starts tomorrow at the community well.",
    sender: {
      id: "panchayat1",
      name: "Panchayat Office",
    },
    timestamp: randomRecentDate(),
    attachments: [
      {
        id: "att4",
        url: "https://images.unsplash.com/photo-1509391711548-1b9f26352c0d?q=80&w=600&auto=format&fit=crop",
        type: "image",
      },
    ],
    isAnnouncement: true,
  },
];

// Mock announcements
export const getMockAnnouncements = (villageId: string): Announcement[] => [
  {
    id: "ann1",
    title: "New Water Pipeline Project",
    content: "We're pleased to announce that the new water pipeline project has been approved. Construction will begin next month and is expected to be completed within 3 months. This will improve water supply to all areas of our village.",
    author: {
      id: "panchayat1",
      name: "Panchayat Office",
    },
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    createdAt: randomRecentDate(),
    attachments: [
      {
        id: "annAtt1",
        url: "https://images.unsplash.com/photo-1531972111231-7482a960e109?q=80&w=600&auto=format&fit=crop",
        type: "image",
      },
    ],
  },
  {
    id: "ann2",
    title: "Health Camp Next Week",
    content: "A free health camp will be organized next Saturday from 9 AM to 4 PM at the community hall. Doctors from the district hospital will provide check-ups and consultations. All villagers are encouraged to attend.",
    author: {
      id: "panchayat1",
      name: "Panchayat Office",
    },
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    createdAt: randomRecentDate(),
  },
];

// Mock meetings
export const getMockMeetings = (villageId: string): Meeting[] => [
  {
    id: "meet1",
    title: "Monthly Village Assembly",
    description: "Regular monthly meeting to discuss village issues and development plans.",
    date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Village Panchayat Hall",
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    status: "upcoming"
  },
  {
    id: "meet2",
    title: "Water Conservation Workshop",
    description: "Learn about water conservation techniques and rainwater harvesting for your homes.",
    date: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    location: "Community Center",
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    status: "upcoming"
  },
  {
    id: "meet3",
    title: "Farmers Discussion",
    description: "Discussion on new agricultural schemes and seasonal crop planning.",
    date: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    location: "Agricultural Cooperative Building",
    village: {
      id: villageId,
      name: villageId === "v1" ? "Rampura" : "Chittorgarh",
    },
    summary: "Discussed the new government subsidy for organic farming. Decided to form a committee for collective purchase of seeds for the upcoming season. Next steps include organizing a training session on organic pesticides.",
    status: "completed"
  },
];

// Function to get a filtered list of issues based on status
export const getFilteredIssues = (villageId: string, status?: IssueStatus): Issue[] => {
  const issues = getMockIssues(villageId);
  if (!status) return issues;
  return issues.filter(issue => issue.status === status);
};
