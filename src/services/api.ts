import type {
  Donor,
  Campaign,
  Playbook,
  Volunteer,
  VolunteerTask,
  Task,
  Donation,
  ICPCriteria,
} from '../types';
import {
  donors as mockDonors,
  campaigns as mockCampaigns,
  playbooks as mockPlaybooks,
  volunteers as mockVolunteers,
  volunteerTasks as mockVolunteerTasks,
  todayTasks as mockTasks,
  recentDonations as mockDonations,
  generateId,
} from '../data/mockData';

class ApiService {
  private storageKey = 'donor_intelligence_data';

  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(`${this.storageKey}_${key}`);
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T[]): void {
    localStorage.setItem(`${this.storageKey}_${key}`, JSON.stringify(data));
  }

  private initializeData(): void {
    if (!localStorage.getItem(`${this.storageKey}_donors`)) {
      this.setData('donors', mockDonors);
      this.setData('campaigns', mockCampaigns);
      this.setData('playbooks', mockPlaybooks);
      this.setData('volunteers', mockVolunteers);
      this.setData('volunteerTasks', mockVolunteerTasks);
      this.setData('tasks', mockTasks);
      this.setData('donations', mockDonations);
    }
  }

  constructor() {
    this.initializeData();
  }

  async getDonors(): Promise<Donor[]> {
    return this.getData<Donor>('donors');
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    const donors = this.getData<Donor>('donors');
    return donors.find(d => d.id === id);
  }

  async createDonor(donor: Omit<Donor, 'id'>): Promise<Donor> {
    const donors = this.getData<Donor>('donors');
    const newDonor = { ...donor, id: generateId() };
    donors.push(newDonor);
    this.setData('donors', donors);
    return newDonor;
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | null> {
    const donors = this.getData<Donor>('donors');
    const index = donors.findIndex(d => d.id === id);
    if (index === -1) return null;
    donors[index] = { ...donors[index], ...updates };
    this.setData('donors', donors);
    return donors[index];
  }

  async deleteDonor(id: string): Promise<boolean> {
    const donors = this.getData<Donor>('donors');
    const filtered = donors.filter(d => d.id !== id);
    if (filtered.length === donors.length) return false;
    this.setData('donors', filtered);
    return true;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.getData<Campaign>('campaigns');
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const campaigns = this.getData<Campaign>('campaigns');
    return campaigns.find(c => c.id === id);
  }

  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const campaigns = this.getData<Campaign>('campaigns');
    const newCampaign = { ...campaign, id: generateId() };
    campaigns.push(newCampaign);
    this.setData('campaigns', campaigns);
    return newCampaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const campaigns = this.getData<Campaign>('campaigns');
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    campaigns[index] = { ...campaigns[index], ...updates };
    this.setData('campaigns', campaigns);
    return campaigns[index];
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const campaigns = this.getData<Campaign>('campaigns');
    const filtered = campaigns.filter(c => c.id !== id);
    if (filtered.length === campaigns.length) return false;
    this.setData('campaigns', filtered);
    return true;
  }

  async getPlaybooks(): Promise<Playbook[]> {
    return this.getData<Playbook>('playbooks');
  }

  async getPlaybook(id: string): Promise<Playbook | undefined> {
    const playbooks = this.getData<Playbook>('playbooks');
    return playbooks.find(p => p.id === id);
  }

  async createPlaybook(playbook: Omit<Playbook, 'id'>): Promise<Playbook> {
    const playbooks = this.getData<Playbook>('playbooks');
    const newPlaybook = { ...playbook, id: generateId() };
    playbooks.push(newPlaybook);
    this.setData('playbooks', playbooks);
    return newPlaybook;
  }

  async updatePlaybook(id: string, updates: Partial<Playbook>): Promise<Playbook | null> {
    const playbooks = this.getData<Playbook>('playbooks');
    const index = playbooks.findIndex(p => p.id === id);
    if (index === -1) return null;
    playbooks[index] = { ...playbooks[index], ...updates };
    this.setData('playbooks', playbooks);
    return playbooks[index];
  }

  async deletePlaybook(id: string): Promise<boolean> {
    const playbooks = this.getData<Playbook>('playbooks');
    const filtered = playbooks.filter(p => p.id !== id);
    if (filtered.length === playbooks.length) return false;
    this.setData('playbooks', filtered);
    return true;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return this.getData<Volunteer>('volunteers');
  }

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    const volunteers = this.getData<Volunteer>('volunteers');
    return volunteers.find(v => v.id === id);
  }

  async createVolunteer(volunteer: Omit<Volunteer, 'id'>): Promise<Volunteer> {
    const volunteers = this.getData<Volunteer>('volunteers');
    const newVolunteer = { ...volunteer, id: generateId() };
    volunteers.push(newVolunteer);
    this.setData('volunteers', volunteers);
    return newVolunteer;
  }

  async updateVolunteer(id: string, updates: Partial<Volunteer>): Promise<Volunteer | null> {
    const volunteers = this.getData<Volunteer>('volunteers');
    const index = volunteers.findIndex(v => v.id === id);
    if (index === -1) return null;
    volunteers[index] = { ...volunteers[index], ...updates };
    this.setData('volunteers', volunteers);
    return volunteers[index];
  }

  async deleteVolunteer(id: string): Promise<boolean> {
    const volunteers = this.getData<Volunteer>('volunteers');
    const filtered = volunteers.filter(v => v.id !== id);
    if (filtered.length === volunteers.length) return false;
    this.setData('volunteers', filtered);
    return true;
  }

  async getTasks(): Promise<Task[]> {
    return this.getData<Task>('tasks');
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = this.getData<Task>('tasks');
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    this.setData('tasks', tasks);
    return tasks[index];
  }

  async getVolunteerTasks(): Promise<VolunteerTask[]> {
    return this.getData<VolunteerTask>('volunteerTasks');
  }

  async createVolunteerTask(task: Omit<VolunteerTask, 'id'>): Promise<VolunteerTask> {
    const tasks = this.getData<VolunteerTask>('volunteerTasks');
    const newTask = { ...task, id: generateId() };
    tasks.push(newTask);
    this.setData('volunteerTasks', tasks);
    return newTask;
  }

  async updateVolunteerTask(id: string, updates: Partial<VolunteerTask>): Promise<VolunteerTask | null> {
    const tasks = this.getData<VolunteerTask>('volunteerTasks');
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    this.setData('volunteerTasks', tasks);
    return tasks[index];
  }

  async getDonations(): Promise<Donation[]> {
    return this.getData<Donation>('donations');
  }

  async addDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const donations = this.getData<Donation>('donations');
    const newDonation = { ...donation, id: generateId() };
    donations.unshift(newDonation);
    this.setData('donations', donations);
    return newDonation;
  }

  async searchDonors(criteria: ICPCriteria[]): Promise<Donor[]> {
    const donors = this.getData<Donor>('donors');
    return donors.filter(donor => {
      return criteria.every(criterion => {
        const value = donor[criterion.field as keyof Donor];
        switch (criterion.operator) {
          case 'equals':
            return value === criterion.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(criterion.value).toLowerCase());
          case 'greater':
            return Number(value) > Number(criterion.value);
          case 'less':
            return Number(value) < Number(criterion.value);
          case 'between':
            const [min, max] = criterion.value as [number, number];
            return Number(value) >= min && Number(value) <= max;
          default:
            return true;
        }
      });
    });
  }
}

