import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { RobinhoodContext } from '../context/RobinhoodContext';

const NAV_ITEMS = ['Markets', 'Portfolio', 'Swap', 'Rewards'];

const Header = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const {
    connectWallet,
    signOut,
    isAuthenticated,
    formattedAccount,
  } = useContext(RobinhoodContext);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: 60,
      background: 'rgba(7, 11, 15, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--es-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
        <div style={{
          width: 28,
          height: 28,
          background: 'var(--es-up)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          color: '#020f09',
          letterSpacing: '-0.02em',
          flexShrink: 0,
        }}>E</div>
        <span style={{
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.02em',
          color: 'var(--es-text)',
        }}>EtherSwap</span>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <button key={item} style={{
            background: 'none',
            border: 'none',
            color: 'var(--es-sub)',
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.target.style.color = 'var(--es-text)'; e.target.style.background = 'var(--es-hover)'; }}
          onMouseLeave={e => { e.target.style.color = 'var(--es-sub)'; e.target.style.background = 'none'; }}
          >
            {item}
          </button>
        ))}
      </nav>

      <div style={{
        flex: 1,
        maxWidth: 380,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: searchFocus ? 'var(--es-card)' : 'var(--es-panel)',
          border: `1px solid ${searchFocus ? 'var(--es-muted)' : 'var(--es-border)'}`,
          borderRadius: 8,
          padding: '7px 12px',
          transition: 'all 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="var(--es-muted)" strokeWidth="1.5"/>
            <path d="M12.5 12.5L17 17" stroke="var(--es-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Search coins, markets…"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--es-text)',
              fontSize: 13,
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchVal && (
            <button onClick={() => setSearchVal('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--es-muted)', padding: 0, lineHeight: 1,
            }}>✕</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 140, justifyContent: 'flex-end' }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'var(--es-hover)',
              border: '1px solid var(--es-border)',
              borderRadius: 6,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--es-up)',
                boxShadow: '0 0 6px var(--es-up)',
              }}/>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--es-sub)' }}>
                {formattedAccount}
              </span>
            </div>
            <button className="btn-connect" onClick={() => signOut()} style={{
              borderColor: 'var(--es-border)', color: 'var(--es-sub)',
            }}>
              Sign out
            </button>
          </>
        ) : (
          <button className="btn-connect" onClick={() => connectWallet()}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
