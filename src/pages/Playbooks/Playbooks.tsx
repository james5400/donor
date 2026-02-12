import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  History,
  X,
  Copy,
} from 'lucide-react';
import { playbooks as initialPlaybooks, Playbook } from '../../data/mockData';

const Playbooks: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(initialPlaybooks);
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const stepTypeIcons = {
    email: Mail,
    text: MessageSquare,
    phone: Phone,
  };

  const stepTypeColors = {
    email: 'var(--color-email)',
    text: 'var(--color-text)',
    phone: 'var(--color-phone)',
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this playbook?')) {
      setPlaybooks(prev => prev.filter(p => p.id !== id));
    }
  };

  const duplicatePlaybook = (playbook: Playbook) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: `pb${Date.now()}`,
      name: `${playbook.name} (Copy)`,
      version: 1,
      lastModified: new Date().toISOString().split('T')[0],
      versionHistory: [],
    };
    setPlaybooks(prev => [...prev, newPlaybook]);
  };

  const totalMetrics = playbooks.reduce(
    (acc, p) => ({
      totalDonations: acc.totalDonations + p.metrics.totalDonations,
      avgResponse: acc.avgResponse + p.metrics.avgResponseRate,
      avgConversion: acc.avgConversion + p.metrics.avgConversionRate,
    }),
    { totalDonations: 0, avgResponse: 0, avgConversion: 0 }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Playbooks</h1>
          <p className="page-subtitle">Manage outreach playbooks with version tracking</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          New Playbook
        </motion.button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{playbooks.length}</div>
          <div className="stat-label">Total Playbooks</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">
            ${(totalMetrics.totalDonations / 1000).toFixed(0)}K
          </div>
          <div className="stat-label">Total Raised</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{Math.round(totalMetrics.avgResponse / playbooks.length)}%</div>
          <div className="stat-label">Avg Response Rate</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{Math.round(totalMetrics.avgConversion / playbooks.length)}%</div>
          <div className="stat-label">Avg Conversion Rate</div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {playbooks.map((playbook, index) => {
          const isExpanded = expandedPlaybook === playbook.id;
          const showHistory = showVersionHistory === playbook.id;

          return (
            <motion.div
              key={playbook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  setExpandedPlaybook(isExpanded ? null : playbook.id)
                }
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'var(--gradient-primary)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={28} color="white" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{playbook.name}</h3>
                      <span className="badge badge-primary">v{playbook.version}</span>
                    </div>
                    <p
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '14px',
                        marginBottom: '16px',
                      }}
                    >
                      {playbook.description}
                    </p>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
                        <span style={{ fontSize: '14px' }}>
                          {playbook.metrics.avgResponseRate}% Response
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={16} style={{ color: 'var(--color-warning)' }} />
                        <span style={{ fontSize: '14px' }}>
                          {playbook.metrics.avgConversionRate}% Conversion
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} style={{ color: 'var(--color-accent-primary)' }} />
                        <span style={{ fontSize: '14px' }}>
                          ${playbook.metrics.totalDonations.toLocaleString()} Raised
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                          {playbook.steps.length} steps • {playbook.lastModified}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => duplicatePlaybook(playbook)}
                    >
                      <Copy size={14} />
                      Duplicate
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowVersionHistory(showHistory ? null : playbook.id)}
                    >
                      <History size={14} />
                      History
                    </button>
                    <button
                      className="btn btn-icon btn-secondary"
                      onClick={() => handleDelete(playbook.id)}
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? (
                      <ChevronUp size={20} style={{ color: 'var(--color-text-muted)' }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '24px',
                        background: 'var(--color-bg-tertiary)',
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>
                        Version History
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {playbook.versionHistory.map((version, vIndex) => (
                          <div
                            key={version.version}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px',
                              padding: '16px',
                              background: 'var(--color-bg-card)',
                              borderRadius: '12px',
                            }}
                          >
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                background: vIndex === 0 ? 'var(--gradient-primary)' : 'var(--color-bg-tertiary)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              v{version.version}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '4px',
                                }}
                              >
                                <span style={{ fontWeight: 600 }}>Version {version.version}</span>
                                {vIndex === 0 && (
                                  <span className="badge badge-success">Current</span>
                                )}
                              </div>
                              <p
                                style={{
                                  fontSize: '13px',
                                  color: 'var(--color-text-secondary)',
                                  marginBottom: '8px',
                                }}
                              >
                                {version.changes.join(', ')}
                              </p>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>
                                  {version.date}
                                </span>
                                <span style={{ color: 'var(--color-success)' }}>
                                  Response: {version.metrics.avgResponseRate}%
                                </span>
                                <span style={{ color: 'var(--color-warning)' }}>
                                  Conversion: {version.metrics.avgConversionRate}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '24px',
                        background: 'var(--color-bg-tertiary)',
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <h4 style={{ fontWeight: 600, marginBottom: '20px' }}>
                        Playbook Steps
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {playbook.steps.map((step, stepIndex) => {
                          const StepIcon = stepTypeIcons[step.type];
                          const color = stepTypeColors[step.type];

                          return (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIndex * 0.1 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                background: 'var(--color-bg-card)',
                                borderRadius: '12px',
                              }}
                            >
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '12px',
                                  background: `${color}20`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {stepIndex + 1}
                              </div>

                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '10px',
                                  background: `${color}15`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <StepIcon size={20} style={{ color }} />
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                  {step.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: '13px',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  {step.description}
                                </div>
                                {step.template && (
                                  <div
                                    style={{
                                      marginTop: '8px',
                                      padding: '8px 12px',
                                      background: 'var(--color-bg-tertiary)',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontFamily: 'monospace',
                                      color: 'var(--color-text-muted)',
                                    }}
                                  >
                                    {step.template}
                                  </div>
                                )}
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <span
                                  className="badge"
                                  style={{
                                    background: `${color}20`,
                                    color: color,
                                  }}
                                >
                                  {step.type}
                                </span>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'var(--color-text-muted)',
                                    marginTop: '4px',
                                  }}
                                >
                                  After {step.delayDays} days
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Playbooks;
