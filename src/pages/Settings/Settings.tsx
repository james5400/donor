import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Smartphone,
  Mail,
  Phone,
  Save,
  Key,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    donations: true,
    campaigns: true,
    volunteers: false,
  });

  const [settings, setSettings] = useState({
    name: 'John Smith',
    email: 'john.smith@smartvision.org',
    phone: '(555) 123-4567',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'dark',
  });

  const [integrations, setIntegrations] = useState({
    asterisk: { connected: true, number: '+1 (555) 000-0000' },
    twilio: { connected: true, accountSid: 'AC****************************' },
    linkedin: { connected: false },
    mailchimp: { connected: true, listCount: 1250 },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: '24px' }}>
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--gradient-primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={24} color="white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Profile</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Account information
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              value={settings.name}
              onChange={e => setSettings({ ...settings, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={settings.email}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label">Phone</label>
            <input
              type="tel"
              className="input"
              value={settings.phone}
              onChange={e => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Timezone</label>
              <select
                className="input select"
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Language</label>
              <select
                className="input select"
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <Save size={18} />
            Save Changes
          </motion.button>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--gradient-secondary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={24} color="white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Notifications</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Configure alerts
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'email', label: 'Email Notifications', icon: Mail },
              { key: 'sms', label: 'SMS Notifications', icon: Smartphone },
              { key: 'push', label: 'Push Notifications', icon: Bell },
            ].map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{label}</span>
                </div>
                <button
                  onClick={() =>
                    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {notifications[key as keyof typeof notifications] ? (
                    <ToggleRight size={28} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <ToggleLeft size={28} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Alert Types</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'donations', label: 'New Donations', color: 'var(--color-success)' },
                { key: 'campaigns', label: 'Campaign Updates', color: 'var(--color-warning)' },
                { key: 'volunteers', label: 'Volunteer Activity', color: 'var(--color-accent-primary)' },
              ].map(({ key, label, color }) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '10px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={() =>
                      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                    }
                    style={{ accentColor: color }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--gradient-success)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={24} color="white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Integrations</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Connected services
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'asterisk', label: 'Asterisk (VoIP)', desc: 'Phone calls', color: 'var(--color-phone)' },
              { key: 'twilio', label: 'Twilio (SMS)', desc: 'Text messages', color: 'var(--color-text)' },
              { key: 'linkedin', label: 'LinkedIn', desc: 'Data enrichment', color: '#0077b5' },
              { key: 'mailchimp', label: 'Mailchimp', desc: 'Email marketing', color: '#ffe01b' },
            ].map(({ key, label, desc, color }) => {
              const integration = integrations[key as keyof typeof integrations];
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {label.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {integration.connected ? desc : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`badge ${integration.connected ? 'badge-success' : 'badge-warning'}`}
                  >
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '24px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <Key size={18} />
              Manage API Keys
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'var(--gradient-warning)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Palette size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontWeight: 600 }}>Appearance</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Customize the look and feel
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {['dark', 'light', 'auto'].map(theme => (
            <motion.button
              key={theme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings({ ...settings, theme })}
              style={{
                flex: 1,
                padding: '20px',
                background: settings.theme === theme ? 'var(--gradient-primary)' : 'var(--color-bg-tertiary)',
                border: `2px solid ${settings.theme === theme ? 'transparent' : 'var(--color-border)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                color: settings.theme === theme ? 'white' : 'var(--color-text-secondary)',
                fontWeight: 600,
              }}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
