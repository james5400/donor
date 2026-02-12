import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Database,
  Users,
  Megaphone,
  BookOpen,
  Zap,
  UserPlus,
  Briefcase,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: "Today's Outlook" },
  { path: '/data-builder', icon: Database, label: 'Data Builder' },
  { path: '/donors', icon: Users, label: 'Donors' },
  { path: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { path: '/playbooks', icon: BookOpen, label: 'Playbooks' },
  { path: '/rolling-realtime', icon: Zap, label: 'Rolling Realtime' },
  { path: '/volunteers', icon: UserPlus, label: 'Volunteers' },
  { path: '/workspace', icon: Briefcase, label: 'Workspace' },
  { path: '/metrics', icon: BarChart3, label: 'Metrics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '260px',
        height: '100vh',
        background: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      <motion.div
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--gradient-primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={24} color="white" />
        </motion.div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>Donor Intelligence Platform</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Smart Vision
          </div>
        </div>
      </motion.div>

      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '4px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive
                ? 'white'
                : 'var(--color-text-secondary)',
              background: isActive ? 'var(--gradient-primary)' : 'transparent',
              transition: 'all 0.2s ease',
              fontWeight: isActive ? 600 : 500,
            })}
          >
            <item.icon size={20} />
            <span style={{ fontSize: '14px' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
        <div
          style={{
            padding: '16px',
            background: 'var(--gradient-primary)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            Need Help?
          </div>
          <div
            style={{
              fontSize: '11px',
              opacity: 0.8,
            }}
          >
            Contact Support
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
