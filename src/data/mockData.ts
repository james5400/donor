export interface Task {
  id: string;
  type: 'email' | 'text' | 'phone';
  title: string;
  donorName: string;
  donorId: string;
  time: string;
  status: 'pending' | 'completed' | 'in-progress';
  campaign: string;
  playbookId: string;
  notes?: string;
}

export interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  totalDonations: number;
  lastDonationDate: string;
  status: 'active' | 'inactive' | 'prospect';
  tags: string[];
  linkedInUrl?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  raised: number;
  donorCount: number;
  status: 'active' | 'completed' | 'draft';
  playbookId: string;
}

export interface PlaybookStep {
  id: string;
  order: number;
  type: 'email' | 'text' | 'phone';
  title: string;
  description: string;
  template?: string;
  delayDays: number;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  steps: PlaybookStep[];
  version: number;
  lastModified: string;
  metrics: {
    avgResponseRate: number;
    avgConversionRate: number;
    totalDonations: number;
  };
  versionHistory: {
    version: number;
    changes: string[];
    date: string;
    metrics: {
      avgResponseRate: number;
      avgConversionRate: number;
    };
  }[];
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  hoursThisWeek: number;
  tasksCompleted: number;
  joinedDate: string;
}

export interface VolunteerTask {
  id: string;
  volunteerId: string;
  donorId: string;
  donorName: string;
  type: 'email' | 'text' | 'phone';
  scheduledDate: string;
  status: 'pending' | 'completed';
  notes?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  campaignId: string;
  campaignName: string;
  timestamp: string;
  state: string;
}

export interface MetricData {
  donationsByState: { state: string; amount: number; count: number }[];
  donationsByCampaign: { campaign: string; amount: number; goal: number }[];
  donationsTrend: { date: string; amount: number; count: number }[];
  playbookPerformance: { playbook: string; responseRate: number; conversionRate: number }[];
}

export const todayTasks: Task[] = [
  { id: '1', type: 'email', title: 'Follow-up on donation', donorName: 'Emma Johnson', donorId: 'd1', time: '09:00 AM', status: 'pending', campaign: 'Spring Drive', playbookId: 'pb1' },
  { id: '2', type: 'text', title: 'Donation reminder', donorName: 'Liam Smith', donorId: 'd2', time: '10:00 AM', status: 'pending', campaign: 'Spring Drive', playbookId: 'pb1' },
  { id: '3', type: 'phone', title: 'Thank you call', donorName: 'Olivia Williams', donorId: 'd3', time: '11:00 AM', status: 'in-progress', campaign: 'Annual Gala', playbookId: 'pb2' },
  { id: '4', type: 'email', title: 'Campaign update', donorName: 'Noah Brown', donorId: 'd4', time: '01:00 PM', status: 'pending', campaign: 'Spring Drive', playbookId: 'pb1' },
  { id: '5', type: 'text', title: 'Event invitation', donorName: 'Ava Davis', donorId: 'd5', time: '02:00 PM', status: 'pending', campaign: 'Annual Gala', playbookId: 'pb2' },
  { id: '6', type: 'phone', title: 'Major donor outreach', donorName: 'Ethan Miller', donorId: 'd6', time: '03:00 PM', status: 'pending', campaign: 'Capital Campaign', playbookId: 'pb3' },
  { id: '7', type: 'email', title: 'Impact report', donorName: 'Sophia Wilson', donorId: 'd7', time: '04:00 PM', status: 'pending', campaign: 'Spring Drive', playbookId: 'pb1' },
];

