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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer' | 'manager';
  avatar?: string;
}

export interface ICPCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string | number | [number, number];
}
