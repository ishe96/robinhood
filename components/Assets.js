/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from 'react';

const MiniSparkline = ({ data = [], color }) => {
  if (!data.length) return null;
  const vals = data.map(parseFloat).filter(Boolean);
  if (vals.length < 2) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 64, H = 28;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
};

const CoinRank = ({ rank }) => (
  <span style={{
    fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
    color: 'var(--es-muted)', minWidth: 20, textAlign: 'right',
  }}>
    #{rank}
  </span>
);

const Asset = ({ coin, price }) => {
  const change = parseFloat(coin.change);
  const isUp = change >= 0;
  const color = isUp ? 'var(--es-up)' : 'var(--es-down)';

  const fmtPrice = (p) => {
    const n = parseFloat(p);
    if (n >= 1000) return `$${n.toLocaleString('en', { maximumFractionDigits: 0 })}`;
    if (n >= 1)    return `$${n.toFixed(2)}`;
    return `$${n.toPrecision(4)}`;
  };

  const sparkData = useMemo(() => {
    if (coin.sparkline && Array.isArray(coin.sparkline)) return coin.sparkline;
    const fake = [];
    let base = parseFloat(price);
    for (let i = 0; i < 12; i++) {
      base += base * (Math.random() * 0.04 - 0.02);
      fake.push(base);
    }
    return fake;
  }, [coin.sparkline, price]);

  const marketCap = coin.marketCap
    ? `$${(parseFloat(coin.marketCap) / 1e9).toFixed(1)}B`
    : null;

  return (
    <div className="asset-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <CoinRank rank={coin.rank} />
        {coin.iconUrl ? (
          <img
            src={coin.iconUrl}
            alt={coin.symbol}
            width={28} height={28}
            style={{ borderRadius: '50%', flexShrink: 0 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--es-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: 'var(--es-sub)',
            flexShrink: 0,
          }}>
            {coin.symbol?.slice(0, 3)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--es-text)' }}>
            {coin.symbol}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--es-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {coin.name}
          </div>
        </div>
      </div>

      <MiniSparkline data={sparkData} color={color} />

      <div style={{ textAlign: 'right', minWidth: 70 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--es-text)',
        }}>
          {fmtPrice(price)}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
          color,
        }}>
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default Asset;
