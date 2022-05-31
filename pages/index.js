// import styles from '../styles/Home.module.css'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { IoWarning } from "react-icons/io5"
import Header from "../components/Header";
import PortfolioChart from "../components/PortfolioChart";
import BuyTokens from "../components/BuyTokens";
import Asset from "../components/Assets";
import Notice from "../components/Notice";
import axios from "axios";

import { useState, useContext } from "react";
import { RobinhoodContext } from "../context/RobinhoodContext";
import LineChart from "../components/LineChart";

const styles = {
    wrapper: "w-screen h-screen flex flex-col",
    mainContainer: "w-2/3 h-full m-auto flex mt-16",
    leftMain: "flex flex-col w-3/4 h-full p-6 overflow-y-scroll",
    portfolioAmountContainer: "flex flex-col",
    accountAmounts: "flex flex-row justify-between",
    portfolioAmount: "flex text-gray-400 text-4xl",
    warnFunds: "flex text-yellow-500 text-sm font-700 items-end",
    dangerFunds: "flex text-orange-600 text-sm font-500 items-center items-end",
    usdAmount: "flex flex-col text-white text-sm font-semibold items-end",
    portfolioPercent: "flex ml-2 text-gray-400 font-bold text-sm",
    pastPercent: "flex items-center mr-2",
    pastHour: "text-gray-400",
    chartContainer:
        "text-5xl flex justify-center w-full h-1/3 text-white mt-11 mb-11",
    buyingPowerContainer:
        "w-full border-t mb-24 border-b h-16 border-[#30363b] flex justify-between items-center p-4",
    buyingPowerTitle: "text-gray-400 font-bolder text-lg",
    buyingPowerAmount: "text-gray-400 font-bolder text=xl",
    notice: "flex border border-[#30363b] mx-11 my-4 p-5 flex-col flex-1",
    noticeContainer: "flex-1",
    noticeTitle: "text-gray-500",
    noticeMessage: "text-gray-400 font-bold",
    noticeCTA: "font-bold text-green-500 cursor-pointer mt-5",
    rightMain:
        "flex flex-col flex-1 h-4/5 bg-[#1e2123] mt-6 rounded-lg overflow-y-scroll noscroll",
    rightMainItem: "flex items-center text-white p-5 border-b border-[#30363b]",
    ItemTitle: "flex font-bold",
    moreOptions: "cursor-pointer text-xl",
};

