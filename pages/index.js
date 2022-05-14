// import styles from '../styles/Home.module.css'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

const styles = {
    wrapper: "w-screen h-screen flex flex-col",
    mainContainer: "w-2/3 h-full m-auto flex mt-16",
};

export default function Home() {
    return (
        <div className={styles.wrapper}>
            {/* Header */}

            <div className={styles.mainContainer}>
                <div className={styles.leftMain}>
                    <div className={styles.portfolioAmountContainer}>
                        <div className={styles.portfolioAmount}>25 ETH</div>
                        <div className={styles.portfolioPercent}>
                            +0.008(+0.57%)
                            <span className={styles.pastHour}>Past Hour</span>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        {/* <PortfolioChart/> */}
                    </div>
                </div>

                <div className={styles.buyingPower}>
                    <div className={styles.buyingPowerTitle}>Buying Power</div>
                    <div className={styles.buyingPowerAmount}>15 ETH</div>
                </div>

                <div className={styles.notice}>
                    <div className={styles.noticeContainer}>
                        <div className={styles.noticeTitle}>Send Funds</div>
                        <div className={styles.noticeMessage}>
                            Transaction transfer
                        </div>
                        {/* <BuyTokens/> */}
                    </div>
                </div>
            {/* </div> */}
            {/* <Notifier/> */}
            <div className={styles.rightMain}>
                <div className={styles.rightMainItem}>
                    <div className={styles.itemTitle}>Crypto Currencies</div>

                    <BiDotsHorizontalRounded className={styles.moreOptions} />
                </div>
                {/* Map through coins and for every coin make an Assert */}
                {/* <Asset/> */}

                <div className={styles.rightMainItem}>
                    <div className={styles.itemTitle}>Lists</div>
                    <AiOutlinePlus className={styles.moreOptions} />
                </div>
            </div>
            </div>
        </div>
    );
}
