import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Target,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  X,
  BarChart3,
} from 'lucide-react';
import { campaigns as initialCampaigns, Campaign } from '../../data/mockData';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Campaign>>({});

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRaised = campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + c.raised, 0);
  const totalGoal = campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + c.goal, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (selectedCampaign && isEditing) {
      setCampaigns(prev =>
        prev.map(c => (c.id === selectedCampaign.id ? { ...c, ...formData } : c))
      );
      setIsEditing(false);
    } else if (!selectedCampaign && formData.name) {
      const newCampaign: Campaign = {
        id: `c${Date.now()}`,
        name: formData.name!,
        description: formData.description || '',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date().toISOString().split('T')[0],
        goal: formData.goal || 0,
        raised: 0,
        donorCount: 0,
        status: formData.status || 'draft',
        playbookId: formData.playbookId || '',
      };
      setCampaigns(prev => [...prev, newCampaign]);
    }
    setIsModalOpen(false);
    setSelectedCampaign(null);
    setFormData({});
  };

  const openEditModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData(campaign);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCampaign(null);
    setFormData({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const getProgressColor = (raised: number, goal: number) => {
    const percentage = (raised / goal) * 100;
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 50) return 'var(--color-warning)';
    return 'var(--color-accent-primary)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Manage fundraising campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          New Campaign
        </motion.button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{activeCampaigns}</div>
          <div className="stat-label">Active Campaigns</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">${totalRaised.toLocaleString()}</div>
          <div className="stat-label">Total Raised</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">${totalGoal.toLocaleString()}</div>
          <div className="stat-label">Total Goal</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">
            {totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%
          </div>
          <div className="stat-label">Overall Progress</div>
        </motion.div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Campaigns</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                className="input"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px', width: '250px' }}
              />
            </div>
            <select
              className="input select"
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              style={{ width: '140px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '16px' }}>
          {filteredCampaigns.map((campaign, index) => {
            const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
            const progressColor = getProgressColor(campaign.raised, campaign.goal);

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  padding: '20px',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)',
                }}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{campaign.name}</h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {campaign.description}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      campaign.status === 'active'
                        ? 'badge-success'
                        : campaign.status === 'completed'
                        ? 'badge-primary'
                        : 'badge-warning'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      Progress
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: 'var(--color-bg-primary)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      style={{
                        height: '100%',
                        background: progressColor,
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} />
                    {campaign.donorCount} donors
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => openEditModal(campaign)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDelete(campaign.id)}
                    style={{ color: 'var(--color-error)' }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <div className="empty-state-title">No campaigns found</div>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '600px' }}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {isEditing ? 'Edit Campaign' : 'New Campaign'}
                </h2>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="form-group">
                <label className="label">Campaign Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Spring Drive 2025"
                />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your campaign..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.startDate || ''}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.endDate || ''}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Fundraising Goal</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.goal || ''}
                    onChange={e => setFormData({ ...formData, goal: Number(e.target.value) })}
                    placeholder="50000"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select
                    className="input select"
                    value={formData.status || 'draft'}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Campaign['status'] })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Playbook (Optional)</label>
                <select
                  className="input select"
                  value={formData.playbookId || ''}
                  onChange={e => setFormData({ ...formData, playbookId: e.target.value })}
                >
                  <option value="">Select a playbook...</option>
                  <option value="pb1">Standard Outreach</option>
                  <option value="pb2">Major Donor Cultivation</option>
                  <option value="pb3">Quick Strike</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                  {isEditing ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCampaign && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '600px' }}
            >
              <div className="modal-header">
                <h2 className="modal-title">Campaign Details</h2>
                <button className="modal-close" onClick={() => setSelectedCampaign(null)}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  {selectedCampaign.name}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedCampaign.description}
                </p>
                <span
                  className={`badge ${
                    selectedCampaign.status === 'active'
                      ? 'badge-success'
                      : selectedCampaign.status === 'completed'
                      ? 'badge-primary'
                      : 'badge-warning'
                  }`}
                  style={{ marginTop: '8px' }}
                >
                  {selectedCampaign.status}
                </span>
              </div>

              <div
                style={{
                  padding: '24px',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>
                    ${selectedCampaign.raised.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    of ${selectedCampaign.goal.toLocaleString()} goal
                  </span>
                </div>
                <div
                  style={{
                    height: '12px',
                    background: 'var(--color-bg-primary)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min((selectedCampaign.raised / selectedCampaign.goal) * 100, 100)}%`,
                      background: 'var(--gradient-primary)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <DollarSign size={24} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>
                    ${Math.round(selectedCampaign.raised / Math.max(selectedCampaign.donorCount, 1)).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Avg Donation</div>
                </div>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Users size={24} style={{ color: 'var(--color-accent-primary)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>
                    {selectedCampaign.donorCount}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Donors</div>
                </div>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Calendar size={24} style={{ color: 'var(--color-warning)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>
                    {selectedCampaign.startDate}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Start Date</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => openEditModal(selectedCampaign)}
                  style={{ flex: 1 }}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  <BarChart3 size={16} />
                  View Metrics
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Campaigns;