export const api = new ApiService();

export const asteriskService = {
  async initiateCall(phoneNumber: string, campaignId: string): Promise<{ callId: string; status: string }> {
    console.log(`[Asterisk] Initiating call to ${phoneNumber} for campaign ${campaignId}`);
    return {
      callId: `call_${generateId()}`,
      status: 'initiated',
    };
  },

  async getCallStatus(callId: string): Promise<{ status: string; duration: number; recording?: string }> {
    console.log(`[Asterisk] Getting status for call ${callId}`);
    return {
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 60,
      recording: `https://api.asterisk.example/recordings/${callId}.mp3`,
    };
  },

  async scheduleCall(phoneNumber: string, scheduledTime: Date, campaignId: string): Promise<{ scheduledCallId: string }> {
    console.log(`[Asterisk] Scheduling call to ${phoneNumber} at ${scheduledTime}`);
    return {
      scheduledCallId: `scheduled_${generateId()}`,
    };
  },
};

export const smsService = {
  async sendSMS(phoneNumber: string, message: string, campaignId: string): Promise<{ messageId: string; status: string }> {
    console.log(`[SMS] Sending to ${phoneNumber}: ${message}`);
    return {
      messageId: `sms_${generateId()}`,
      status: 'sent',
    };
  },

  async scheduleSMS(phoneNumber: string, message: string, scheduledTime: Date, campaignId: string): Promise<{ scheduledMessageId: string }> {
    console.log(`[SMS] Scheduling to ${phoneNumber} at ${scheduledTime}`);
    return {
      scheduledMessageId: `scheduled_sms_${generateId()}`,
    };
  },

  async getMessageStatus(messageId: string): Promise<{ status: string; deliveredAt?: string }> {
    console.log(`[SMS] Getting status for message ${messageId}`);
    return {
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
    };
  },
};

export const emailService = {
  async sendEmail(to: string, subject: string, body: string, campaignId: string): Promise<{ emailId: string; status: string }> {
    console.log(`[Email] Sending to ${to}: ${subject}`);
    return {
      emailId: `email_${generateId()}`,
      status: 'sent',
    };
  },

  async scheduleEmail(to: string, subject: string, body: string, scheduledTime: Date, campaignId: string): Promise<{ scheduledEmailId: string }> {
    console.log(`[Email] Scheduling to ${to} at ${scheduledTime}`);
    return {
      scheduledEmailId: `scheduled_email_${generateId()}`,
    };
  },
};

export const aiService = {
  async generateMessage(type: 'email' | 'text' | 'phone', donorName: string, campaignName: string, context?: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (type === 'email') {
      return `Subject: Update on ${campaignName}\n\nDear ${donorName},\n\n${context || `We're excited to share updates about ${campaignName}!`}\n\nYour support makes a real difference in our community.\n\nBest regards,\nThe Team`;
    }
    return `Hi ${donorName}! Quick update on ${campaignName}. ${context || 'Every contribution counts! Reply YES to learn more.'}`;
  },
};
