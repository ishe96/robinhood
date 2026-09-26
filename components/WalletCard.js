import React, { useContext } from 'react';
import { RobinhoodContext } from '../context/RobinhoodContext';

const StatBox = ({ label, value, sub, color }) => (
  <div style={{
    flex: 1,
    background: 'var(--es-hover)',
    border: '1px solid var(--es-border)',
    borderRadius: 8,
    padding: '12px 14px',
  }}>
    <div style={{ fontSize: 10, color: 'var(--es-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
      {label}
    </div>
    <div style={{
      fontSize: 16, fontWeight: 700,
      fontFamily: 'JetBrains Mono, monospace',
      color: color || 'var(--es-text)',
      letterSpacing: '-0.02em',
    }}>
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: 'var(--es-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
        {sub}
      </div>
    )}
  </div>
);

const WalletCard = ({ ethPrice, ethChange }) => {
  const {
    balance, isAuthenticated, connectWallet,
    formattedAccount, currentAccount,
  } = useContext(RobinhoodContext);

  const usdValue = (parseFloat(balance || 0) * parseFloat(ethPrice || 0)).toFixed(2);
  const isUp = parseFloat(ethChange || 0) >= 0;

  if (!isAuthenticated) {
    return (
      <div className="es-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--es-hover)',
          margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="14" rx="3" stroke="var(--es-muted)" strokeWidth="1.5"/>
            <path d="M16 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="var(--es-muted)"/>
            <path d="M6 7V5a4 4 0 0 1 8 0v2" stroke="var(--es-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ fontSize: 13, color: 'var(--es-sub)', margin: '0 0 16px', lineHeight: 1.5 }}>
          Connect your wallet to view your balance and start trading.
        </p>
        <button className="btn-connect" style={{ width: '100%' }} onClick={() => connectWallet()}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="es-card" style={{ padding: '18px 16px 16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--es-up)',
            boxShadow: '0 0 6px var(--es-up)',
          }}/>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--es-sub)' }}>
            {formattedAccount}
          </span>
        </div>
        <span style={{
          fontSize: 10, padding: '3px 8px',
          background: 'rgba(18,217,146,0.1)',
          border: '1px solid rgba(18,217,146,0.2)',
          borderRadius: 4,
          color: 'var(--es-up)', fontWeight: 600, letterSpacing: '0.04em',
        }}>
          RINKEBY
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--es-muted)', marginBottom: 4, fontWeight: 500 }}>
          Portfolio value
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--es-text)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 4,
        }}>
          ${parseFloat(usdValue).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ color: isUp ? 'var(--es-up)' : 'var(--es-down)', fontWeight: 600 }}>
            {isUp ? '▲' : '▼'} {Math.abs(parseFloat(ethChange || 0)).toFixed(2)}%
          </span>
          <span style={{ color: 'var(--es-muted)' }}>Past 24H</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <StatBox
          label="ETH Balance"
          value={`${parseFloat(balance || 0).toFixed(4)}`}
          sub="ETH"
          color={parseFloat(balance || 0) < 0.05 ? 'var(--es-down)' : 'var(--es-text)'}
        />
        <StatBox
          label="ETH Price"
          value={`$${parseFloat(ethPrice || 0).toFixed(0)}`}
          sub="per ETH"
        />
      </div>

      {parseFloat(balance || 0) < 0.05 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          marginTop: 12, padding: '8px 12px',
          background: 'rgba(255,69,96,0.07)',
          border: '1px solid rgba(255,69,96,0.15)',
          borderRadius: 6, fontSize: 11, color: 'var(--es-down)',
        }}>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L18 17H2L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 8v3.5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Low balance — top up to keep trading.
        </div>
      )}
    </div>
  );
};

export default WalletCard;
