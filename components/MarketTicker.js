import React from 'react';

const TickerItem = ({ coin }) => {
  const price = parseFloat(coin.price);
  const change = parseFloat(coin.change);
  const isUp = change >= 0;

  const fmt = (n) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    if (n >= 1) return `$${n.toFixed(2)}`;
    return `$${n.toPrecision(4)}`;
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 11.5,
      fontFamily: 'JetBrains Mono, monospace',
      flexShrink: 0,
    }}>
      <span style={{ color: 'var(--es-text)', fontWeight: 600, letterSpacing: '0.02em' }}>
        {coin.symbol}
      </span>
      <span style={{ color: 'var(--es-sub)' }}>
        {fmt(price)}
      </span>
      <span style={{
        color: isUp ? 'var(--es-up)' : 'var(--es-down)',
        fontWeight: 600,
      }}>
        {isUp ? '+' : ''}{change.toFixed(2)}%
      </span>
    </span>
  );
};

const Separator = () => (
  <span style={{
    flexShrink: 0,
    width: 1,
    height: 10,
    background: 'var(--es-border)',
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '0 8px',
  }} />
);

const MarketTicker = ({ coins = [] }) => {
  const items = coins.slice(0, 12);
  const doubled = [...items, ...items];

  return (
    <div style={{
      background: 'var(--es-panel)',
      borderBottom: '1px solid var(--es-border)',
      height: 34,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 40,
        zIndex: 2,
        background: 'linear-gradient(to right, var(--es-panel), transparent)',
      }}/>
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 40,
        zIndex: 2,
        background: 'linear-gradient(to left, var(--es-panel), transparent)',
      }}/>

      <div className="ticker-track" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 40px' }}>
        {doubled.map((coin, i) => (
          <React.Fragment key={`${coin.uuid}-${i}`}>
            <TickerItem coin={coin} />
            {i < doubled.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
