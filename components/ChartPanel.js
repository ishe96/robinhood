import React, { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CandlestickChart from './CandlestickChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const CHART_TYPES = ['Line', 'Area', 'OHLC'];
const PERIODS = ['1H', '6H', '24H', '7D'];

const HourLabels = ['1H','2H','3H','4H','5H','6H','7H','8H','9H','10H','11H','12H',
  '13H','14H','15H','16H','17H','18H','19H','20H','21H','22H','23H','24H'];

const ChartPanel = ({
  coinHistory = [],
  coinChange = 0,
  ethPrice,
  priceHigh,
  priceLow,
  priceAvg,
  ohlcData = [],
}) => {
  const [chartType, setChartType] = useState('Line');
  const [period, setPeriod]     = useState('24H');
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  const isUp = parseFloat(coinChange) >= 0;
  const lineColor = isUp ? '#12d992' : '#ff4560';

  const sliceHistory = () => {
    const h = [...coinHistory].filter(Boolean);
    if (period === '1H')  return h.slice(-1);
    if (period === '6H')  return h.slice(-6);
    if (period === '7D')  return h;
    return h;
  };

  const histSlice = sliceHistory();
  const labels = HourLabels.slice(0, Math.max(histSlice.length, 1));

  useEffect(() => {
    if (chartRef.current && (chartType === 'Area')) {
      const chart = chartRef.current;
      if (!chart.chartArea) return;
      const ctx = chart.ctx;
      const { top, bottom } = chart.chartArea;
      const g = ctx.createLinearGradient(0, top, 0, bottom);
      g.addColorStop(0, isUp ? 'rgba(18,217,146,0.28)' : 'rgba(255,69,96,0.28)');
      g.addColorStop(1, isUp ? 'rgba(18,217,146,0.01)' : 'rgba(255,69,96,0.01)');
      setGradient(g);
    }
  }, [chartType, isUp]);

  const data = {
    labels,
    datasets: [{
      data: histSlice,
      fill: chartType === 'Area',
      backgroundColor: chartType === 'Area'
        ? (gradient || (isUp ? 'rgba(18,217,146,0.15)' : 'rgba(255,69,96,0.15)'))
        : 'transparent',
      borderColor: lineColor,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: lineColor,
      pointHoverBorderColor: '#070b0f',
      pointHoverBorderWidth: 2,
      tension: 0.35,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#131f2e',
        borderColor: '#1a2840',
        borderWidth: 1,
        titleColor: '#8090b0',
        bodyColor: '#e8f0fe',
        padding: 10,
        callbacks: {
          label: (ctx) => ` $${parseFloat(ctx.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(26,40,64,0.6)', drawBorder: false },
        ticks: {
          color: '#3a4e6e',
          font: { family: 'JetBrains Mono', size: 9 },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(26,40,64,0.6)', drawBorder: false },
        ticks: {
          color: '#3a4e6e',
          font: { family: 'JetBrains Mono', size: 9 },
          callback: (v) => {
            if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
            return `$${v.toFixed(0)}`;
          },
        },
        border: { display: false },
        position: 'right',
      },
    },
  };

  const fmtStat = (v) => {
    const n = parseFloat(v);
    if (!n) return '–';
    if (n >= 1000) return `$${(n / 1000).toFixed(2)}k`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="es-card" style={{ padding: '0 0 4px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px 0',
        borderBottom: '1px solid var(--es-border)',
        marginBottom: 0,
      }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {CHART_TYPES.map((t) => (
            <button
              key={t}
              className={`chart-type-btn${chartType === t ? ' active' : ''}`}
              onClick={() => setChartType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, paddingBottom: 10 }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              className={`period-btn${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 12px 8px', height: 220 }}>
        {chartType === 'OHLC' ? (
          <CandlestickChart data={ohlcData} height={220} />
        ) : (
          <Line ref={chartRef} data={data} options={options} />
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        padding: '8px 16px 14px',
        flexWrap: 'wrap',
      }}>
        <div className="stat-pill">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 8L4 3L6 6L8 2" stroke="var(--es-up)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{ color: 'var(--es-muted)', fontSize: 11 }}>High</span>
          <span style={{ color: 'var(--es-up)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {fmtStat(priceHigh)}
          </span>
        </div>
        <div className="stat-pill">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 2L4 7L6 4L8 8" stroke="var(--es-down)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{ color: 'var(--es-muted)', fontSize: 11 }}>Low</span>
          <span style={{ color: 'var(--es-down)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {fmtStat(priceLow)}
          </span>
        </div>
        <div className="stat-pill">
          <span style={{ color: 'var(--es-muted)', fontSize: 11 }}>Avg</span>
          <span style={{ color: 'var(--es-sub)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {fmtStat(priceAvg)}
          </span>
        </div>
        <div className="stat-pill" style={{ marginLeft: 'auto' }}>
          <span style={{ color: 'var(--es-muted)', fontSize: 11 }}>Current</span>
          <span style={{
            color: isUp ? 'var(--es-up)' : 'var(--es-down)',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
          }}>
            {fmtStat(ethPrice)}
          </span>
          <span style={{
            fontSize: 10,
            color: isUp ? 'var(--es-up)' : 'var(--es-down)',
            fontWeight: 600,
          }}>
            {isUp ? '+' : ''}{parseFloat(coinChange).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
