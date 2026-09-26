import React, { useContext, useState } from 'react';
import { RobinhoodContext } from '../context/RobinhoodContext';

const COINS = ['ETH', 'BTC', 'DOGE', 'USDC', 'SOL'];

const CoinIcon = ({ symbol }) => {
  const colors = {
    ETH:  '#627EEA', BTC: '#F7931A', DOGE: '#C2A633',
    USDC: '#2775CA', SOL: '#9945FF',
  };
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: colors[symbol] || '#3a4e6e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
      letterSpacing: '-0.03em',
    }}>
      {symbol?.slice(0, 3)}
    </div>
  );
};

const SwapPanel = () => {
  const {
    balance, isAuthenticated, setAmount, mint,
    setCoinSelect, coinSelect, coinSelect: fromCoin,
    amount, toCoin, setToCoin,
  } = useContext(RobinhoodContext);

  const [swapping, setSwapping] = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleSwap = async () => {
    if (!isAuthenticated) return;
    setSwapping(true);
    try {
      await mint();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSwapping(false);
    }
  };

  const lowFunds = parseFloat(balance) < 0.05;

  return (
    <div className="es-card" style={{ padding: '18px 20px 20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 18,
      }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--es-text)' }}>
          Swap Tokens
        </h3>
        {isAuthenticated && (
          <span style={{
            fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
            color: lowFunds ? 'var(--es-down)' : 'var(--es-sub)',
          }}>
            Bal: {parseFloat(balance || 0).toFixed(4)} ETH
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--es-muted)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            From
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 10, zIndex: 1 }}>
              <CoinIcon symbol={fromCoin} />
            </div>
            <select
              className="swap-select"
              style={{ width: '100%', paddingLeft: 42 }}
              value={fromCoin}
              onChange={(e) => setCoinSelect(e.target.value)}
            >
              {COINS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-end',
          paddingBottom: 10,
          color: 'var(--es-muted)',
        }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M14 5H6M6 5L9 2M6 5l3 3M6 15h8M14 15l-3-3M14 15l-3 3"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--es-muted)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            To
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 10, zIndex: 1 }}>
              <CoinIcon symbol={toCoin || 'DOGE'} />
            </div>
            <select
              className="swap-select"
              style={{ width: '100%', paddingLeft: 42 }}
              value={toCoin}
              onChange={(e) => setToCoin(e.target.value)}
            >
              {COINS.filter((c) => c !== fromCoin).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--es-muted)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Amount
        </label>
        <div style={{ position: 'relative' }}>
          <input
            className="swap-input"
            type="number"
            min="0"
            placeholder="0.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={() => setAmount(parseFloat(balance || 0).toFixed(4))}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'var(--es-border)', border: 'none', borderRadius: 4,
              color: 'var(--es-sub)', fontSize: 10, fontWeight: 700,
              padding: '3px 7px', cursor: 'pointer', letterSpacing: '0.04em',
              fontFamily: 'inherit',
            }}
          >
            MAX
          </button>
        </div>
      </div>

      {lowFunds && isAuthenticated && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 12px', marginBottom: 12,
          background: 'rgba(255,69,96,0.08)',
          border: '1px solid rgba(255,69,96,0.2)',
          borderRadius: 6, fontSize: 12, color: 'var(--es-down)',
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L18 17H2L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 8v4M10 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Insufficient funds — top up your wallet.
        </div>
      )}

      {success && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 12px', marginBottom: 12,
          background: 'rgba(18,217,146,0.08)',
          border: '1px solid rgba(18,217,146,0.2)',
          borderRadius: 6, fontSize: 12, color: 'var(--es-up)',
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Transaction submitted successfully!
        </div>
      )}

      <button
        className="btn-primary"
        disabled={!isAuthenticated || !amount || parseFloat(amount) <= 0 || swapping}
        onClick={handleSwap}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {swapping ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28 8"/>
            </svg>
            Processing…
          </>
        ) : (
          isAuthenticated ? `Swap ${fromCoin} → ${toCoin || '?'}` : 'Connect Wallet to Swap'
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default SwapPanel;
