# Donor Intelligence Platform

A modern, energetic fundraising management platform built for Smart Vision non-profit organizations.

## Features

### Today's Outlook
View and manage all email, text, and phone call tasks for the day based on campaign playbooks.

### Data Builder
- **Upload CSV**: Import donor lists from CSV files
- **Data Wizard**: 3-step LinkedIn data search for finding potential donors
- **ICP Builder**: Build Ideal Customer Profile criteria to find matching donors

### Donors
Complete CRUD functionality for managing donor database with search, filters, and detailed profiles.

### Campaigns
Manage fundraising campaigns with goals, progress tracking, and metrics.

### Playbooks
- Multi-step outreach sequences (email, text, phone)
- Version history with metric comparisons
- Copy and duplicate functionality

### Rolling Realtime
Live donation feed with animated visualizations and real-time updates.

### Volunteers
Manage volunteer team with activity tracking and task assignments.

### Workspace
Task management with AI-powered message generation for emails and texts.

### Metrics
Comprehensive analytics with pie charts, bar charts, and trend data.

### Settings
Profile management, notifications, integrations (Asterisk, Twilio, LinkedIn, Mailchimp).

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── layout/          # Layout components (Sidebar, Layout)
├── data/
│   └── mockData.ts      # Mock data for development
├── pages/
│   ├── Dashboard/       # Today's Outlook
│   ├── DataBuilder/     # CSV upload, wizard, ICP builder
│   ├── Donors/          # Donor CRUD
│   ├── Campaigns/       # Campaign management
│   ├── Playbooks/       # Playbook management
│   ├── RollingRealtime/ # Live donation feed
│   ├── Volunteers/      # Volunteer management
│   ├── Workspace/       # Task management
│   ├── Metrics/         # Analytics
│   └── Settings/        # User settings
├── services/
│   └── api.ts           # API service with CRUD operations
├── styles/
│   └── theme.css        # Global styles and theme
└── types/
    └── index.ts          # TypeScript interfaces
```

## Integrations

The platform includes stubs for:
- **Asterisk**: VoIP integration for phone calls
- **Twilio**: SMS sending capabilities
- **LinkedIn**: Data enrichment services
- **Mailchimp**: Email marketing integration
- **AI Service**: Auto-generate email and text messages

## Theme

The platform uses a vibrant, Gen Z-friendly dark theme with:
- Neon gradients (purple, pink, cyan)
- Animated backgrounds
- Smooth transitions
- Responsive design
