import { createContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import {
    btcAbi,
    dogeAbi,
    solanaAbi,
    usdcAbi,
    btcAddress,
    dogeAddress,
    solanaAddress,
    usdcAddress,
} from "../lib/constants";

export const RobinhoodContext = createContext();

export const RobinhoodProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formattedAccount, setFormattedAccount] = useState("");
    const [coinSelect, setCoinSelect] = useState("DOGE");
    const [toCoin, setToCoin] = useState("");
    const [balance, setBalance] = useState("");

    const [amount, setAmount] = useState(0);

    const { isAuthenticated, authenticate, user, logout, Moralis, enableWeb3 } =
        useMoralis();

    useEffect(() => {
        async function userAccount(){
            if (isAuthenticated) {
                const account = user.get("ethAddress");
                let formatAccount =
                    account.slice(0, 4) + "..." + account.slice(-4);
                setFormattedAccount(formatAccount);
                setCurrentAccount(account);

                const currentBalance =
                    await Moralis.Web3API.account.getNativeBalance({
                        chain: "rinkeby",
                        address: currentAccount,
                    });
                const balanceToEth = Moralis.Units.FromWei(
                    currentBalance.balance
                );
                const formattedBalance = parseFloat(balanceToEth).toFixed(3);
                setBalance(formattedBalance);
            }
        };

        userAccount();
        
    }, [isAuthenticated, enableWeb3]);

    useEffect(() => {
        if (!currentAccount) return;
        (async () => {
            const response = await fetch("/api/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: currentAccount,
                }),
            });
            const data = await response.json();
        })();
    }, [currentAccount]);

    const getContractAddress = () => {
        if (coinSelect === "BTC") return btcAddress;
        if (coinSelect === "DOGE") return dogeAddress;
        if (coinSelect === "SOLANA") return solanaAddress;
        if (coinSelect === "USDC") return usdcAddress;
    };

    const getToAddress = () => {
        if (toCoin === "BTC") return btcAddress;
        if (toCoin === "DOGE") return dogeAddress;
        if (toCoin === "SOLANA") return solanaAddress;
        if (toCoin === "USDC") return usdcAddress;
    };

    const getToAbi = () => {
        if (toCoin === "BTC") return btcAbi;
        if (toCoin === "DOGE") return dogeAbi;
        if (toCoin === "SOLANA") return solanaAbi;
        if (toCoin === "USDC") return usdcAbi;
    };

    const mint = async () => {
        try {
            if (coinSelect === "ETH") {
                if (!isAuthenticated) return;

                await Moralis.enableWeb3();
                const contractAddress = getToAddress();
                const abi = getToAbi();

                let options = {
                    contractAddress: contractAddress,
                    functionName: "mint",
                    abi: abi,
                    params: {
                        to: currentAccount,
                        amount: Moralis.Units.Token("50", "18"),
                    },
                };
                sendEth();
                const transaction = await Moralis.executeFunction(options);
                const receipt = await transaction.wait(4);
                console.log(receipt);
                saveTransaction(receipt.transactionHarsh, amount, receipt.to);
            } else {
                swapTokens();
                saveTransaction(receipt.transactionHarsh, amount, receipt.to);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const swapTokens = async () => {
        try {
            if (!isAuthenticated) return;
            await Moralis.enableWeb3();

            if (coinSelect === toCoin) return;

            const fromOptions = {
                type: "erc20",
                amount: Moralis.Units.Token(amount, "18"),
                receiver: getContractAddress(),
                contractAddress: getContractAddress(),
            };
            const toMintOptions = {
                contractAddress: getToAddress(),
                functionName: "mint",
                abi: getToAbi(),
                params: {
                    to: currentAccount,
                    amount: Moralis.Units.Token(amount, "18"),
                },
            };

            let fromTransaction = await Moralis.transfer(fromOptions);
            let toMintTransaction = await Moralis.executeFunction(
                toMintOptions
            );
            let fromReceipt = await fromTransaction.wait();
            let toReceipt = await toMintTransaction.wait();

            console.log(fromReceipt);
            console.log(toReceipt);
        } catch (error) {
            console.log(error.message);
        }
    };

    const sendEth = async () => {
        if (!isAuthenticated) return;
        const contractAddress = getToAddress();

        let sendAmount = amount * 0.015

        let options = {
            type: "native",
            amount: Moralis.Units.ETH(`${sendAmount}`),
            receiver: contractAddress,
        };

        const transaction = await Moralis.transfer(options);
        const receipt = await transaction.wait();
        console.log(receipt);
        saveTransaction(receipt.transactionHarsh, sendAmount, receipt.to);
    };

    const saveTransaction = async (_id, txHash) => {

        const contractAddress = getToAddress();

        let sendAmount = amount * 0.015

        await fetch("/api/swapTokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: _id,
                txHash: txHash,
                from: currentAccount,
                to: contractAddress,
                amount: sendAmount.toFixed(6),
            }),
        });
    };

    const connectWallet = () => {
        authenticate();
    };

    const signOut = () => {
        logout();
    };

    return (
        <RobinhoodContext.Provider
            value={{
                connectWallet,
                signOut,
                currentAccount,
                isAuthenticated,
                formattedAccount,
                setAmount,
                mint,
                setCoinSelect,
                coinSelect,
                balance,
                swapTokens,
                amount,
                toCoin,
                setToCoin,
            }}
        >
            {children}
        </RobinhoodContext.Provider>
    );
};
