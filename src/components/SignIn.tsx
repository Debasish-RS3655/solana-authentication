// sign in component that actually implements the sign-in-with-solana signing message 
// as well as verification
// Debashish Buragohain

import { useWallet } from '@solana/wallet-adapter-react';
import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import bs58 from 'bs58';
import { useState } from 'react';
import swal from 'sweetalert';

const SignIn = () => {
    const { publicKey, signMessage } = useWallet();

    // domain and origin
    const domain = window.location.host;
    const origin = window.location.origin;

    let statement = "Sign in with Solana to the app.";

    const [siwsMessage, setSiwsMessage] = useState<SIWS>();
    const [nonce, setNonce] = useState('');
    const [sign, setSignature] = useState('');

    // Generate message for signing
    // The nonce is generated server side
    function createSolanaMessage() {
        const header = new Header();
        header.t = 'sip99';         // we are using the sip99 standard solana protocol for the signup

        const payload = new Payload();
        payload.domain = domain;

        payload.address = publicKey!.toString();
        payload.uri = origin;
        payload.statement = statement;
        payload.version = "1";
        payload.chainId = 1;

        // no header is required in here
        let message = new SIWS({ header, payload });

        // we need the noce for verification so getting it in a global variable
        setNonce(message.payload.nonce);
        setSiwsMessage(message);
        const messageText = message.prepareMessage();
        const messageEncoded = new TextEncoder().encode(messageText);
        signMessage!(messageEncoded)
            .then(resp => setSignature(bs58.encode(resp)));

    }

    return (
        <>
            <button className='web3auth' id='w3aBtn' onClick={createSolanaMessage}>
                Sign-in with Solana
            </button>
            {sign && (
                <>
                    <input className='signature' type='text' id='signature' value={sign} onChange={(e) => setSignature(e.target.value)}></input>
                    <button
                        className='web3auth'
                        id='verify'
                        onClick={(e) => {
                            const signature = {
                                t: 'sip99',
                                s: sign,
                            };

                            const payload = siwsMessage!.payload;
                            // in browser verification 
                            siwsMessage!.verify({ payload, signature }).then(resp => {
                                if (resp.success == true) {
                                    swal("Success", "Signature Verified", "success");
                                }
                                else {
                                    swal("Error", resp.error!.type, "error");
                                }
                            })
                        }}
                    >
                        Verify
                    </button>
                </>
            )}
        </>
    )
}

export default SignIn;