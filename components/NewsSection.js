/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

const timeAgo = (timestamp) => {
  const s = Math.floor((Date.now() / 1000) - timestamp);
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const SkeletonCard = () => (
  <div className="es-card" style={{ padding: 14, display: 'flex', gap: 12 }}>
    <div className="shimmer" style={{ width: 68, height: 68, borderRadius: 8, flexShrink: 0 }}/>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="shimmer" style={{ height: 12, width: '85%', borderRadius: 4 }}/>
      <div className="shimmer" style={{ height: 12, width: '65%', borderRadius: 4 }}/>
      <div className="shimmer" style={{ height: 10, width: '40%', borderRadius: 4 }}/>
    </div>
  </div>
);

const NewsCard = ({ article }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card"
      style={{ display: 'flex', gap: 0, overflow: 'hidden' }}
    >
      {!imgErr && article.imageurl && (
        <img
          src={article.imageurl}
          alt=""
          onError={() => setImgErr(true)}
          style={{
            width: 80, height: 80,
            objectFit: 'cover',
            flexShrink: 0,
            display: 'block',
          }}
        />
      )}
      <div style={{ padding: '10px 14px', flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 6px',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--es-text)',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            color: 'var(--es-blue)', textTransform: 'uppercase',
          }}>
            {article.source_info?.name || article.source || 'Crypto News'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--es-muted)' }}>
            {timeAgo(article.published_on)}
          </span>
          {article.categories && (
            <span style={{
              fontSize: 9, padding: '2px 6px',
              background: 'var(--es-hover)', borderRadius: 4,
              color: 'var(--es-muted)', letterSpacing: '0.04em',
            }}>
              {article.categories.split('|')[0].trim()}
            </span>
          )}
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px 0 4px',
        color: 'var(--es-muted)',
      }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M7 3h10v10M17 3L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </a>
  );
};

const NewsSection = () => {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular&limit=6',
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.Data) {
          setNews(d.Data.slice(0, 6));
        } else {
          setError('Failed to load news');
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Could not load news');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <h2 style={{
          margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--es-text)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--es-blue)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--es-blue)',
          }}/>
          Latest News
        </h2>
        <span style={{ fontSize: 11, color: 'var(--es-muted)' }}>via CryptoCompare</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        {error && (
          <div style={{
            padding: 20, textAlign: 'center',
            color: 'var(--es-muted)', fontSize: 13,
          }}>
            {error} — check your connection.
          </div>
        )}
        {!loading && !error && news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
