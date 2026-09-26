import { useState, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import MarketTicker from '../components/MarketTicker';
import ChartPanel from '../components/ChartPanel';
import SwapPanel from '../components/SwapPanel';
import NewsSection from '../components/NewsSection';
import Asset from '../components/Assets';
import WalletCard from '../components/WalletCard';
import { RobinhoodContext } from '../context/RobinhoodContext';

export default function Home({
  coins,
  ethChange,
  ethPrice,
  ethHist,
  coinHistoryTime,
  priceHigh,
  priceLow,
  priceAvg,
  ohlcData,
}) {
  const [assetSearch, setAssetSearch] = useState('');
  const { balance } = useContext(RobinhoodContext);

  const filteredCoins = (coins || [])
    .slice(0, 20)
    .filter((c) =>
      !assetSearch ||
      c.symbol.toLowerCase().includes(assetSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(assetSearch.toLowerCase())
    );

  return (
    <div style={{ background: 'var(--es-bg)', minHeight: '100vh' }}>
      <Header />

      <div style={{ paddingTop: 60 }}>
        <MarketTicker coins={coins || []} />
      </div>

      <main style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '24px 24px 64px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 20,
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <PortfolioHeader
            balance={balance}
            ethPrice={ethPrice}
            ethChange={ethChange}
          />

          <ChartPanel
            coinHistory={coinHistoryTime}
            coinChange={ethChange}
            ethPrice={ethPrice}
            priceHigh={priceHigh}
            priceLow={priceLow}
            priceAvg={priceAvg}
            ohlcData={ohlcData}
          />

          <SwapPanel />

          <NewsSection />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 94 }}>
          <WalletCard ethPrice={ethPrice} ethChange={ethChange} />

          <div className="es-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '14px 16px 10px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid var(--es-border)',
            }}>
              <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--es-text)' }}>
                Markets
              </h2>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none"
                  style={{ position: 'absolute', left: 7, color: 'var(--es-muted)' }}>
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Filter…"
                  style={{
                    background: 'var(--es-hover)',
                    border: '1px solid var(--es-border)',
                    borderRadius: 6,
                    padding: '5px 8px 5px 24px',
                    color: 'var(--es-text)',
                    fontSize: 11,
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: 110,
                  }}
                />
              </div>
            </div>

            <div style={{
              maxHeight: 500,
              overflowY: 'auto',
            }}
              className="noscroll"
            >
              {filteredCoins.length === 0 ? (
                <div style={{
                  padding: 24, textAlign: 'center',
                  color: 'var(--es-muted)', fontSize: 13,
                }}>
                  No results for "{assetSearch}"
                </div>
              ) : (
                filteredCoins.map((coin) => (
                  <Asset
                    key={coin.uuid}
                    coin={coin}
                    price={parseFloat(coin.price).toFixed(
                      parseFloat(coin.price) < 1 ? 6 : 2
                    )}
                  />
                ))
              )}
            </div>

            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--es-border)',
              fontSize: 11, color: 'var(--es-muted)', textAlign: 'center',
            }}>
              Powered by CoinRanking · Updated 24H
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PortfolioHeader({ balance, ethPrice, ethChange }) {
  const usd = (parseFloat(balance || 0) * parseFloat(ethPrice || 0));
  const isUp = parseFloat(ethChange || 0) >= 0;

  return (
    <div style={{ paddingBottom: 4 }}>
      <div style={{
        fontSize: 11, color: 'var(--es-muted)', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
      }}>
        Your portfolio · ETH
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div style={{
          fontSize: 36, fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--es-text)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}>
          {parseFloat(balance || 0).toFixed(4)}
          <span style={{ fontSize: 16, marginLeft: 6, color: 'var(--es-sub)', fontWeight: 500 }}>ETH</span>
        </div>
        <div style={{ paddingBottom: 4 }}>
          <div style={{
            fontSize: 18, fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--es-sub)',
          }}>
            ${usd.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginTop: 2,
          }}>
            <span style={{
              color: isUp ? 'var(--es-up)' : 'var(--es-down)',
              fontWeight: 700,
            }}>
              {isUp ? '▲' : '▼'} {Math.abs(parseFloat(ethChange || 0)).toFixed(2)}%
            </span>
            <span style={{ color: 'var(--es-muted)' }}>past 24H</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const options = {
    method: 'GET',
    url: 'https://coinranking1.p.rapidapi.com/coins',
    params: {
      referenceCurrencyUuid: 'yhjMzLPhuIDl',
      timePeriod: '24h',
      tiers: '1',
      orderBy: 'marketCap',
      orderDirection: 'desc',
      limit: '50',
      offset: '0',
    },
    headers: {
      'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.COIN_RANKING_KEY || '0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e',
    },
  };

  const ethOptions = {
    method: 'GET',
    url: 'https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ',
    params: { referenceCurrencyUuid: 'yhjMzLPhuIDl', timePeriod: '24h' },
    headers: {
      'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.COIN_RANKING_KEY || '0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e',
    },
  };

  const ohlcOptions = {
    method: 'GET',
    url: 'https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ/ohlc',
    params: { referenceCurrencyUuid: 'yhjMzLPhuIDl', interval: 'day' },
    headers: {
      'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.COIN_RANKING_KEY || '0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e',
    },
  };

  try {
    const [coinsRes, ethRes, ohlcRes] = await Promise.all([
      axios.request(options),
      axios.request(ethOptions),
      axios.request(ohlcOptions),
    ]);

    const coins        = coinsRes.data.data.coins;
    const ethCoin      = ethRes.data.data.coin;
    const ethChange    = JSON.parse(ethCoin.change);
    const ethPrice     = JSON.parse(ethCoin.price);
    const ethHist      = JSON.stringify(ethCoin.sparkline || []);
    const coinHistoryTime = ethCoin.sparkline || [];

    const rawOhlc  = ohlcRes.data.data.ohlc || [];
    const ohlcData = rawOhlc.slice(0, 30);

    const priceHigh = rawOhlc[0]?.high  || null;
    const priceLow  = rawOhlc[0]?.low   || null;
    const priceAvg  = rawOhlc[0]?.avg   || null;

    return {
      props: {
        coins,
        ethChange,
        ethPrice,
        ethHist,
        coinHistoryTime,
        priceHigh,
        priceLow,
        priceAvg,
        ohlcData,
      },
    };
  } catch (err) {
    console.error('getStaticProps error:', err.message);
    return {
      props: {
        coins: [],
        ethChange: 0,
        ethPrice: 0,
        ethHist: '[]',
        coinHistoryTime: [],
        priceHigh: null,
        priceLow: null,
        priceAvg: null,
        ohlcData: [],
      },
    };
  }
};
