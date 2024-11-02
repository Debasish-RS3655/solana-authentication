import React from "react";
import './App.css'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import MyWallet from "./components/MyWallet";
import SignIn from "./components/SignIn";

function App() {
  const network = WalletAdapterNetwork.Mainnet;

  // we can also provide a custom RPC endpoint
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your 
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    [network]
  );


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="main">
          <p className="sign">Sign in with Solana</p>
          <br />
        </div>
        <MyWallet />
        <SignIn />
        <span id="postSignIn" style={{ display: "none" }}>
          <p>Public Key</p>
          <input className="publicKey" type="text" id="publicKey" />
          <p>Signature</p>
          <input className="signature" type="text" id="signature" />
          <button className="web3auth" id="verify">
            Verify
          </button>
        </span>
        <p className="center">Created by Debashish</p>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App;