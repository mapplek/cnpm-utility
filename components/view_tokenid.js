import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause, faCircleStop } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react'
import { useContractRead } from 'wagmi';
import abi from '/public/config/abi.json' assert { type: "json" };
import Image from 'next/image';
import styles from 'styles/view_tokenid.module.css';
import useSound from 'use-sound';


export default function ViewTokenId(props) {
    const CNPM_URI = 'https://gene.cnp-music.jp/images/0/open/';
    const [selectedToken, setSelectedToken] = useState(0);

    const [play, { stop, pause }] = useSound(`https://gene.cnp-music.jp/animations/0/${selectedToken}.wav`);

    const { data, isLoading, isSuccess, isError } = useContractRead({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'tokensOfOwner',
        args: [props.address]
    });

    return (
        <>
            {isLoading &&
                <div className={styles.container_outer}>
                    Loading...
                </div>
            }
            {isSuccess &&
                <div className={styles.container_outer}>
                    <div className={styles.player_bar_area}>
                        <div className={styles.player_bar}>
                            {selectedToken == 0 &&
                                <div className={styles.selected_id_area}>[ non-selected ]</div>
                            }
                            {selectedToken != 0 &&
                                <div className={styles.selected_id_area}>selected: [ {selectedToken} ]</div>
                            }
                            <div>
                                <button onClick={() => play()} name='play' className={styles.button_style}>
                                    <FontAwesomeIcon icon={faCirclePlay} className={styles.circle_icon} size='3x' />
                                </button>
                            </div>
                            <div>
                                <button onClick={() => pause()} name='pause' className={styles.button_style}>
                                    <FontAwesomeIcon icon={faCirclePause} className={styles.circle_icon} size='3x' />
                                </button>
                            </div>
                            <div>
                                <button onClick={() => stop()} name='stop' className={styles.button_style}>
                                    <FontAwesomeIcon icon={faCircleStop} className={styles.circle_icon} size='3x' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container_grid}>
                        {data.length <= 0 &&
                            <div className={styles.message_area}>You have no tokens.</div>
                        }
                        {data.length > 0 &&
                            data.map((token) => {
                                return (
                                    <div
                                        className={styles.grid_element}
                                        key={`${parseInt(token)}`}
                                    >
                                        <div className={styles.grid_overlap} onClick={() => { pause(); setSelectedToken(parseInt(token));}}></div>
                                        <div className={styles.image_area}>
                                            <Image
                                                loader={({ src }) => src }
                                                src={`${CNPM_URI}${parseInt(token)}.png`}
                                                width='150'
                                                height='150'
                                                alt={`${parseInt(token)}`}
                                            />
                                        </div>
                                        <div className={styles.view_id_area}>
                                            tokenId: [ {parseInt(token)} ]
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            {isError &&
            <div>
                <p>isError</p>
            </div>
            }
        </>
    )
}