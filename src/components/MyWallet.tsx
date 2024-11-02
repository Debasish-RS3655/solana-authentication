// component that allows the user to select their wallet provider and connect and disconnect to their wallet
// Debashish Buragohain

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const MyWallet = () => {
    const { connection } = useConnection();
    let walletAddress = "";

    // if you use anchor use the anchor hook
    // const wallet = useAnchorWallet();
    // const walletAddress = wallet?.publicKey.toString();

    const wallet = useWallet();
    if (wallet.connected && wallet.publicKey) {
        walletAddress = wallet.publicKey.toString();
    }

    return (
        <>
            {wallet.connected && (
                <span>
                    <p className="center">Public Key</p>
                    <input className="publicKey" type="text" id="publicKey" value={walletAddress} />
                </span>
            )}

            {(wallet.connected && <WalletDisconnectButton className="web3auth" />) || (
                <WalletModalProvider>
                    <WalletMultiButton className="web3auth" />
                </WalletModalProvider>
            )
            }
        </>
    )
}

export default MyWallet;