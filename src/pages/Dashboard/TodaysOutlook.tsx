import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Phone, Clock, CheckCircle, Search, PhoneOff, Mic, MicOff, Volume2, Timer, X } from 'lucide-react';
import { todayTasks } from '../../data/mockData';
import type { Task } from '../../types';

const taskTypeIcons = {
  email: Mail,
  text: MessageSquare,
  phone: Phone,
};

const taskTypeColors = {
  email: 'var(--color-email)',
  text: 'var(--color-text)',
  phone: 'var(--color-phone)',
};

interface CallSession {
  taskId: string;
  donorName: string;
  donorPhone: string;
  campaign: string;
  startTime: Date;
  isMuted: boolean;
  transcript: { speaker: string; text: string; time: string }[];
}

const callScript = [
  { speaker: 'Agent', text: "Hi, this is Sarah from the organization. Am I speaking with {name}?" },
  { speaker: 'Donor', text: "Yes, this is {name} speaking." },
  { speaker: 'Agent', text: "Great! I'm calling about our Spring Drive campaign. I wanted to share some exciting updates about the impact we're making in our community." },
  { speaker: 'Donor', text: "Oh, I've supported you before. What's new?" },
  { speaker: 'Agent', text: "This year, we've expanded our programs and we're closer than ever to reaching our goal. Your past support has helped provide resources to over 500 families." },
  { speaker: 'Donor', text: "That's wonderful to hear. How can I help?" },
  { speaker: 'Agent', text: "We're looking for supporters like you to help us cross the finish line. Any contribution, big or small, makes a real difference. Would you be able to donate today?" },
  { speaker: 'Donor', text: "I'd love to. What are the donation options?" },
  { speaker: 'Agent', text: "You can donate online at our website, or I can take your donation over the phone. We accept all major credit cards and have options for recurring monthly gifts." },
  { speaker: 'Donor', text: "Let me make a one-time donation of $250." },
  { speaker: 'Agent', text: "That's amazing! Thank you so much for your generosity. I'll process that right away. Your support truly makes a difference!" },
];

const TodaysOutlook: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(todayTasks);
  const [filter, setFilter] = useState<'all' | 'email' | 'text' | 'phone'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.type === filter;
    const matchesSearch =
      task.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );
  };

  const startCall = (task: Task) => {
    const callSession: CallSession = {
      taskId: task.id,
      donorName: task.donorName,
      donorPhone: '(555) 123-4567',
      campaign: task.campaign,
      startTime: new Date(),
      isMuted: false,
      transcript: [],
    };
    setActiveCall(callSession);
    setCurrentScriptIndex(0);
    setIsMuted(false);
  };

  const endCall = () => {
    if (activeCall) {
      completeTask(activeCall.taskId);
      setActiveCall(null);
      setCurrentScriptIndex(0);
    }
  };

  useEffect(() => {
    if (activeCall && transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeCall, currentScriptIndex]);

  useEffect(() => {
    if (!activeCall || isMuted) return;

    const interval = setInterval(() => {
      if (currentScriptIndex < callScript.length) {
        const scriptItem = callScript[currentScriptIndex];
        const updatedScriptItem = {
          ...scriptItem,
          text: scriptItem.text.replace('{name}', activeCall.donorName),
        };

        setActiveCall(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            transcript: [...prev.transcript, { ...updatedScriptItem, time: new Date().toLocaleTimeString() }],
          };
        });
        setCurrentScriptIndex(prev => prev + 1);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeCall, currentScriptIndex, isMuted]);

  const getElapsedTime = () => {
    if (!activeCall) return '00:00';
    const elapsed = Math.floor((new Date().getTime() - activeCall.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Today's Outlook</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </motion.div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Today's Tasks</h2>
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
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px', width: '200px' }}
              />
            </div>
            <div className="tabs" style={{ marginBottom: 0 }}>
              {(['all', 'email', 'text', 'phone'] as const).map(type => (
                <button
                  key={type}
                  className={`tab ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.map((task, index) => {
              const Icon = taskTypeIcons[task.type];
              const color = taskTypeColors[task.type];

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    background:
                      task.status === 'completed'
                        ? 'rgba(0, 210, 106, 0.05)'
                        : 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    opacity: task.status === 'completed' ? 0.6 : 1,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
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
                      marginRight: '16px',
                    }}
                  >
                    <Icon size={24} style={{ color }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {task.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {task.donorName} • {task.campaign}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginRight: '16px',
                    }}
                  >
                    <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {task.time}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      task.status === 'completed'
                        ? 'badge-success'
                        : task.status === 'in-progress'
                        ? 'badge-warning'
                        : 'badge-primary'
                    }`}
                    style={{ marginRight: '12px' }}
                  >
                    {task.status === 'completed'
                      ? 'Done'
                      : task.status === 'in-progress'
                      ? 'Active'
                      : 'Pending'}
                  </span>

                  {task.status !== 'completed' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {task.type === 'phone' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startCall(task)}
                          style={{
                            padding: '8px 16px',
                            background: 'var(--gradient-secondary)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Phone size={16} />
                          Call
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => completeTask(task.id)}
                        style={{
                          padding: '8px 16px',
                          background: 'var(--gradient-success)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle size={16} />
                        Complete
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No tasks found</div>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '500px',
                maxHeight: '80vh',
                background: 'var(--color-bg-secondary)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  background: 'var(--gradient-secondary)',
                  padding: '24px',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Phone size={40} color="white" />
                </motion.div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#ff4757',
                      borderRadius: '50%',
                      animation: 'pulse 1s ease-in-out infinite',
                    }}
                  />
                  <span style={{ color: 'white', fontWeight: 600 }}>IN CALL</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>
                  {activeCall.donorName}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>
                  {activeCall.donorPhone}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  <Timer size={18} />
                  {getElapsedTime()}
                </div>
                <button
                  onClick={endCall}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} color="white" />
                </button>
              </div>

              <div
                ref={transcriptRef}
                style={{
                  height: '300px',
                  overflowY: 'auto',
                  padding: '16px',
                  background: 'var(--color-bg-tertiary)',
                }}
              >
                {activeCall.transcript.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginBottom: '12px',
                      padding: '10px 14px',
                      background: entry.speaker === 'Agent' 
                        ? 'rgba(102, 126, 234, 0.15)'
                        : 'rgba(240, 147, 251, 0.15)',
                      borderRadius: '10px',
                      borderLeft: `3px solid ${entry.speaker === 'Agent' ? '#667eea' : '#f093fb'}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: entry.speaker === 'Agent' ? '#667eea' : '#f093fb',
                        }}
                      >
                        {entry.speaker}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {entry.time}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                      {entry.text}
                    </div>
                  </motion.div>
                ))}
                {activeCall.transcript.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'var(--color-text-muted)',
                      padding: '40px',
                    }}
                  >
                    Call in progress... Transcript will appear here
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: 'var(--color-bg-secondary)',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: isMuted ? 'var(--color-error)' : 'var(--color-bg-tertiary)',
                    border: '2px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {isMuted ? (
                    <MicOff size={24} style={{ color: 'white' }} />
                  ) : (
                    <Mic size={24} style={{ color: 'var(--color-text-secondary)' }} />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'var(--color-error)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={endCall}
                >
                  <PhoneOff size={32} color="white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--color-bg-tertiary)',
                    border: '2px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Volume2 size={24} style={{ color: 'var(--color-text-secondary)' }} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default TodaysOutlook;
