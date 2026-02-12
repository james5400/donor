import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Sparkles,
  Heart,
  Trophy,
  Star,
} from 'lucide-react';
import { recentDonations, Donation } from '../../data/mockData';

const RollingRealtime: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>(recentDonations);
  const [totalRaised, setTotalRaised] = useState(185000);
  const [donorCount, setDonorCount] = useState(89);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [recentHighlight, setRecentHighlight] = useState<string | null>(null);

  const generateParticle = useCallback(() => {
    const emojis = ['💰', '🎉', '⭐', '💫', '🔥', '❤️', '🚀', '💎'];
    return {
      id: Date.now(),
      x: Math.random() * window.innerWidth - 260,
      y: -50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [...prev.slice(-20), generateParticle()]);
    }, 800);

    return () => clearInterval(interval);
  }, [generateParticle]);

  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev => prev.filter(p => p.y < window.innerHeight));
    }, 100);

    return () => clearInterval(particleInterval);
  }, []);

  useEffect(() => {
    const newDonationInterval = setInterval(() => {
      const randomDonation = {
        id: `don${Date.now()}`,
        donorId: `d${Math.floor(Math.random() * 10)}`,
        donorName: ['Emma Johnson', 'Liam Smith', 'Olivia Williams', 'Noah Brown', 'Ava Davis'][Math.floor(Math.random() * 5)],
        amount: [50, 100, 250, 500, 1000][Math.floor(Math.random() * 5)],
        campaignId: 'c3',
        campaignName: 'Capital Campaign',
        timestamp: new Date().toISOString(),
        state: ['CA', 'NY', 'TX', 'FL', 'WA'][Math.floor(Math.random() * 5)],
      };

      setDonations(prev => [randomDonation, ...prev.slice(0, 9)]);
      setTotalRaised(prev => prev + randomDonation.amount);
      setDonorCount(prev => prev + 1);
      setRecentHighlight(randomDonation.donorName);

      setTimeout(() => setRecentHighlight(null), 2000);
    }, 5000);

    return () => clearInterval(newDonationInterval);
  }, []);

  const stats = {
    totalRaised: totalRaised,
    donors: donorCount,
    avgDonation: Math.round(totalRaised / donorCount),
    goal: 500000,
  };

  const animatedValue = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 48px)',
      }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, opacity: 1 }}
          animate={{ y: window.innerHeight + 50, opacity: 0 }}
          transition={{ duration: 4, ease: 'linear' }}
          style={{
            position: 'fixed',
            fontSize: '24px',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-header">
          <div>
            <motion.h1
              className="page-title"
              animate={{
                textShadow: [
                  '0 0 20px rgba(102, 126, 234, 0.5)',
                  '0 0 40px rgba(102, 126, 234, 0.8)',
                  '0 0 20px rgba(102, 126, 234, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <Zap size={32} style={{ color: 'var(--color-warning)' }} />
              Rolling Realtime
            </motion.h1>
            <p className="page-subtitle">Live donation feed and campaign performance</p>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0, 210, 106, 0.2)',
              borderRadius: '20px',
              color: 'var(--color-success)',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-success)',
                borderRadius: '50%',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            />
            LIVE
          </motion.div>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(102, 126, 234, 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: '100px',
                height: '100px',
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                opacity: 0.1,
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <DollarSign
              size={32}
              style={{
                color: 'var(--color-success)',
                marginBottom: '12px',
              }}
            />
            <motion.div
              className="stat-value"
              key={stats.totalRaised}
              initial={{ scale: 1.2, color: '#00d26a' }}
              animate={{ scale: 1, color: 'white' }}
              transition={{ duration: 0.3 }}
            >
              ${stats.totalRaised.toLocaleString()}
            </motion.div>
            <div className="stat-label">Total Raised Today</div>
            <motion.div
              className="stat-change positive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp size={14} /> +12.5% from yesterday
            </motion.div>
          </motion.div>

          <motion.div
            className="stat-card success"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 242, 254, 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: '100px',
                height: '100px',
                background: 'var(--gradient-success)',
                borderRadius: '50%',
                opacity: 0.1,
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <Users
              size={32}
              style={{
                color: 'var(--color-accent-cyan)',
                marginBottom: '12px',
              }}
            />
            <motion.div
              className="stat-value"
              key={stats.donors}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {stats.donors}
            </motion.div>
            <div className="stat-label">Active Donors</div>
            <motion.div
              className="stat-change positive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp size={14} /> +8 new today
            </motion.div>
          </motion.div>

          <motion.div
            className="stat-card warning"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(240, 147, 251, 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: '100px',
                height: '100px',
                background: 'var(--gradient-secondary)',
                borderRadius: '50%',
                opacity: 0.1,
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            />
            <Heart
              size={32}
              style={{
                color: 'var(--color-accent-tertiary)',
                marginBottom: '12px',
              }}
            />
            <motion.div
              className="stat-value"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ${stats.avgDonation}
            </motion.div>
            <div className="stat-label">Avg Donation</div>
            <motion.div
              className="stat-change positive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp size={14} /> +15% from last week
            </motion.div>
          </motion.div>

          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 193, 7, 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: '100px',
                height: '100px',
                background: 'var(--gradient-warning)',
                borderRadius: '50%',
                opacity: 0.1,
              }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 3.2, repeat: Infinity }}
            />
            <Trophy
              size={32}
              style={{
                color: 'var(--color-warning)',
                marginBottom: '12px',
              }}
            />
            <div className="stat-value">
              {Math.round((stats.totalRaised / stats.goal) * 100)}%
            </div>
            <div className="stat-label">Goal Progress</div>
            <div
              style={{
                marginTop: '12px',
                height: '6px',
                background: 'var(--color-bg-primary)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.totalRaised / stats.goal) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'var(--gradient-warning)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-2" style={{ gap: '24px' }}>
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={24} style={{ color: 'var(--color-warning)' }} />
              <h2 className="card-title">Live Donation Feed</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence mode="popLayout">
                {donations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      backgroundColor:
                        recentHighlight === donation.donorName
                          ? 'rgba(0, 210, 106, 0.2)'
                          : 'var(--color-bg-tertiary)',
                    }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--gradient-success)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      ❤️
                    </motion.div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {donation.donorName}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {donation.campaignName} • {donation.state}
                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: 'var(--color-success)',
                        }}
                      >
                        ${donation.amount.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {new Date(donation.timestamp).toLocaleTimeString()}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <Star size={24} style={{ color: 'var(--color-accent-tertiary)' }} />
              <h2 className="card-title">Top Campaigns</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Capital Campaign', raised: 185000, goal: 500000, color: 'var(--gradient-primary)' },
                { name: 'Annual Gala', raised: 78000, goal: 100000, color: 'var(--gradient-secondary)' },
                { name: 'Spring Drive', raised: 32500, goal: 50000, color: 'var(--gradient-success)' },
                { name: 'Emergency Fund', raised: 12000, goal: 25000, color: 'var(--gradient-warning)' },
              ].map((campaign, index) => {
                const percentage = Math.round((campaign.raised / campaign.goal) * 100);

                return (
                  <motion.div
                    key={campaign.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    style={{
                      padding: '16px',
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{campaign.name}</span>
                      <span style={{ color: 'var(--color-success)' }}>
                        ${campaign.raised.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: 'var(--color-bg-primary)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        style={{
                          height: '100%',
                          background: campaign.color,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <span>{percentage}% funded</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '24px',
                padding: '20px',
                background: 'var(--gradient-primary)',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  opacity: 0.9,
                  marginBottom: '8px',
                }}
              >
                Today's Hero
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                Ethan Miller
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                $5,000 donation to Capital Campaign
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default RollingRealtime;
