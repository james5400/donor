import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Calendar,
  Users,
  X,
} from 'lucide-react';
import { volunteers as initialVolunteers, Volunteer } from '../../data/mockData';

const Volunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Volunteer>>({});

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalHours = volunteers.reduce((sum, v) => sum + v.hoursThisWeek, 0);
  const totalTasks = volunteers.reduce((sum, v) => sum + v.tasksCompleted, 0);
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      setVolunteers(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleSave = () => {
    if (selectedVolunteer && isEditing) {
      setVolunteers(prev =>
        prev.map(v => (v.id === selectedVolunteer.id ? { ...v, ...formData } : v))
      );
      setIsEditing(false);
    } else if (!selectedVolunteer && formData.firstName) {
      const newVolunteer: Volunteer = {
        id: `v${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        phone: formData.phone!,
        status: formData.status || 'active',
        hoursThisWeek: 0,
        tasksCompleted: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setVolunteers(prev => [...prev, newVolunteer]);
    }
    setIsModalOpen(false);
    setSelectedVolunteer(null);
    setFormData({});
  };

  const openEditModal = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setFormData(volunteer);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedVolunteer(null);
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
          <h1 className="page-title">Volunteers</h1>
          <p className="page-subtitle">Manage your volunteer team</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Volunteer
        </motion.button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{volunteers.length}</div>
          <div className="stat-label">Total Volunteers</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{activeVolunteers}</div>
          <div className="stat-label">Active Volunteers</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{totalHours}</div>
          <div className="stat-label">Hours This Week</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Tasks Completed</div>
        </motion.div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Volunteers</h2>
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
                placeholder="Search volunteers..."
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
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Hours This Week</th>
                <th>Tasks Completed</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer, index) => (
                <motion.tr
                  key={volunteer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedVolunteer(volunteer)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: volunteer.status === 'active' 
                            ? 'var(--gradient-primary)' 
                            : 'var(--color-bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        {volunteer.firstName[0]}{volunteer.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {volunteer.firstName} {volunteer.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {volunteer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px' }}>{volunteer.phone}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        volunteer.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {volunteer.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                      {volunteer.hoursThisWeek}h
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                      {volunteer.tasksCompleted}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                      {volunteer.joinedDate}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{ display: 'flex', gap: '8px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => openEditModal(volunteer)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-icon btn-secondary"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => handleDelete(volunteer.id)}
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

        {filteredVolunteers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No volunteers found</div>
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
              style={{ maxWidth: '500px' }}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {isEditing ? 'Edit Volunteer' : 'Add New Volunteer'}
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
                    placeholder="Alex"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.lastName || ''}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Chen"
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
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone
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
                    type="tel"
                    className="input"
                    style={{ paddingLeft: '40px' }}
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Status</label>
                <select
                  className="input select"
                  value={formData.status || 'active'}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value as Volunteer['status'] })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  {isEditing ? 'Save Changes' : 'Add Volunteer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVolunteer && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedVolunteer(null)}
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
                <h2 className="modal-title">Volunteer Details</h2>
                <button className="modal-close" onClick={() => setSelectedVolunteer(null)}>
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
                    background: selectedVolunteer.status === 'active' 
                      ? 'var(--gradient-primary)' 
                      : 'var(--color-bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '24px',
                    margin: '0 auto 12px',
                  }}
                >
                  {selectedVolunteer.firstName[0]}{selectedVolunteer.lastName[0]}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600 }}>
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </div>
                <span
                  className={`badge ${
                    selectedVolunteer.status === 'active' ? 'badge-success' : 'badge-warning'
                  }`}
                  style={{ marginTop: '8px' }}
                >
                  {selectedVolunteer.status}
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
                  <span>{selectedVolunteer.email}</span>
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
                  <span>{selectedVolunteer.phone}</span>
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
                  <Clock size={18} style={{ color: 'var(--color-warning)' }} />
                  <span>{selectedVolunteer.hoursThisWeek} hours this week</span>
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
                  <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                  <span>{selectedVolunteer.tasksCompleted} tasks completed</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => openEditModal(selectedVolunteer)}
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

export default Volunteers;
