import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { metricData } from '../../data/mockData';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fa709a', '#fee140', '#ff4757', '#2ed573'];

const Metrics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'campaigns' | 'trends'>('overview');

  const stats = {
    totalDonations: 520500,
    donorCount: 1157,
    avgDonation: 450,
    campaignsActive: 4,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Metrics</h1>
          <p className="page-subtitle">Analytics and performance insights</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-secondary"
        >
          <Download size={18} />
          Export Report
        </motion.button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <DollarSign size={28} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
          <div className="stat-value">${stats.totalDonations.toLocaleString()}</div>
          <div className="stat-label">Total Donations</div>
          <div className="stat-change positive">
            <TrendingUp size={14} /> +18.5% from last month
          </div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Users size={28} style={{ color: 'var(--color-accent-cyan)', marginBottom: '12px' }} />
          <div className="stat-value">{stats.donorCount.toLocaleString()}</div>
          <div className="stat-label">Total Donors</div>
          <div className="stat-change positive">
            <TrendingUp size={14} /> +127 new donors
          </div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <BarChart3 size={28} style={{ color: 'var(--color-accent-tertiary)', marginBottom: '12px' }} />
          <div className="stat-value">${stats.avgDonation}</div>
          <div className="stat-label">Avg Donation</div>
          <div className="stat-change positive">
            <TrendingUp size={14} /> +12% from last month
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Calendar size={28} style={{ color: 'var(--color-warning)', marginBottom: '12px' }} />
          <div className="stat-value">{stats.campaignsActive}</div>
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-change positive">
            <TrendingUp size={14} /> 2 ending soon
          </div>
        </motion.div>
      </div>

      <div className="tabs">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'donations', label: 'Donations by State' },
          { key: 'campaigns', label: 'Campaign Performance' },
          { key: 'trends', label: 'Trends' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-2" style={{ gap: '24px' }}>
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Donations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricData.donationsTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#a0a0c0" />
                <YAxis stroke="#a0a0c0" tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#667eea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Donations by Campaign</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricData.donationsByCampaign} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#a0a0c0" tickFormatter={(value) => `$${value / 1000}k`} />
                <YAxis dataKey="campaign" type="category" stroke="#a0a0c0" width={120} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="amount" fill="#667eea" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Donations by State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={metricData.donationsByState}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="state"
                  label={({ state, percent }: { state?: string; percent?: number }) => `${state || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {metricData.donationsByState.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Playbook Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricData.playbookPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="playbook" stroke="#a0a0c0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#a0a0c0" />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="responseRate" name="Response Rate %" fill="#667eea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversionRate" name="Conversion Rate %" fill="#f093fb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {activeTab === 'donations' && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Donations by State</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={metricData.donationsByState}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="state" stroke="#a0a0c0" />
              <YAxis stroke="#a0a0c0" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="amount" name="Amount" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="count" name="Donors" fill="#f093fb" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" />
                  <stop offset="95%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-2" style={{ gap: '24px' }}>
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Campaign Goals vs Raised</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={metricData.donationsByCampaign}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="campaign" stroke="#a0a0c0" tick={{ fontSize: 11 }} />
                <YAxis stroke="#a0a0c0" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="amount" name="Raised" fill="#667eea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" name="Goal" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Campaign Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {metricData.donationsByCampaign.map((campaign, index) => {
                const percentage = Math.round((campaign.amount / campaign.goal) * 100);
                return (
                  <div key={campaign.campaign}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{campaign.campaign}</span>
                      <span style={{ color: 'var(--color-success)' }}>
                        ${campaign.amount.toLocaleString()} / ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                          height: '100%',
                          background: percentage >= 100 ? 'var(--color-success)' : 'var(--gradient-primary)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      <span>{percentage}% funded</span>
                      <span>{campaign.goal - campaign.amount > 0 
                        ? `$${(campaign.goal - campaign.amount).toLocaleString()} to go` 
                        : 'Goal exceeded!'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="grid grid-2" style={{ gap: '24px' }}>
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Donation Amount Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={metricData.donationsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#a0a0c0" />
                <YAxis stroke="#a0a0c0" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="card-title" style={{ marginBottom: '20px' }}>Donor Count Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={metricData.donationsTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f093fb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f093fb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#a0a0c0" />
                <YAxis stroke="#a0a0c0" />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f093fb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Metrics;