export const donors: Donor[] = [
  { id: 'd1', firstName: 'Emma', lastName: 'Johnson', email: 'emma.j@email.com', phone: '(555) 123-4567', state: 'CA', city: 'Los Angeles', totalDonations: 2500, lastDonationDate: '2025-01-15', status: 'active', tags: ['major-donor', 'spring-drive'], createdAt: '2024-06-10' },
  { id: 'd2', firstName: 'Liam', lastName: 'Smith', email: 'liam.s@email.com', phone: '(555) 234-5678', state: 'NY', city: 'New York', totalDonations: 850, lastDonationDate: '2025-01-10', status: 'active', tags: ['recurring'], createdAt: '2024-08-22' },
  { id: 'd3', firstName: 'Olivia', lastName: 'Williams', email: 'olivia.w@email.com', phone: '(555) 345-6789', state: 'TX', city: 'Austin', totalDonations: 5200, lastDonationDate: '2025-01-18', status: 'active', tags: ['major-donor', 'vip'], createdAt: '2023-11-05' },
  { id: 'd4', firstName: 'Noah', lastName: 'Brown', email: 'noah.b@email.com', phone: '(555) 456-7890', state: 'FL', city: 'Miami', totalDonations: 320, lastDonationDate: '2024-12-20', status: 'active', tags: ['new-donor'], createdAt: '2024-10-15' },
  { id: 'd5', firstName: 'Ava', lastName: 'Davis', email: 'ava.d@email.com', phone: '(555) 567-8901', state: 'WA', city: 'Seattle', totalDonations: 1500, lastDonationDate: '2025-01-08', status: 'active', tags: ['recurring', 'green-donor'], createdAt: '2024-04-20' },
  { id: 'd6', firstName: 'Ethan', lastName: 'Miller', email: 'ethan.m@email.com', phone: '(555) 678-9012', state: 'IL', city: 'Chicago', totalDonations: 8000, lastDonationDate: '2025-01-20', status: 'active', tags: ['major-donor', 'legacy'], createdAt: '2023-01-10' },
  { id: 'd7', firstName: 'Sophia', lastName: 'Wilson', email: 'sophia.w@email.com', phone: '(555) 789-0123', state: 'CA', city: 'San Francisco', totalDonations: 2100, lastDonationDate: '2025-01-12', status: 'active', tags: ['recurring'], createdAt: '2024-07-30' },
  { id: 'd8', firstName: 'Mason', lastName: 'Taylor', email: 'mason.t@email.com', phone: '(555) 890-1234', state: 'CO', city: 'Denver', totalDonations: 150, lastDonationDate: '2024-11-25', status: 'prospect', tags: ['new-donor'], createdAt: '2024-11-20' },
  { id: 'd9', firstName: 'Isabella', lastName: 'Anderson', email: 'isabella.a@email.com', phone: '(555) 901-2345', state: 'AZ', city: 'Phoenix', totalDonations: 4200, lastDonationDate: '2025-01-05', status: 'active', tags: ['major-donor'], createdAt: '2023-09-15' },
  { id: 'd10', firstName: 'James', lastName: 'Thomas', email: 'james.t@email.com', phone: '(555) 012-3456', state: 'GA', city: 'Atlanta', totalDonations: 680, lastDonationDate: '2024-12-15', status: 'inactive', tags: [], createdAt: '2024-05-18' },
];

export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Spring Drive 2025', description: 'Annual spring fundraising campaign', startDate: '2025-03-01', endDate: '2025-05-31', goal: 50000, raised: 32500, donorCount: 245, status: 'active', playbookId: 'pb1' },
  { id: 'c2', name: 'Annual Gala', description: 'Black tie fundraising gala event', startDate: '2025-06-15', endDate: '2025-06-15', goal: 100000, raised: 78000, donorCount: 156, status: 'active', playbookId: 'pb2' },
  { id: 'c3', name: 'Capital Campaign', description: 'Building expansion fund', startDate: '2025-01-01', endDate: '2025-12-31', goal: 500000, raised: 185000, donorCount: 89, status: 'active', playbookId: 'pb3' },
  { id: 'c4', name: 'Holiday Appeal 2024', description: 'Year-end giving campaign', startDate: '2024-11-15', endDate: '2024-12-31', goal: 75000, raised: 82000, donorCount: 412, status: 'completed', playbookId: 'pb1' },
  { id: 'c5', name: 'Emergency Fund', description: 'Immediate needs fund', startDate: '2025-02-01', endDate: '2025-04-30', goal: 25000, raised: 12000, donorCount: 78, status: 'active', playbookId: 'pb2' },
];

