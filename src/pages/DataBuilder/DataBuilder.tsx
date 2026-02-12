import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Wand2,
  Users,
  FileSpreadsheet,
  ChevronRight,
  Check,
  Search,
  Linkedin,
  Filter,
  X,
} from 'lucide-react';

type BuilderTab = 'upload' | 'wizard' | 'icp';

const DataBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BuilderTab>('upload');
  const [wizardStep, setWizardStep] = useState(1);
  const [csvData, setCsvData] = useState<{ name: string; size: string } | null>(null);
  const [linkedInQuery, setLinkedInQuery] = useState('');
  const [icpCriteria, setIcpCriteria] = useState([
    { field: 'totalDonations', operator: 'greater', value: 1000 },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvData({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB` });
    }
  };

  const linkedInProfiles = [
    { name: 'Sarah Johnson', title: 'CEO at TechCorp', location: 'San Francisco', match: 95 },
    { name: 'Michael Chen', title: 'VP of Marketing', location: 'New York', match: 88 },
    { name: 'Emily Davis', title: 'Director of Sales', location: 'Chicago', match: 82 },
    { name: 'Robert Wilson', title: 'Founder & CEO', location: 'Boston', match: 79 },
    { name: 'Jessica Brown', title: 'Head of Development', location: 'Seattle', match: 75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Builder</h1>
          <p className="page-subtitle">Build and manage your donor lists</p>
        </div>
      </div>

      <div className="tabs">
        {[
          { key: 'upload', icon: FileSpreadsheet, label: 'Upload CSV' },
          { key: 'wizard', icon: Wand2, label: 'Data Wizard' },
          { key: 'icp', icon: Users, label: 'ICP Builder' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key as BuilderTab)}
          >
            <tab.icon size={16} style={{ marginRight: '8px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="card-header">
              <h2 className="card-title">Upload Donor CSV</h2>
            </div>

            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                background: 'var(--color-bg-tertiary)',
                transition: 'all 0.3s ease',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Upload size={40} color="white" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                  Drop your CSV file here
                </div>
                <div style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  or click to browse
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="btn btn-primary">
                  Select File
                </label>
              </motion.div>
            </div>

            {csvData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(0, 210, 106, 0.1)',
                  border: '1px solid rgba(0, 210, 106, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileSpreadsheet size={24} style={{ color: 'var(--color-success)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{csvData.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {csvData.size} • Ready to import
                    </div>
                  </div>
                </div>
                <button className="btn btn-success">Import Data</button>
              </motion.div>
            )}

            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>CSV Format Guide</h3>
              <div
                style={{
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}
              >
                firstName,lastName,email,phone,state,city,totalDonations,lastDonationDate
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                {[1, 2, 3].map(step => (
                  <React.Fragment key={step}>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: wizardStep >= step ? 1 : 0.8 }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background:
                          wizardStep >= step ? 'var(--gradient-primary)' : 'var(--color-bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        color: wizardStep >= step ? 'white' : 'var(--color-text-muted)',
                      }}
                    >
                      {wizardStep > step ? <Check size={18} /> : step}
                    </motion.div>
                    {step < 3 && (
                      <div
                        style={{
                          flex: 1,
                          height: '2px',
                          background:
                            wizardStep > step ? 'var(--color-success)' : 'var(--color-border)',
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {wizardStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="card-title" style={{ marginBottom: '24px' }}>
                    Search LinkedIn for Potential Donors
                  </h2>

                  <div style={{ marginBottom: '24px' }}>
                    <label className="label">Search Query</label>
                    <div style={{ position: 'relative' }}>
                      <Linkedin
                        size={20}
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--color-text-muted)',
                        }}
                      />
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., CEO at tech company in San Francisco"
                        value={linkedInQuery}
                        onChange={e => setLinkedInQuery(e.target.value)}
                        style={{ paddingLeft: '48px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <select className="input select" style={{ flex: 1 }}>
                      <option>Location: Any</option>
                      <option>United States</option>
                      <option>Europe</option>
                      <option>Asia</option>
                    </select>
                    <select className="input select" style={{ flex: 1 }}>
                      <option>Industry: Any</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Real Estate</option>
                    </select>
                    <select className="input select" style={{ flex: 1 }}>
                      <option>Company Size: Any</option>
                      <option>Startup (1-50)</option>
                      <option>Mid-size (51-500)</option>
                      <option>Enterprise (500+)</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Search size={18} />
                    Search LinkedIn
                  </motion.button>

                  <div style={{ marginTop: '32px' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>
                      Search Results (Sample)
                    </h3>
                    {linkedInProfiles.map((profile, index) => (
                      <motion.div
                        key={profile.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'var(--color-bg-tertiary)',
                          borderRadius: '12px',
                          marginBottom: '8px',
                        }}
                      >
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
                            marginRight: '16px',
                          }}
                        >
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{profile.name}</div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {profile.title} • {profile.location}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(0, 210, 106, 0.2)',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--color-success)',
                          }}
                        >
                          {profile.match}% match
                        </div>
                        <button
                          className="btn btn-sm btn-secondary"
                          style={{ marginLeft: '12px' }}
                        >
                          Add
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {wizardStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="card-title" style={{ marginBottom: '24px' }}>
                    Review & Enrich Data
                  </h2>

                  <div className="grid grid-2" style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        padding: '20px',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '36px', fontWeight: 700 }}>47</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        Profiles Found
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '20px',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '36px', fontWeight: 700 }}>12</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        In Your Network
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    <h4 style={{ marginBottom: '8px' }}>Data Enrichment Available</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      We can enrich 42 profiles with additional data including estimated
                      donation capacity, philanthropic interests, and connection strength.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setWizardStep(1)}
                    >
                      Back
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1 }}>
                      <Wand2 size={18} />
                      Enrich Data
                    </button>
                  </div>
                </motion.div>
              )}

              {wizardStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="card-title" style={{ marginBottom: '24px' }}>
                    Create Donor List
                  </h2>

                  <div className="form-group">
                    <label className="label">List Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Tech CEO Prospects Q1 2025"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Description</label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Describe this donor list..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Tags</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Add tags separated by commas..."
                    />
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(0, 210, 106, 0.1)',
                      border: '1px solid rgba(0, 210, 106, 0.3)',
                      borderRadius: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Check size={20} style={{ color: 'var(--color-success)' }} />
                      <span>
                        <strong>35 donors</strong> ready to be added to your list
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setWizardStep(2)}
                    >
                      Back
                    </button>
                    <button className="btn btn-success" style={{ flex: 1 }}>
                      <Users size={18} />
                      Create List
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'icp' && (
          <motion.div
            key="icp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="card-header">
              <h2 className="card-title">Donor ICP Builder</h2>
              <button className="btn btn-primary btn-sm">
                <Filter size={16} />
                Add Criteria
              </button>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Build your Ideal Customer Profile to find matching donors
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>Active Criteria</h3>
              {icpCriteria.map((criteria, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <select className="input select" style={{ flex: 1 }}>
                    <option value="totalDonations">Total Donations</option>
                    <option value="lastDonationDate">Last Donation Date</option>
                    <option value="state">State</option>
                    <option value="city">City</option>
                    <option value="status">Status</option>
                    <option value="tags">Tags</option>
                  </select>
                  <select className="input select" style={{ width: '140px' }}>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                    <option value="equals">Equals</option>
                    <option value="between">Between</option>
                  </select>
                  <input
                    type="text"
                    className="input"
                    placeholder="Value"
                    style={{ width: '180px' }}
                    defaultValue="$1,000"
                  />
                  <button
                    className="btn btn-icon btn-secondary"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '24px' }}
            >
              <Filter size={18} />
              Add Another Criteria
            </motion.button>

            <div
              style={{
                padding: '24px',
                background: 'var(--gradient-primary)',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>
                127
              </div>
              <div style={{ opacity: 0.9 }}>Donors Match Your ICP</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                Save ICP
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                <Users size={18} />
                View Matches
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DataBuilder;
