import { createContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  btcAbi,
  dogeAbi,
  solanaAbi,
  usdcAbi,
  btcAddress,
  dogeAddress,
  solanaAddress,
  usdcAddress,
} from '../lib/constants';

export const RobinhoodContext = createContext();

export const RobinhoodProvider = ({ children }) => {
  const [currentAccount,    setCurrentAccount]    = useState('');
  const [formattedAccount,  setFormattedAccount]  = useState('');
  const [coinSelect,        setCoinSelect]         = useState('DOGE');
  const [toCoin,            setToCoin]             = useState('ETH');
  const [balance,           setBalance]            = useState('0.000');
  const [amount,            setAmount]             = useState(0);
  const [isAuthenticated,   setIsAuthenticated]    = useState(false);
  const [provider,          setProvider]           = useState(null);
  const [signer,            setSigner]             = useState(null);

  const getAbi = (coin) => {
    if (coin === 'BTC')    return btcAbi;
    if (coin === 'DOGE')   return dogeAbi;
    if (coin === 'SOL')    return solanaAbi;
    if (coin === 'USDC')   return usdcAbi;
    return null;
  };

  const getAddress = (coin) => {
    if (coin === 'BTC')    return btcAddress;
    if (coin === 'DOGE')   return dogeAddress;
    if (coin === 'SOL')    return solanaAddress;
    if (coin === 'USDC')   return usdcAddress;
    return null;
  };

  const refreshBalance = useCallback(async (web3Provider, address) => {
    try {
      const raw = await web3Provider.getBalance(address);
      const eth = ethers.utils.formatEther(raw);
      setBalance(parseFloat(eth).toFixed(4));
    } catch (e) {
      console.error('Balance fetch failed:', e.message);
    }
  }, []);

  const connectAccount = useCallback(async (address) => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer   = web3Provider.getSigner();

      setCurrentAccount(address);
      setFormattedAccount(address.slice(0, 4) + '...' + address.slice(-4));
      setIsAuthenticated(true);
      setProvider(web3Provider);
      setSigner(web3Signer);

      await refreshBalance(web3Provider, address);

      fetch('/api/createUser', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ walletAddress: address }),
      }).catch(console.error);
    } catch (e) {
      console.error('connectAccount failed:', e.message);
    }
  }, [refreshBalance]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => { if (accounts.length > 0) connectAccount(accounts[0]); })
      .catch(console.error);

    const onAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        connectAccount(accounts[0]);
      } else {
        setIsAuthenticated(false);
        setCurrentAccount('');
        setFormattedAccount('');
        setBalance('0.000');
        setProvider(null);
        setSigner(null);
      }
    };

    window.ethereum.on('accountsChanged', onAccountsChanged);
    return () => window.ethereum.removeListener('accountsChanged', onAccountsChanged);
  }, [connectAccount]);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask is not installed. Please install it from metamask.io and refresh.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) await connectAccount(accounts[0]);
    } catch (e) {
      console.error('Wallet connection rejected:', e.message);
    }
  };

  const signOut = () => {
    setCurrentAccount('');
    setFormattedAccount('');
    setIsAuthenticated(false);
    setBalance('0.000');
    setProvider(null);
    setSigner(null);
  };

  const saveTransaction = (txHash, txAmount, toAddr) => {
    fetch('/api/swapTokens', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        id:     txHash,
        txHash,
        from:   currentAccount,
        to:     toAddr,
        amount: parseFloat(txAmount).toFixed(6),
      }),
    }).catch(console.error);
  };

  const sendEth = async () => {
    if (!isAuthenticated || !signer) return;

    const toAddr    = getAddress(toCoin);
    if (!toAddr) return;

    const sendAmt   = parseFloat(amount) * 0.015;
    const tx        = await signer.sendTransaction({
      to:    toAddr,
      value: ethers.utils.parseEther(sendAmt.toFixed(18)),
    });
    const receipt = await tx.wait();
    saveTransaction(receipt.transactionHash, sendAmt, receipt.to);
    return receipt;
  };

  const mint = async () => {
    if (!isAuthenticated || !signer) return;

    try {
      if (coinSelect === 'ETH') {
        await sendEth();

        const toAddr = getAddress(toCoin);
        const toAbi  = getAbi(toCoin);
        if (!toAddr || !toAbi) return;

        const contract = new ethers.Contract(toAddr, toAbi, signer);
        const amtWei   = ethers.utils.parseUnits('50', 18);
        const tx       = await contract.mint(currentAccount, amtWei);
        const receipt  = await tx.wait(1);
        saveTransaction(receipt.transactionHash, amount, receipt.to);
      } else {
        await swapTokens();
      }

      if (provider && currentAccount) await refreshBalance(provider, currentAccount);
    } catch (e) {
      console.error('mint failed:', e.message);
    }
  };

  const swapTokens = async () => {
    if (!isAuthenticated || !signer) return;
    if (coinSelect === toCoin) return;

    try {
      const fromAddr = getAddress(coinSelect);
      const fromAbi  = getAbi(coinSelect);
      const toAddr   = getAddress(toCoin);
      const toAbi    = getAbi(toCoin);

      if (!fromAddr || !fromAbi || !toAddr || !toAbi) {
        console.error('Could not resolve contract addresses for selected coins.');
        return;
      }

      const amtWei       = ethers.utils.parseUnits(String(amount), 18);
      const fromContract = new ethers.Contract(fromAddr, fromAbi, signer);
      const toContract   = new ethers.Contract(toAddr,   toAbi,   signer);

      const fromTx       = await fromContract.transfer(fromAddr, amtWei);
      await fromTx.wait();

      const toTx         = await toContract.mint(currentAccount, amtWei);
      const toReceipt    = await toTx.wait();
      saveTransaction(toReceipt.transactionHash, amount, toAddr);

      if (provider && currentAccount) await refreshBalance(provider, currentAccount);
    } catch (e) {
      console.error('swapTokens failed:', e.message);
    }
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
        provider,
        signer,
      }}
    >
      {children}
    </RobinhoodContext.Provider>
  );
};
