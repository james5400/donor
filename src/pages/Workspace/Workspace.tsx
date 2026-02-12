import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  Sparkles,
  CheckCircle,
  ChevronDown,
  X,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Timer,
  Bot,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageCircle,
  Command,
  ArrowRight,
  Check,
} from 'lucide-react';
import { volunteerTasks, donors, VolunteerTask, Donor } from '../../data/mockData';
import { aiService, smsService, emailService } from '../../services/api';

interface CallSession {
  taskId: string;
  donorName: string;
  donorPhone: string;
  campaign: string;
  startTime: Date;
  isMuted: boolean;
  transcript: { speaker: string; text: string; time: string }[];
}

interface Message {
  id: string;
  sender: 'user' | 'donor';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  type?: 'text' | 'command' | 'report' | 'stats';
}

const callScript = [
  { speaker: 'Agent', text: "Hi, this is Sarah from the organization. Am I speaking with {name}?" },
  { speaker: 'Donor', text: "Yes, this is {name} speaking." },
  { speaker: 'Agent', text: "Great! I'm calling about our Spring Drive campaign. I wanted to share some exciting updates about the impact we're making." },
  { speaker: 'Donor', text: "Oh, I've supported you before. What's new?" },
  { speaker: 'Agent', text: "This year, we've expanded our programs and we're closer than ever to reaching our goal." },
  { speaker: 'Donor', text: "That's wonderful to hear. How can I help?" },
  { speaker: 'Agent', text: "Would you be able to donate today? Any amount makes a difference." },
  { speaker: 'Donor', text: "Let me make a one-time donation of $250." },
  { speaker: 'Agent', text: "That's amazing! Thank you so much for your generosity!" },
];

const quickReplies = [
  "Show me today's tasks",
  "Generate campaign report",
  "Show volunteer stats",
  "Show donation metrics",
  "Show top donors",
  "Show active campaigns",
];

