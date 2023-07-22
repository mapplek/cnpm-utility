import { useState } from 'react'
import { useContractRead } from 'wagmi';
import styles from 'styles/menu_opened_closed.module.css';
import Image from 'next/image';
import abi from '/public/config/abi_open_close.json' assert { type: "json" };
import ChangeStatus from 'components/change_status';
import Loading from 'components/loading';

export default function MenuOpened(props) {
    const [selectedCloseRecord, setSelectedCloseRecord] = useState([]);

    const CNPM_URI = 'https://gene.cnp-music.jp/images/0/open/';

    const { data, isLoading, isSuccess, isError } = useContractRead({
        address: process.env.NEXT_PUBLIC_UTIL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'tokensOfOwnerByRecordStatus',
        args: [0, props.address]
    });

    const selectCloseRecord = (token) => {
        const id = parseInt(token);
        if(selectedCloseRecord.includes(id)) {
            setSelectedCloseRecord(
                selectedCloseRecord.filter((record) => (record !== id))
            );
        } else {
            setSelectedCloseRecord(
                [...selectedCloseRecord, id]
            );
        }
    }

    return (
        <>
            <div className={styles.operation_container}>
                <div className={styles.operation_area}>
                    <div className={styles.selected_tokens_area}>
                        Selected Tokens: [{selectedCloseRecord.length}] tokens
                    </div>
                    <ChangeStatus
                        operate={'Close'}
                        address={props.address}
                        tokens={...selectedCloseRecord}
                    />
                </div>
            </div>
            {isLoading &&
                <div className={styles.container_grid}>
                    <Loading />
                </div>
            }
            {isSuccess &&
                <div className={styles.container_grid}>
                    {data.length <= 0 &&
                        <div className={styles.message_area}>You have no tokens.</div>
                    }
                    {data.length > 0 &&
                        data.map((token) => {
                            return (
                                <div
                                    className={styles.grid_element}
                                    key={`opened_${parseInt(token)}`}
                                >
                                    <label htmlFor={`opened_${parseInt(token)}`}>
                                        <input
                                            type="checkbox"
                                            id={`opened_${parseInt(token)}`}
                                        />

                                        <div
                                            className={styles.grid_selected}
                                            onClick={() => {
                                                selectCloseRecord(parseInt(token));
                                            }}
                                        >
                                            <span className={styles.text_selected}>Selected</span>
                                        </div>
                                    </label>

                                    <div className={styles.image_area}>
                                        <Image
                                            loader={({ src }) => src }
                                            src={`${CNPM_URI}${token}.png`}
                                            width='150'
                                            height='150'
                                            alt={`${parseInt(token)}.png`}
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
            }
            {isError &&
                <div className={styles.container_grid}>
                    Error!
                </div>
            }
        </>
    )
}