export const playbooks: Playbook[] = [
  {
    id: 'pb1',
    name: 'Standard Outreach',
    description: 'Multi-channel outreach for general donors',
    version: 3,
    lastModified: '2025-01-15',
    steps: [
      { id: 's1', order: 1, type: 'email', title: 'Initial Email', description: 'Send campaign introduction email', template: 'Hi {{firstName}}, join our Spring Drive...', delayDays: 0 },
      { id: 's2', order: 2, type: 'text', title: 'Follow-up Text', description: 'Quick reminder SMS', template: 'Hey {{firstName}}, just a friendly reminder...', delayDays: 2 },
      { id: 's3', order: 3, type: 'email', title: 'Personal Email', description: 'Personal follow-up from team member', template: 'Hi {{firstName}}, I wanted to reach out personally...', delayDays: 4 },
      { id: 's4', order: 4, type: 'phone', title: 'Phone Call', description: 'Direct phone outreach', delayDays: 7 },
      { id: 's5', order: 5, type: 'email', title: 'Final Appeal', description: 'Last chance email before campaign ends', template: '{{firstName}}, time is running out...', delayDays: 10 },
    ],
    metrics: { avgResponseRate: 32, avgConversionRate: 8.5, totalDonations: 145000 },
    versionHistory: [
      { version: 1, changes: ['Initial playbook creation'], date: '2024-10-01', metrics: { avgResponseRate: 25, avgConversionRate: 6 } },
      { version: 2, changes: ['Updated email template', 'Added delay between steps'], date: '2024-11-15', metrics: { avgResponseRate: 29, avgConversionRate: 7.2 } },
      { version: 3, changes: ['Optimized text message timing', 'New phone script'], date: '2025-01-15', metrics: { avgResponseRate: 32, avgConversionRate: 8.5 } },
    ],
  },
  {
    id: 'pb2',
    name: 'Major Donor Cultivation',
    description: 'Personal outreach for high-value donors',
    version: 2,
    lastModified: '2025-01-10',
    steps: [
      { id: 's1', order: 1, type: 'email', title: 'Personal Introduction', description: 'Personalized email from executive director', delayDays: 0 },
      { id: 's2', order: 2, type: 'phone', title: 'Executive Call', description: 'Direct call from leadership', delayDays: 3 },
      { id: 's3', order: 3, type: 'email', title: 'Impact Report', description: 'Detailed impact metrics email', delayDays: 7 },
      { id: 's4', order: 4, type: 'phone', title: 'Meeting Request', description: 'Schedule personal meeting', delayDays: 14 },
      { id: 's5', order: 5, type: 'email', title: 'Custom Proposal', description: 'Personalized giving proposal', delayDays: 21 },
    ],
    metrics: { avgResponseRate: 68, avgConversionRate: 24, totalDonations: 320000 },
    versionHistory: [
      { version: 1, changes: ['Initial major donor playbook'], date: '2024-08-01', metrics: { avgResponseRate: 55, avgConversionRate: 18 } },
      { version: 2, changes: ['Added impact report step', 'Extended timeline'], date: '2025-01-10', metrics: { avgResponseRate: 68, avgConversionRate: 24 } },
    ],
  },
  {
    id: 'pb3',
    name: 'Quick Strike',
    description: 'Fast-paced emergency fundraising',
    version: 1,
    lastModified: '2024-12-01',
    steps: [
      { id: 's1', order: 1, type: 'text', title: 'Urgent SMS Blast', description: 'Quick text to all supporters', delayDays: 0 },
      { id: 's2', order: 2, type: 'email', title: 'Email Hour', description: 'Mass email within 2 hours', delayDays: 0 },
      { id: 's3', order: 3, type: 'phone', title: 'Major Donor Calls', description: 'Call top 20 donors immediately', delayDays: 1 },
      { id: 's4', order: 4, type: 'text', title: 'Reminder Text', description: 'Follow-up text', delayDays: 2 },
      { id: 's5', order: 5, type: 'email', title: 'Final Push', description: 'Final email with matching deadline', delayDays: 3 },
    ],
    metrics: { avgResponseRate: 45, avgConversionRate: 12, totalDonations: 85000 },
    versionHistory: [
      { version: 1, changes: ['Initial emergency playbook'], date: '2024-12-01', metrics: { avgResponseRate: 45, avgConversionRate: 12 } },
    ],
  },
];

export const volunteers: Volunteer[] = [
  { id: 'v1', firstName: 'Alex', lastName: 'Chen', email: 'alex.c@email.com', phone: '(555) 111-2222', status: 'active', hoursThisWeek: 12, tasksCompleted: 45, joinedDate: '2024-03-15' },
  { id: 'v2', firstName: 'Jordan', lastName: 'Lee', email: 'jordan.l@email.com', phone: '(555) 222-3333', status: 'active', hoursThisWeek: 8, tasksCompleted: 32, joinedDate: '2024-06-20' },
  { id: 'v3', firstName: 'Casey', lastName: 'Martinez', email: 'casey.m@email.com', phone: '(555) 333-4444', status: 'active', hoursThisWeek: 15, tasksCompleted: 68, joinedDate: '2023-11-10' },
  { id: 'v4', firstName: 'Taylor', lastName: 'Johnson', email: 'taylor.j@email.com', phone: '(555) 444-5555', status: 'inactive', hoursThisWeek: 0, tasksCompleted: 120, joinedDate: '2023-05-22' },
  { id: 'v5', firstName: 'Morgan', lastName: 'Davis', email: 'morgan.d@email.com', phone: '(555) 555-6666', status: 'active', hoursThisWeek: 6, tasksCompleted: 28, joinedDate: '2024-09-08' },
];