const Workspace: React.FC = () => {
  const [tasks, setTasks] = useState<VolunteerTask[]>(volunteerTasks);
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [messageType, setMessageType] = useState<'email' | 'text' | 'phone'>('email');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! I'm your AI assistant. I can help you with:\n\n• Navigating to different screens\n• Generating reports\n• Viewing live stats\n\nTry saying 'Show me today's tasks' or 'Generate campaign report'",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [selectedDonorForSMS, setSelectedDonorForSMS] = useState<Donor | null>(null);
  const [smsInput, setSmsInput] = useState('');
  const [showSMSPanel, setShowSMSPanel] = useState(false);

  const getDonorById = (id: string): Donor | undefined => {
    return donors.find(d => d.id === id);
  };

  const generateMessage = async () => {
    if (!selectedTask) return;
    
    const donor = getDonorById(selectedTask.donorId);
    if (!donor) return;

    setIsGenerating(true);
    try {
      const message = await aiService.generateMessage(
        messageType,
        `${donor.firstName} ${donor.lastName}`,
        'Spring Drive 2025',
        undefined
      );
      setGeneratedMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendDirectSMS = async () => {
    if (!selectedDonorForSMS || !smsInput.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: smsInput,
      time: new Date().toLocaleTimeString(),
      status: 'sent',
    };

    setDirectMessages(prev => [...prev, message]);
    setSmsInput('');

    await smsService.sendSMS(selectedDonorForSMS.phone, smsInput, 'c1');

    setTimeout(() => {
      setDirectMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: 'delivered' } : m)
      );
    }, 1000);

    setTimeout(() => {
      const responses = [
        "Thank you for the update! I'll check it out.",
        "Got it, thanks for reaching out!",
        "Appreciate you letting me know!",
        "Sounds great! I'll follow up shortly.",
      ];
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'donor',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString(),
        status: 'read',
      };
      setDirectMessages(prev => [...prev, response]);
    }, 3000);
  };

  const startCall = (task: VolunteerTask) => {
    const callSession: CallSession = {
      taskId: task.id,
      donorName: task.donorName,
      donorPhone: '(555) 123-4567',
      campaign: 'Spring Drive',
      startTime: new Date(),
      isMuted: false,
      transcript: [],
    };
    setActiveCall(callSession);
    setCurrentScriptIndex(0);
    setIsMuted(false);
    setSelectedTask(null);
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
    if (chatbotOpen && chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [chatbotOpen, chatMessages]);

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

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const response = processBotCommand(chatInput);
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const processBotCommand = (input: string): ChatMessage => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('today') && lowerInput.includes('task')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Here are your tasks for today:\n\n📋 7 total tasks\n✅ 2 completed\n⏳ 5 pending\n\nTop priority: Follow up with Emma Johnson (email)`,
        timestamp: new Date(),
        type: 'stats',
      };
    }

    if (lowerInput.includes('campaign') && lowerInput.includes('report')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `📊 Campaign Report - Spring Drive 2025\n\n💰 Raised: $32,500 / $50,000 (65%)\n👥 Donors: 245\n📈 Avg Donation: $132\n\nTop Campaign: Capital Campaign - $185K raised\n\nView detailed report?`,
        timestamp: new Date(),
        type: 'report',
      };
    }

    if (lowerInput.includes('volunteer') && (lowerInput.includes('stat') || lowerInput.includes('stats'))) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `👥 Volunteer Stats\n\nActive: 4 volunteers\nTotal Hours This Week: 41 hours\nTasks Completed Today: 23\n\nTop Performers:\n1. Casey Martinez - 15 hrs, 68 tasks\n2. Alex Chen - 12 hrs, 45 tasks`,
        timestamp: new Date(),
        type: 'stats',
      };
    }

    if (lowerInput.includes('donation') && (lowerInput.includes('metric') || lowerInput.includes('stat'))) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `💰 Donation Metrics\n\nTotal Raised: $520,500\nTotal Donors: 1,157\nAvg Donation: $450\n\nBy State:\n🇺🇸 CA: $145K\n🇺🇸 TX: $98K\n🇺🇸 NY: $87K\n\nTrending: +18.5% from last month`,
        timestamp: new Date(),
        type: 'stats',
      };
    }

    if (lowerInput.includes('top donor')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `⭐ Top Donors\n\n1. Ethan Miller - $8,000\n2. Olivia Williams - $5,200\n3. Isabella Anderson - $4,200\n4. Emma Johnson - $2,500\n5. Sophia Wilson - $2,100\n\nView full donor list?`,
        timestamp: new Date(),
        type: 'stats',
      };
    }

    if (lowerInput.includes('active campaign')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `📢 Active Campaigns\n\n1. Capital Campaign - $185K / $500K\n2. Annual Gala - $78K / $100K\n3. Spring Drive - $32.5K / $50K\n4. Emergency Fund - $12K / $25K\n\n2 campaigns ending soon!`,
        timestamp: new Date(),
        type: 'stats',
      };
    }

    if (lowerInput.includes('navigate') || lowerInput.includes('go to') || lowerInput.includes('show me')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `🧭 Navigation\n\nI can take you to:\n• Today's Outlook - View daily tasks\n• Donors - Manage donors\n• Campaigns - Campaign overview\n• Metrics - Analytics & reports\n• Volunteers - Team management\n• Rolling Realtime - Live donations\n\nWhere would you like to go?`,
        timestamp: new Date(),
        type: 'command',
      };
    }

    return {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: `I can help you with:\n\n📋 "Show me today's tasks"\n📊 "Generate campaign report"\n👥 "Show volunteer stats"\n💰 "Show donation metrics"\n⭐ "Show top donors"\n📢 "Show active campaigns"\n\nOr say "navigate to..." to change screens.`,
      timestamp: new Date(),
    };
  };

  const sendMessage = async () => {
    if (!selectedTask || !generatedMessage) return;

    const donor = getDonorById(selectedTask.donorId);
    if (!donor) return;

    try {
      if (messageType === 'email') {
        await emailService.sendEmail(
          donor.email,
          'Update on Spring Drive 2025',
          generatedMessage,
          'c1'
        );
      } else if (messageType === 'text') {
        await smsService.sendSMS(
          donor.phone,
          generatedMessage,
          'c1'
        );
      }
      
      setSentMessages(prev => [...prev, selectedTask.id]);
      setTasks(prev =>
        prev.map(t =>
          t.id === selectedTask.id ? { ...t, status: 'completed' } : t
        )
      );
      setSelectedTask(null);
      setGeneratedMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const completeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      )
    );
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative' }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace</h1>
          <p className="page-subtitle">Manage volunteer tasks and outreach</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSMSPanel(!showSMSPanel)}
            style={{
              padding: '10px 16px',
              background: showSMSPanel ? 'var(--gradient-secondary)' : 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <MessageSquare size={18} />
            Direct SMS
          </motion.button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{pendingTasks.length}</div>
          <div className="stat-label">Pending Tasks</div>
        </motion.div>
        <motion.div
          className="stat-card success"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{completedTasks.length}</div>
          <div className="stat-label">Completed</div>
        </motion.div>
        <motion.div
          className="stat-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{directMessages.length}</div>
          <div className="stat-label">SMS Sent</div>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-value">{directMessages.filter(m => m.status === 'read').length}</div>
          <div className="stat-label">Replies Received</div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSMSPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '24px', overflow: 'hidden' }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Direct SMS to Donors</h2>
                <button 
                  onClick={() => setShowSMSPanel(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} style={{ color: 'var(--color-text-muted)' }} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    Select Donor
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {donors.slice(0, 6).map(donor => (
                      <motion.div
                        key={donor.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDonorForSMS(donor)}
                        style={{
                          padding: '12px',
                          background: selectedDonorForSMS?.id === donor.id ? 'var(--gradient-primary)' : 'var(--color-bg-tertiary)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: `1px solid ${selectedDonorForSMS?.id === donor.id ? 'transparent' : 'var(--color-border)'}`,
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          {donor.phone}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  {selectedDonorForSMS ? (
                    <>
                      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {selectedDonorForSMS.firstName[0]}{selectedDonorForSMS.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {selectedDonorForSMS.firstName} {selectedDonorForSMS.lastName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {selectedDonorForSMS.phone} • {selectedDonorForSMS.city}, {selectedDonorForSMS.state}
                          </div>
                        </div>
                      </div>

                      <div
                        ref={chatEndRef}
                        style={{
                          height: '200px',
                          overflowY: 'auto',
                          background: 'var(--color-bg-tertiary)',
                          borderRadius: '12px',
                          padding: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        {directMessages.length === 0 ? (
                          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>
                            Messages will appear here
                          </div>
                        ) : (
                          directMessages.map(msg => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{
                                marginBottom: '8px',
                                padding: '10px 14px',
                                background: msg.sender === 'user' 
                                  ? 'rgba(102, 126, 234, 0.2)' 
                                  : 'rgba(0, 210, 106, 0.1)',
                                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                marginLeft: msg.sender === 'user' ? 'auto' : '0',
                                maxWidth: '80%',
                              }}
                            >
                              <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                                {msg.text}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                                <span>{msg.time}</span>
                                {msg.sender === 'user' && (
                                  <span>{msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : '○'}</span>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Type a message..."
                          value={smsInput}
                          onChange={e => setSmsInput(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && sendDirectSMS()}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={sendDirectSMS}
                          style={{
                            padding: '12px',
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Send size={18} color="white" />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
                      Select a donor to start texting
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-2" style={{ gap: '24px' }}>
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <h2 className="card-title">Today's Tasks</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="input select" style={{ width: '120px' }}>
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="text">Text</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task, index) => {
              const donor = getDonorById(task.donorId);
              const TaskIcon = taskTypeIcons[task.type];
              const color = taskTypeColors[task.type];

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => task.type !== 'phone' && setSelectedTask(task)}
                  style={{
                    padding: '16px',
                    background: task.status === 'completed'
                      ? 'rgba(0, 210, 106, 0.05)'
                      : 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    cursor: task.type !== 'phone' ? 'pointer' : 'default',
                    opacity: task.status === 'completed' ? 0.6 : 1,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: `${color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TaskIcon size={20} style={{ color }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {task.donorName}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)} • {task.scheduledDate}
                      </div>
                    </div>

                    {task.status === 'completed' ? (
                      <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                    ) : task.type === 'phone' ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startCall(task);
                        }}
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
                    ) : (
                      <ChevronDown size={20} style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <h2 className="card-title">Message Composer</h2>
            {selectedTask && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['email', 'text'] as const).map(type => {
                  const Icon = taskTypeIcons[type];
                  const color = taskTypeColors[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setMessageType(type)}
                      style={{
                        padding: '8px 12px',
                        background: messageType === type ? `${color}20` : 'var(--color-bg-tertiary)',
                        border: `1px solid ${messageType === type ? color : 'var(--color-border)'}`,
                        borderRadius: '8px',
                        color: messageType === type ? color : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      <Icon size={16} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedTask ? (
            <div>
              {(() => {
                const donor = getDonorById(selectedTask.donorId);
                return (
                  <div
                    style={{
                      padding: '16px',
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                        }}
                      >
                        {donor?.firstName[0]}{donor?.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{selectedTask.donorName}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                          {donor?.email} • {donor?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ marginBottom: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateMessage}
                  disabled={isGenerating}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Sparkles size={18} />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </motion.button>
              </div>

              {generatedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '16px' }}
                >
                  <label className="label">Generated Message</label>
                  <textarea
                    className="input"
                    rows={6}
                    value={generatedMessage}
                    onChange={e => setGeneratedMessage(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </motion.div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendMessage}
                  disabled={!generatedMessage || sentMessages.includes(selectedTask.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: generatedMessage && !sentMessages.includes(selectedTask.id)
                      ? 'var(--gradient-success)'
                      : 'var(--color-bg-tertiary)',
                    border: 'none',
                    borderRadius: '10px',
                    color: generatedMessage && !sentMessages.includes(selectedTask.id) ? 'white' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    cursor: generatedMessage && !sentMessages.includes(selectedTask.id) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={18} />
                  {sentMessages.includes(selectedTask.id) ? 'Sent!' : `Send ${messageType}`}
                </motion.button>

                {!sentMessages.includes(selectedTask.id) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeTask(selectedTask.id)}
                    style={{
                      padding: '12px 20px',
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark Done
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">Select a task</div>
              <p>Click on a task from the left to compose a message</p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatbotOpen(!chatbotOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: chatbotOpen ? 'var(--gradient-secondary)' : 'var(--gradient-primary)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 100,
        }}
      >
        <Bot size={28} color="white" />
      </motion.button>

      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '380px',
              maxHeight: '500px',
              background: 'var(--color-bg-secondary)',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              zIndex: 99,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                background: 'var(--gradient-primary)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={24} color="white" />
                <div>
                  <div style={{ fontWeight: 600, color: 'white' }}>AI Assistant</div>
                  <div style={{ fontSize: '11px', opacity: 0.8, color: 'white' }}>Ask me anything</div>
                </div>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} color="white" />
              </button>
            </div>

            <div
              ref={chatEndRef}
              style={{
                height: '300px',
                overflowY: 'auto',
                padding: '16px',
              }}
            >
              {chatMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: '12px',
                    padding: '12px 14px',
                    background: msg.sender === 'bot' ? 'var(--color-bg-tertiary)' : 'rgba(102, 126, 234, 0.2)',
                    borderRadius: msg.sender === 'bot' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                    marginLeft: msg.sender === 'bot' ? '0' : 'auto',
                    maxWidth: '85%',
                    whiteSpace: 'pre-wrap',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {quickReplies.map((reply, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setChatMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        sender: 'user',
                        text: reply,
                        timestamp: new Date(),
                      }]);
                      setTimeout(() => {
                        const response = processBotCommand(reply);
                        setChatMessages(prev => [...prev, response]);
                      }, 800);
                    }}
                    style={{
                      padding: '6px 10px',
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '16px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Ask me anything..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                  style={{ flex: 1 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendChatMessage}
                  style={{
                    padding: '12px',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={18} color="white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              </div>

              <div
                style={{
                  display: 'flex',
 'center',
                                   justifyContent: gap: '16px',
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

export default Workspace;
