import React, { useContext, useState } from 'react';
import { StateContext } from '../context/StateContext';
import { Sparkles, Building2, Tractor, ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';

export default function LoginPortal({ onLoginSuccess }) {
  const { 
    schools, 
    collectors, 
    buyers,
    adminCredentials,
    setAuthenticatedRole,
    setCurrentRole, 
    setSelectedSchoolId, 
    setSelectedCollectorId,
    setSelectedBuyerId,
    addToast
  } = useContext(StateContext);

  const [activeRole, setActiveRole] = useState('school'); // 'school' | 'collector' | 'admin'
  const [username, setUsername] = useState('1');
  const [password, setPassword] = useState('12345');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('1');
      setPassword('12345');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const inputCode = username.trim().toLowerCase();
    const pwd = password.trim();

    if (!inputCode) {
      setErrorMsg('Please enter your Username / ID.');
      return;
    }

    if (activeRole === 'school') {
      const allSchs = (schools && schools.length > 0) ? schools : [
        { id: 'sch-1', name: 'Grand Palace Hotel & Buffet', entryCode: '1', password: '12345' },
        { id: 'sch-2', name: 'Royal Treat Bakery & Cafe', entryCode: '2', password: '12345' },
        { id: 'sch-3', name: 'GreenLeaf Supermarket', entryCode: '3', password: '12345' }
      ];
      const found = allSchs.find(s => {
        const sCode = String(s.entryCode || s.entry_code || '').toLowerCase().trim();
        const sId = String(s.id || '').toLowerCase().trim();
        const sName = String(s.name || '').toLowerCase().trim();
        return (sCode !== '' && sCode === inputCode) || sId === inputCode || sName.includes(inputCode);
      }) || allSchs[0];

      setAuthenticatedRole('school');
      setCurrentRole('school');
      setSelectedSchoolId(found.id);
      onLoginSuccess('school');
      addToast(`Welcome back, ${found.name}!`, 'success');
    } else if (activeRole === 'collector') {
      const allCols = (collectors && collectors.length > 0) ? collectors : [
        { id: 'col-1', name: 'Kavin Kumar (Organic Pig Farm)', entryCode: '1', password: '12345' },
        { id: 'col-2', name: 'Deepak Raj (Coimbatore BioCompost)', entryCode: '2', password: '12345' }
      ];
      const found = allCols.find(c => {
        const cCode = String(c.entryCode || c.entry_code || '').toLowerCase().trim();
        const cId = String(c.id || '').toLowerCase().trim();
        const cName = String(c.name || '').toLowerCase().trim();
        return (cCode !== '' && cCode === inputCode) || cId === inputCode || cName.includes(inputCode);
      }) || allCols[0];

      setAuthenticatedRole('collector');
      setCurrentRole('collector');
      setSelectedCollectorId(found.id);
      onLoginSuccess('collector');
      addToast(`Welcome back, ${found.name}!`, 'success');
    } else if (activeRole === 'admin') {
      setAuthenticatedRole('admin');
      setCurrentRole('admin');
      onLoginSuccess('admin');
      addToast('Logged in as Administrator', 'success');
    }
  };

  const handleDevSellerLogin = () => {
    const targetSchool = (schools && schools.length > 0) ? schools[0].id : 'sch-1';
    setAuthenticatedRole('school');
    setCurrentRole('school');
    setSelectedSchoolId(targetSchool);
    onLoginSuccess('school');
    addToast('Logged in as Seller (Hotel & Restaurant)', 'success');
  };

  const handleDevBuyerLogin = () => {
    const targetCol = (collectors && collectors.length > 0) ? collectors[0].id : 'col-1';
    setAuthenticatedRole('collector');
    setCurrentRole('collector');
    setSelectedCollectorId(targetCol);
    onLoginSuccess('collector');
    addToast('Logged in as Buyer / Collector (Farmer)', 'success');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Brand Header */}
        <div style={styles.headerSection}>
          <div style={styles.logoBadge}>
            <Sparkles size={36} color="var(--color-primary)" />
          </div>
          <h1 style={styles.brandTitle}>IDEX</h1>
          <p style={styles.tagline}>Surplus Food & Organic Waste Exchange</p>
        </div>

        {/* ⚡ Quick 1-Click Test Access */}
        <div style={styles.devCard}>
          <div style={styles.devHeader}>
            <span>⚡ 1-CLICK INSTANT DEMO LOGIN</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              type="button"
              onClick={handleDevSellerLogin}
              style={styles.devSellerBtn}
            >
              <Building2 size={16} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>⚡ Dev Seller</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>Hotel & Restaurant</div>
              </div>
            </button>

            <button 
              type="button"
              onClick={handleDevBuyerLogin}
              style={styles.devBuyerBtn}
            >
              <Tractor size={16} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>⚡ Dev Buyer</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>Farmer & Radar</div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Login Card */}
        <div className="card" style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Sign In</h2>
          <p style={styles.loginSubtitle}>Select your account type and sign in</p>

          {/* Role Pill Switcher */}
          <div style={styles.roleTabs}>
            <button
              type="button"
              onClick={() => handleRoleChange('school')}
              style={{
                ...styles.roleTab,
                backgroundColor: activeRole === 'school' ? 'var(--color-primary)' : 'transparent',
                color: activeRole === 'school' ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: activeRole === 'school' ? 700 : 500
              }}
            >
              <Building2 size={14} />
              <span>Seller</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('collector')}
              style={{
                ...styles.roleTab,
                backgroundColor: activeRole === 'collector' ? 'var(--color-primary)' : 'transparent',
                color: activeRole === 'collector' ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: activeRole === 'collector' ? 700 : 500
              }}
            >
              <Tractor size={14} />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              style={{
                ...styles.roleTab,
                backgroundColor: activeRole === 'admin' ? 'var(--color-primary)' : 'transparent',
                color: activeRole === 'admin' ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: activeRole === 'admin' ? 700 : 500
              }}
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            {errorMsg && (
              <div style={styles.errorBanner}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={styles.fieldLabel}>
                <User size={13} style={{ marginRight: '4px' }} />
                {activeRole === 'school' ? 'Seller Account ID' : activeRole === 'collector' ? 'Buyer / Farmer ID' : 'Admin ID'}
              </label>
              <input 
                type="text" 
                placeholder={activeRole === 'admin' ? 'admin' : 'e.g. 1 or 2'} 
                className="form-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.inputField}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label" style={styles.fieldLabel}>
                <Lock size={13} style={{ marginRight: '4px' }} />
                Password
              </label>
              <input 
                type="password" 
                placeholder="••••••" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.inputField}
              />
            </div>

            <button type="submit" className="btn-primary" style={styles.submitBtn}>
              Sign In to IDEX
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <div style={styles.demoNote}>
            💡 Default demo password is <strong>12345</strong>.
          </div>
        </div>

        {/* Server IP Config */}
        <div style={styles.configSection}>
          <button
            onClick={() => {
              const currentVal = localStorage.getItem('idex_custom_api_url') || '';
              const val = prompt('Enter your Custom Cloud Sync Server URL (e.g. http://192.168.1.12:5001 or live domain):', currentVal);
              if (val !== null) {
                if (val.trim() === '') {
                  localStorage.removeItem('idex_custom_api_url');
                  alert('Resetting to default host.');
                } else {
                  localStorage.setItem('idex_custom_api_url', val.trim());
                  alert('Server Sync URL successfully updated! Reloading app...');
                }
                window.location.reload();
              }
            }}
            style={styles.configBtn}
          >
            ⚙️ Configure Server Host IP
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px 16px',
    backgroundColor: 'var(--color-background)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '380px'
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px'
  },
  logoBadge: {
    backgroundColor: '#E8F5E9',
    padding: '14px',
    borderRadius: '20px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(46, 125, 50, 0.12)'
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.2rem',
    fontWeight: 800,
    color: 'var(--color-primary)',
    lineHeight: '1',
    letterSpacing: '-0.03em',
    margin: 0
  },
  tagline: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
    marginTop: '4px',
    textAlign: 'center'
  },
  devCard: {
    width: '100%',
    background: '#FFFFFF',
    border: '1.5px solid #F9A825',
    borderRadius: '14px',
    padding: '10px 12px',
    marginBottom: '14px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
  },
  devHeader: {
    fontSize: '0.68rem',
    fontWeight: 800,
    color: '#B78103',
    letterSpacing: '0.04em',
    marginBottom: '8px'
  },
  devSellerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    borderRadius: '10px',
    background: '#EAF1FF',
    border: '1.5px solid #90B6F8',
    color: '#1A365D',
    cursor: 'pointer',
    textAlign: 'left'
  },
  devBuyerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    borderRadius: '10px',
    background: '#E8F5E9',
    border: '1.5px solid #81C784',
    color: '#1B5E20',
    cursor: 'pointer',
    textAlign: 'left'
  },
  loginCard: {
    width: '100%',
    padding: '20px',
    borderRadius: '16px',
    border: '1.5px solid var(--color-border)',
    boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
    backgroundColor: '#FFFFFF'
  },
  loginTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: '0 0 2px 0'
  },
  loginSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    margin: '0 0 14px 0'
  },
  roleTabs: {
    display: 'flex',
    backgroundColor: 'var(--color-background)',
    borderRadius: '10px',
    padding: '3px',
    marginBottom: '16px',
    border: '1px solid var(--color-border)'
  },
  roleTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    padding: '7px 4px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.74rem',
    cursor: 'pointer',
    transition: 'all 150ms ease'
  },
  fieldLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.74rem',
    fontWeight: 600,
    marginBottom: '4px'
  },
  inputField: {
    minHeight: '40px',
    fontSize: '0.85rem'
  },
  submitBtn: {
    width: '100%',
    minHeight: '42px',
    fontSize: '0.85rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  demoNote: {
    fontSize: '0.68rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    marginTop: '12px',
    lineHeight: '1.3'
  },
  errorBanner: {
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    border: '1px solid var(--color-error)',
    color: 'var(--color-error)',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '0.72rem',
    marginBottom: '12px'
  },
  configSection: {
    marginTop: '16px',
    textAlign: 'center'
  },
  configBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontSize: '0.7rem',
    textDecoration: 'underline',
    cursor: 'pointer',
    opacity: 0.85
  }
};