export const volunteerTasks: VolunteerTask[] = [
  { id: 'vt1', volunteerId: 'v1', donorId: 'd1', donorName: 'Emma Johnson', type: 'email', scheduledDate: '2025-01-21', status: 'pending', notes: 'Thank them for recent donation' },
  { id: 'vt2', volunteerId: 'v1', donorId: 'd2', donorName: 'Liam Smith', type: 'text', scheduledDate: '2025-01-21', status: 'pending' },
  { id: 'vt3', volunteerId: 'v2', donorId: 'd3', donorName: 'Olivia Williams', type: 'phone', scheduledDate: '2025-01-21', status: 'completed' },
  { id: 'vt4', volunteerId: 'v3', donorId: 'd4', donorName: 'Noah Brown', type: 'email', scheduledDate: '2025-01-22', status: 'pending' },
  { id: 'vt5', volunteerId: 'v5', donorId: 'd5', donorName: 'Ava Davis', type: 'text', scheduledDate: '2025-01-22', status: 'pending' },
];

export const recentDonations: Donation[] = [
  { id: 'don1', donorId: 'd6', donorName: 'Ethan Miller', amount: 5000, campaignId: 'c3', campaignName: 'Capital Campaign', timestamp: '2025-01-21T09:15:00', state: 'IL' },
  { id: 'don2', donorId: 'd3', donorName: 'Olivia Williams', amount: 2500, campaignId: 'c2', campaignName: 'Annual Gala', timestamp: '2025-01-21T09:32:00', state: 'TX' },
  { id: 'don3', donorId: 'd1', donorName: 'Emma Johnson', amount: 500, campaignId: 'c1', campaignName: 'Spring Drive', timestamp: '2025-01-21T10:45:00', state: 'CA' },
  { id: 'don4', donorId: 'd9', donorName: 'Isabella Anderson', amount: 1000, campaignId: 'c3', campaignName: 'Capital Campaign', timestamp: '2025-01-21T11:20:00', state: 'AZ' },
  { id: 'don5', donorId: 'd5', donorName: 'Ava Davis', amount: 200, campaignId: 'c1', campaignName: 'Spring Drive', timestamp: '2025-01-21T13:00:00', state: 'WA' },
  { id: 'don6', donorId: 'd7', donorName: 'Sophia Wilson', amount: 350, campaignId: 'c5', campaignName: 'Emergency Fund', timestamp: '2025-01-21T14:30:00', state: 'CA' },
  { id: 'don7', donorId: 'd2', donorName: 'Liam Smith', amount: 100, campaignId: 'c1', campaignName: 'Spring Drive', timestamp: '2025-01-21T15:45:00', state: 'NY' },
  { id: 'don8', donorId: 'd8', donorName: 'Mason Taylor', amount: 150, campaignId: 'c5', campaignName: 'Emergency Fund', timestamp: '2025-01-21T16:15:00', state: 'CO' },
];

export const metricData: MetricData = {
  donationsByState: [
    { state: 'CA', amount: 145000, count: 245 },
    { state: 'TX', amount: 98000, count: 156 },
    { state: 'NY', amount: 87000, count: 178 },
    { state: 'FL', amount: 65000, count: 134 },
    { state: 'IL', amount: 58000, count: 89 },
    { state: 'WA', amount: 45000, count: 98 },
    { state: 'CO', amount: 32000, count: 67 },
    { state: 'AZ', amount: 28000, count: 45 },
    { state: 'GA', amount: 22000, count: 56 },
    { state: 'Other', amount: 120000, count: 234 },
  ],
  donationsByCampaign: [
    { campaign: 'Capital Campaign', amount: 185000, goal: 500000 },
    { campaign: 'Annual Gala', amount: 78000, goal: 100000 },
    { campaign: 'Spring Drive', amount: 32500, goal: 50000 },
    { campaign: 'Emergency Fund', amount: 12000, goal: 25000 },
    { campaign: 'Holiday 2024', amount: 82000, goal: 75000 },
  ],
  donationsTrend: [
    { date: '2024-07', amount: 45000, count: 120 },
    { date: '2024-08', amount: 52000, count: 145 },
    { date: '2024-09', amount: 48000, count: 130 },
    { date: '2024-10', amount: 61000, count: 168 },
    { date: '2024-11', amount: 75000, count: 210 },
    { date: '2024-12', amount: 120000, count: 340 },
    { date: '2025-01', amount: 85000, count: 235 },
  ],
  playbookPerformance: [
    { playbook: 'Standard Outreach', responseRate: 32, conversionRate: 8.5 },
    { playbook: 'Major Donor', responseRate: 68, conversionRate: 24 },
    { playbook: 'Quick Strike', responseRate: 45, conversionRate: 12 },
  ],
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
