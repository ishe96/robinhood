import React, { useState, useRef } from 'react';

const CandlestickChart = ({ data = [], height = 220 }) => {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  if (!data || data.length < 2) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--es-muted)',
        fontSize: 13,
      }}>
        Not enough OHLC data
      </div>
    );
  }

  const PAD_LEFT = 55;
  const PAD_RIGHT = 12;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 28;
  const WIDTH = 700;
  const chartH = height - PAD_TOP - PAD_BOTTOM;
  const chartW = WIDTH - PAD_LEFT - PAD_RIGHT;

  const all = data.flatMap(d => [
    parseFloat(d.high),
    parseFloat(d.low),
  ]).filter(Boolean);
  const maxP = Math.max(...all);
  const minP = Math.min(...all);
  const range = maxP - minP || 1;
  const pad = range * 0.06;
  const hi = maxP + pad;
  const lo = minP - pad;
  const totalRange = hi - lo;

  const toY = (p) => PAD_TOP + chartH - ((parseFloat(p) - lo) / totalRange) * chartH;
  const toX = (i) => PAD_LEFT + (i + 0.5) * (chartW / data.length);
  const candleW = Math.max(3, Math.floor((chartW / data.length) * 0.55));

  const fmtP = (p) => {
    const n = parseFloat(p);
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `$${n.toFixed(2)}`;
  };

  const Y_LABELS = 5;
  const yTicks = Array.from({ length: Y_LABELS + 1 }, (_, i) => {
    const price = lo + (totalRange * i) / Y_LABELS;
    return { y: toY(price), label: fmtP(price) };
  });

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    const idx = Math.floor((mx - PAD_LEFT) / (chartW / data.length));
    if (idx >= 0 && idx < data.length) {
      const d = data[idx];
      const x = toX(idx);
      setTooltip({
        x: rect.left + (x / WIDTH) * rect.width,
        y: e.clientY - rect.top - 60,
        open: fmtP(d.open),
        close: fmtP(d.close),
        high: fmtP(d.high),
        low: fmtP(d.low),
        isUp: parseFloat(d.close) >= parseFloat(d.open),
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${height}`}
        style={{ width: '100%', height, display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_LEFT} y1={t.y}
              x2={WIDTH - PAD_RIGHT} y2={t.y}
              stroke="var(--es-border)" strokeWidth="0.5"
            />
            <text
              x={PAD_LEFT - 6} y={t.y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--es-muted)"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {t.label}
            </text>
          </g>
        ))}

        {data.map((candle, i) => {
          const open  = parseFloat(candle.open  || candle.avg);
          const close = parseFloat(candle.close || candle.avg);
          const high  = parseFloat(candle.high);
          const low   = parseFloat(candle.low);
          const isUp  = close >= open;
          const color = isUp ? 'var(--es-up)' : 'var(--es-down)';
          const cx = toX(i);
          const bodyTop    = toY(Math.max(open, close));
          const bodyBottom = toY(Math.min(open, close));
          const bodyH = Math.max(1.5, bodyBottom - bodyTop);
          const wickTop    = toY(high);
          const wickBottom = toY(low);

          return (
            <g key={i}>
              <line
                x1={cx} y1={wickTop}
                x2={cx} y2={wickBottom}
                stroke={color}
                strokeWidth="1"
                opacity="0.7"
              />
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={isUp ? color : 'none'}
                stroke={color}
                strokeWidth="1"
                rx="1"
                fillOpacity={isUp ? 0.9 : 1}
              />
            </g>
          );
        })}

        <line
          x1={PAD_LEFT} y1={PAD_TOP + chartH}
          x2={WIDTH - PAD_RIGHT} y2={PAD_TOP + chartH}
          stroke="var(--es-border)" strokeWidth="0.5"
        />

        {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((d, i, arr) => {
          const origIdx = i * Math.max(1, Math.floor(data.length / 6));
          const cx = toX(origIdx);
          const label = d.time
            ? new Date(d.time * 1000).toLocaleDateString('en', { month: 'short', day: 'numeric' })
            : `Day ${origIdx + 1}`;
          return (
            <text
              key={i}
              x={cx}
              y={height - 6}
              textAnchor="middle"
              fill="var(--es-muted)"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {tooltip && (
        <div style={{
          position: 'absolute',
          top: Math.max(4, tooltip.y),
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--es-panel)',
          border: '1px solid var(--es-border)',
          borderRadius: 6,
          padding: '7px 12px',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          pointerEvents: 'none',
          zIndex: 10,
          color: 'var(--es-text)',
          whiteSpace: 'nowrap',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3px 16px',
        }}>
          <span style={{ color: 'var(--es-sub)' }}>O</span>
          <span style={{ color: tooltip.isUp ? 'var(--es-up)' : 'var(--es-down)' }}>{tooltip.open}</span>
          <span style={{ color: 'var(--es-sub)' }}>C</span>
          <span style={{ color: tooltip.isUp ? 'var(--es-up)' : 'var(--es-down)' }}>{tooltip.close}</span>
          <span style={{ color: 'var(--es-sub)' }}>H</span>
          <span style={{ color: 'var(--es-up)' }}>{tooltip.high}</span>
          <span style={{ color: 'var(--es-sub)' }}>L</span>
          <span style={{ color: 'var(--es-down)' }}>{tooltip.low}</span>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