export default function Home({
    coins,
    ethChange,
    ethName,
    ethSymbol,
    ethPrice,
    ethHist,
    coinHistory,
    coinHistoryTime,
    priceHigh,
    priceLow,
    priceAvg,
}) {
    console.log(priceHigh);

    const [myCoins] = useState([...coins.slice(0, 15)]);
    const { balance, currentAccount } = useContext(RobinhoodContext);

    // console.log(currentAccount);

    let usdAcc = balance * ethPrice;

    const ethLevel = () => {
        if (balance > 0.05) {
            return (
                <>
                    <div className={styles.portfolioAmount}>
                        <GoTriangleUp style={{ color: "#00ff1a" }} />
                        {balance} ETH
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={styles.portfolioAmount}>
                        <GoTriangleDown style={{ color: "red" }} />
                        {balance} ETH
                    </div>
                </>
            );
        }
    };

    const fundsLevel = () => {
        if (balance < 0.05) {
            return (
                <>
                    <div className={styles.dangerFunds}>
                        <IoWarning style={{ color: "red" }} />
                        Top up funds.
                    </div>
                </>
            );
        }

        if(balance === 0.05) {
            return (
                <>
                    <div className={styles.warnFunds}>
                        <IoWarning style={{ color: "orange" }} />
                        Get ready to top up.
                    </div>
                </>
            );
        }
    };

    const ethChangeLevel = () => {
        if (ethChange > 0) {
            return (
                <div
                    className={styles.pastPercent}
                    style={{ color: "#00ff1a" }}
                >
                    <span>
                        <GoTriangleUp style={{ fontSize: 20 }} />
                    </span>
                    <span>{ethChange}%</span>
                </div>
            );
        } else {
            return (
                <div className={styles.pastPercent} style={{ color: "red" }}>
                    <span>
                        <GoTriangleDown style={{ fontSize: 20 }} />
                    </span>
                    <span> {ethChange}% </span>;
                </div>
            );
        }
    };

    return (
        <div className={styles.wrapper}>
            <Header />

            <div className={styles.mainContainer}>
                <div className={styles.leftMain}>
                    <div className={styles.portfolioAmountContainer}>
                        <div className={styles.accountAmounts}>
                            {ethLevel()}
                            <div className={styles.usdAmount}>
                                {fundsLevel()}
                                USD : ${parseFloat(usdAcc).toFixed(2)}
                            </div>
                        </div>
                        <div className={styles.portfolioPercent}>
                            {ethChangeLevel()}
                            <span className={styles.pastHour}> Past Hour</span>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        {/* <PortfolioChart /> */}

                        <LineChart
                            key={ethName}
                            coinChange={ethChange}
                            price={ethPrice}
                            coinHistory={coinHistoryTime}
                            priceHigh={priceHigh}
                            priceLow={priceLow}
                            priceAvg={priceAvg}
                        />
                    </div>

                    <div className={styles.buyingPowerContainer}>
                        <div className={styles.buyingPowerTitle}>
                            Buying Power
                        </div>
                        <div className={styles.buyingPowerAmount}>
                            {balance} ETH
                        </div>
                    </div>

                    <div className={styles.notice}>
                        <div className={styles.noticeContainer}>
                            <div className={styles.noticeTitle}>Send Funds</div>
                            <div className={styles.noticeMessage}>
                                Transaction transfer
                            </div>
                            <BuyTokens />
                        </div>
                    </div>
                    <Notice />
                </div>

                {/* </div> */}

                <div className={styles.rightMain}>
                    <div className={styles.rightMainItem}>
                        <div className={styles.ItemTitle}>
                            Crypto Currencies
                        </div>

                        <BiDotsHorizontalRounded
                            className={styles.moreOptions}
                        />
                    </div>

                    {myCoins.map((coin) => {
                        let price = parseFloat(coin.price);
                        price = price.toFixed(2);

                        return (
                            <Asset key={coin.uuid} coin={coin} price={price} />
                        );
                    })}

                    <div className={styles.rightMainItem}>
                        <div className={styles.ItemTitle}>Lists</div>
                        <AiOutlinePlus className={styles.moreOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    const axios = require("axios");

    const options = {
        method: "GET",
        url: "https://coinranking1.p.rapidapi.com/coins",
        params: {
            referenceCurrencyUuid: "yhjMzLPhuIDl",
            timePeriod: "24h",
            tiers: "1",
            orderBy: "marketCap",
            orderDirection: "desc",
            limit: "50",
            offset: "0",
        },
        headers: {
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
            "X-RapidAPI-Key":
                "0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e",
        },
    };

    const ethOptions = {
        method: "GET",
        url: "https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ",
        params: { referenceCurrencyUuid: "yhjMzLPhuIDl", timePeriod: "24h" },
        headers: {
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
            "X-RapidAPI-Key":
                "0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e",
        },
    };

    const chartOptions = {
        method: "GET",
        url: "https://coinranking1.p.rapidapi.com/coins/?uuid[]=razxDUgYGNAdQ",
        params: {
            referenceCurrencyUuid: "yhjMzLPhuIDl",
            timePeriod: "24h",
            tiers: "1",
            orderBy: "marketCap",
            orderDirection: "desc",
            limit: "1",
            offset: "0",
        },
        headers: {
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
            "X-RapidAPI-Key":
                "0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e",
        },
    };

    const ohlcOptions = {
        method: "GET",
        url: "https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ/ohlc",
        params: { referenceCurrencyUuid: "yhjMzLPhuIDl", interval: "day" },
        headers: {
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
            "X-RapidAPI-Key":
                "0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e",
        },
    };

    const histOptions = {
        method: "GET",
        url: "https://coinranking1.p.rapidapi.com/coin/razxDUgYGNAdQ",
        params: { referenceCurrencyUuid: "yhjMzLPhuIDl", timePeriod: "24h" },
        headers: {
            "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
            "X-RapidAPI-Key":
                "0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e",
        },
    };

    const res = await axios.request(options);
    const ethRes = await axios.request(ethOptions);
    const histRes = await axios.request(chartOptions);
    const historRes = await axios.request(histOptions);
    const ohlcRes = await axios.request(ohlcOptions);

    const coinHistory = historRes.data.data.coin;
    const coinHistoryTime = historRes.data.data.coin.sparkline;

    const coins = res.data.data.coins;
    const ethChange = JSON.parse(ethRes.data.data.coin.change);
    const ethName = JSON.stringify(ethRes.data.data.coin.uuid);
    const ethSymbol = JSON.stringify(ethRes.data.data.coin.symbol);
    const ethPrice = JSON.parse(ethRes.data.data.coin.price);

    const ethHist = JSON.stringify(histRes.data.data.coins);

    const priceHigh = ohlcRes.data.data.ohlc?.[0].high;
    const priceLow = ohlcRes.data.data.ohlc?.[0].low;
    const priceAvg = ohlcRes.data.data.ohlc?.[0].avg;

    return {
        props: {
            coins,
            ethChange,
            ethName,
            ethPrice,
            ethSymbol,
            ethHist,
            coinHistory,
            coinHistoryTime,
            priceHigh,
            priceLow,
            priceAvg,
        },
    };
};
