import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  X,
} from 'lucide-react';
import { donors as initialDonors } from '../../data/mockData';
import type { Donor } from '../../types';

const Donors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Donor>>({});

  const filteredDonors = donors.filter(donor => {
    const matchesSearch =
      `${donor.firstName} ${donor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDonations = donors.reduce((sum, d) => sum + d.totalDonations, 0);
  const activeDonors = donors.filter(d => d.status === 'active').length;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      setDonors(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSave = () => {
    if (selectedDonor && isEditing) {
      setDonors(prev =>
        prev.map(d => (d.id === selectedDonor.id ? { ...d, ...formData } : d))
      );
      setIsEditing(false);
    } else if (!selectedDonor && formData.firstName) {
      const newDonor: Donor = {
        id: `d${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        phone: formData.phone!,
        state: formData.state!,
        city: formData.city!,
        totalDonations: formData.totalDonations || 0,
        lastDonationDate: new Date().toISOString().split('T')[0],
        status: formData.status || 'prospect',
        tags: formData.tags || [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDonors(prev => [...prev, newDonor]);
    }
    setIsModalOpen(false);
    setSelectedDonor(null);
    setFormData({});
  };

  const openEditModal = (donor: Donor) => {
    setSelectedDonor(donor);
    setFormData(donor);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedDonor(null);
    setFormData({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Donors</h1>
          <p className="page-subtitle">Manage your donor database</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Donor
        </motion.button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{donors.length}</div>
          <div className="stat-label">Total Donors</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{activeDonors}</div>
          <div className="stat-label">Active Donors</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">${totalDonations.toLocaleString()}</div>
          <div className="stat-label">Total Raised</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">
            ${Math.round(totalDonations / donors.length).toLocaleString()}
          </div>
          <div className="stat-label">Avg Donation</div>
        </motion.div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Donors</h2>
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
                placeholder="Search donors..."
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
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Total Donations</th>
                <th>Status</th>
                <th>Last Donation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor, index) => (
                <motion.tr
                  key={donor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedDonor(donor)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        {donor.firstName[0]}
                        {donor.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {donor.tags.slice(0, 2).join(', ')}
                          {donor.tags.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px' }}>{donor.email}</div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {donor.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                      {donor.city}, {donor.state}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      ${donor.totalDonations.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        donor.status === 'active'
                          ? 'badge-success'
                          : donor.status === 'prospect'
                          ? 'badge-primary'
                          : 'badge-warning'
                      }`}
                    >
                      {donor.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                      {donor.lastDonationDate}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{ display: 'flex', gap: '8px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => openEditModal(donor)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-icon btn-secondary"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => handleDelete(donor.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDonors.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No donors found</div>
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
                  {isEditing ? 'Edit Donor' : 'Add New Donor'}
                </h2>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.firstName || ''}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.lastName || ''}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail
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
                    type="email"
                    className="input"
                    style={{ paddingLeft: '40px' }}
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select
                    className="input select"
                    value={formData.status || 'prospect'}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Donor['status'] })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">State</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.state || ''}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="CA"
                  />
                </div>
                <div className="form-group">
                  <label className="label">City</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.city || ''}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Los Angeles"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Total Donations</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign
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
                    type="number"
                    className="input"
                    style={{ paddingLeft: '40px' }}
                    value={formData.totalDonations || ''}
                    onChange={e =>
                      setFormData({ ...formData, totalDonations: Number(e.target.value) })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.tags?.join(', ') || ''}
                  onChange={e =>
                    setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })
                  }
                  placeholder="major-donor, recurring"
                />
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
                  {isEditing ? 'Save Changes' : 'Add Donor'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDonor && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedDonor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '500px' }}
            >
              <div className="modal-header">
                <h2 className="modal-title">Donor Details</h2>
                <button className="modal-close" onClick={() => setSelectedDonor(null)}>
                  <X size={24} />
                </button>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '24px',
                    margin: '0 auto 12px',
                  }}
                >
                  {selectedDonor.firstName[0]}
                  {selectedDonor.lastName[0]}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600 }}>
                  {selectedDonor.firstName} {selectedDonor.lastName}
                </div>
                <span
                  className={`badge ${
                    selectedDonor.status === 'active'
                      ? 'badge-success'
                      : selectedDonor.status === 'prospect'
                      ? 'badge-primary'
                      : 'badge-warning'
                  }`}
                  style={{ marginTop: '8px' }}
                >
                  {selectedDonor.status}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <Mail size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{selectedDonor.email}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <Phone size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{selectedDonor.phone}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <MapPin size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span>
                    {selectedDonor.city}, {selectedDonor.state}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <DollarSign size={18} style={{ color: 'var(--color-success)' }} />
                  <span>Total: ${selectedDonor.totalDonations.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <Calendar size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span>Last Donation: {selectedDonor.lastDonationDate}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => openEditModal(selectedDonor)}
                  style={{ flex: 1 }}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  <Mail size={16} />
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Donors;
