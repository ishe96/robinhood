import { Typography } from "antd";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useState, useContext } from "react";

import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import {BiTrendingDown, BiTrendingUp} from 'react-icons/bi'
import {RiArrowUpDownFill} from 'react-icons/ri'

const { Title } = Typography;

const styles = {
    wrapper:
        "flex flex-row justify-between p-5 hover:bg-[#30363b] duration-300",
    container: "flex flex-col text-white items-center justify-center",
    name: "font-bold",
    chart: "w-full h-full",
    price: "flex flex-col text-white text-3xl",
    percent: "flex text-green-400 text-sm items-center",
};

export const getStaticProps = async () => {
    const axios = require("axios");

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

    const ohlcOptions = {
        method: 'GET',
        url: 'https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/ohlc',
        params: {referenceCurrencyUuid: 'yhjMzLPhuIDl', interval: 'day'},
        headers: {
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
          'X-RapidAPI-Key': '0e63d878b0msh67e3663ab62bb7fp1af80ejsn0535c3e5f87e'
        }
      };

    const histRes = await axios.request(histOptions);
    const ohlcRes = await axios.request(ohlcOptions)

    const coinHistory = histRes.data.data.coin.sparkline;
    const coinChange = JSON.parse(histRes.data.data.coin.change);

    const priceHigh = ohlcRes.data.data.ohlc?.[0].high
    const priceLow = ohlcRes.data.data.ohlc?.[0].low
    const priceAvg = ohlcRes.data.data.ohlc?.[0].avg

    return {
        props: { coinHistoryTimestamp, coinChange, coinHistory, priceHigh, priceLow, priceAvg },
    };
};

const LineChart = ({
    price,
    coinHistory,
    coinChange,
    priceHigh, priceLow, priceAvg
}) => {

    let prHigh = [parseFloat(priceHigh).toFixed(2)]
    let prLow = [parseFloat(priceLow).toFixed(2)]
    let prAvg = [parseFloat(priceAvg).toFixed(2)]

    const setGraphColor = () => {
        if (coinChange < 0) {
            return "#ef4b09";
        } else {
            return "#00ff1a";
        }
    };

    const data = {
        labels: ['1H','2H','3H','4H','5H','6H','7H','8H','9H','10H','11H','12H', '13H','14H','15H','16H','17H','18H','19H','20H','21H','22H','23H','24H'],
        datasets: [
            {
                fill: false,
                lineTension: 0.01,
                backgroundColor: setGraphColor(),
                borderColor: setGraphColor(),
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: setGraphColor(),
                pointBackgroundColor: setGraphColor(),
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: setGraphColor(),
                pointHoverBorderColor: setGraphColor(),
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: coinHistory,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    price = parseFloat(price).toFixed(2);

    return (
        <div className={styles.wrapper}>

            <div>
                <div className={styles.chart}>
                    <Line
                        data={data}
                        options={options}
                        // width={400}
                        // height={150}
                    />
                </div>
            </div>

            <div className={styles.price}>
                <div>{price}</div>
                {/* <div
                    className={styles.percent}
                    style={{ color: coinChange < 0 ? "#ef4b09" : "#00ff1a" }}
                >
                    {coinChange}%
                </div> */}
                <div
                    className={styles.percent}
                    style={{ color: "#00ff1a" }}
                >
                    <BiTrendingUp style={{marginRight:5}}/>{prHigh}
                </div>
                <div
                    className={styles.percent}
                    style={{ color: "orange" }}
                >
                    <RiArrowUpDownFill style={{marginRight:5}}/>{prAvg}
                </div>
                <div
                    className={styles.percent}
                    style={{ color: "#ef4b09" }}
                >
                    <BiTrendingDown style={{marginRight:5}}/> {prLow}
                </div>
                
            </div>
        </div>
    );
};

export default LineChart;
