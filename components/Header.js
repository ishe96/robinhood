import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { RobinhoodContext } from "../context/RobinhoodContext";

import logosm from '../assets/logosm.png'

const styles = {
    container: "flex w-screen h-15 bg-black px-24 py-3 mb-5 fixed",
    leftHeader: "flex flex-1 relative",
    leftSide: 'flex flex-1 md:flex-row justify-between gap-1',
    logo: "object-contain cursor-pointer",
    logoName: "text-gray-300 text-xl font-bold ml-2",
    searchWrapper: "flex flex-1",
    searchInputContainer:
        "text-white items-center flex flex-1 -ml-64 border-gray-400 mr-64 hover:bg-[#1e2123] duration-300 p-3 rounded-lg",
    searchIcon: "text-gray-400 text-3xl mr-3",
    searchInputWrapper: "text-gray-400 text-lg w-full",
    searchInput: "bg-transparent outline-none w-full",
    rightHeader: "flex items-center justify-end text-white gap-8",
    menuItem: "cursor-pointer font-bold hover:text-green-500 duration-300",
};

const Header = () => {
    
    const {
        connectWallet,
        signOut,
        currentAccount,
        isAuthenticated,
        formattedAccount,
        swapTokens,
    } = useContext(RobinhoodContext);

    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
            <div className={styles.leftHeader}>
                <Image src={logosm} alt='logosm' height={20} width={20} className={styles.logo}/>
                <div className={styles.logoName}>Etherswap</div>
            </div>

            {/* <div className={styles.searchWrapper}>
                <div className={styles.searchInputContainer}>
                    <AiOutlineSearch className={styles.searchIcon} />
                    <div className={styles.searchInputWrapper}>
                        <input
                            placeholder="Search ..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </div> */}
            </div>

            <div className={styles.rightHeader}>
                <div className={styles.menuItem}>Rewards</div>
                {/* <div className={styles.menuItem}>Portfolio</div> */}
                <div className={styles.menuItem}>Cash</div>
                {/* <div className={styles.menuItem}>Messages</div> */}

                {isAuthenticated && (
                    <>
                        <div className={styles.menuItem}>
                            {formattedAccount}
                        </div>
                        <div className={styles.menuItem} onClick={() => signOut()} >LogOut</div>
                    </>
                )}

                {!isAuthenticated && (
                    <div className={styles.menuItem} onClick={() => connectWallet()} >Login</div>
                )}
            </div>
        </div>
    );
};

export default Header;
