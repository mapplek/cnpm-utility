import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import ViewTokenId from 'components/view_tokenid';
import RecordsOpenClose from 'components/records_open_close';
import styles from 'styles/profile.module.css';
import Loading from 'components/loading';
import { useState } from 'react';
import { Alert } from '@mui/material'
 
export default function Profile() {
    const [openedClosedButtonDisabled, setOpenedClosedButtonDisabled] = useState(false);
    const [playerButtonDisabled, setPlayerButtonDisabled] = useState(true);
    const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
    const { connector: isConnected, isConnecting, address } = useAccount();
    const { connect, connectors, error } = useConnect();
    const [menuMode, setMenuMode] = useState('player');
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();
 
    return (
        <>
            {!isConnected && !isConnecting &&
                <div className={styles.front_panel}>
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            className={styles.connect_button}
                        >
                            Connect Wallet
                        </button>
                    ))}
                </div>
            }

            {error &&
                <Alert severity="error">Please install MetaMask!</Alert>
            }

            {isConnecting &&
                <div className={styles.front_panel}>
                    <div>
                        <Loading />
                    </div>
                </div>
            }

            {isConnected && (chain.id != process.env.NEXT_PUBLIC_CHAIN_ID) &&
                <div className={styles.front_panel}>
                    <button
                        key={process.env.NEXT_PUBLIC_CHAIN_ID}
                        onClick={() => switchNetwork?.(process.env.NEXT_PUBLIC_CHAIN_ID)}
                        className={styles.connect_button}
                    >
                        ChangeNetwork
                        {
                            isLoading && pendingChainId === process.env.NEXT_PUBLIC_CHAIN_ID &&
                            ' (switching...)'
                        }
                    </button>
                </div>
            }

            {isConnected && (chain.id == process.env.NEXT_PUBLIC_CHAIN_ID) &&
                <div>
                    <div className={styles.header_container}>
                        <div className={styles.connect_container}>
                            <div>
                                <button
                                    onClick={() => disconnect()}
                                    className={styles.disconnect_button}
                                >
                                    Disconnect
                                </button>
                            </div>
                            <div className={styles.address_area}>
                                Address: [ {address.substr(0, 6)}...{address.substr(-4, 4)} ]
                            </div>
                        </div>
                        <div className={styles.menu_container}>
                            <button
                                disabled={playerButtonDisabled}
                                className={styles.menu_area}
                                onClick={() => {
                                    setMenuMode('player');
                                    setPlayerButtonDisabled(true);
                                    setOpenedClosedButtonDisabled(false);
                                }}
                            >
                                Player
                            </button>
                            <button
                                disabled={openedClosedButtonDisabled}
                                className={styles.menu_area}
                                onClick={() => {
                                    setMenuMode('open_close');
                                    setPlayerButtonDisabled(false);
                                    setOpenedClosedButtonDisabled(true);
                                }}
                            >
                                Records Open/Close
                            </button>
                        </div>
                        
                    </div>
                    <div>
                        {menuMode == 'player' &&
                            <ViewTokenId address={address} />
                        }

                        {menuMode == 'open_close' &&
                            <RecordsOpenClose address={address} />
                        }
                    </div>
                </div>
            }
        </>
    )
}