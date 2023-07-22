import { useState } from 'react'
import { useContractRead } from 'wagmi';
import styles from 'styles/menu_opened_closed.module.css';
import Image from 'next/image';
import abi from '/public/config/abi_open_close.json' assert { type: "json" };
import ChangeStatus from 'components/change_status';
import Loading from 'components/loading';

export default function MenuClosed(props) {
    const [selectedOpenRecord, setSelectedOpenRecord] = useState([]);

    const CNPM_URI = 'https://gene.cnp-music.jp/images/0/close/';

    const { data, isLoading, isSuccess, isError } = useContractRead({
        address: process.env.NEXT_PUBLIC_UTIL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'tokensOfOwnerByRecordStatus',
        args: [1, props.address]
    });

    const selectOpenRecord = (token) => {
        const id = parseInt(token);
        if(selectedOpenRecord.includes(id)) {
            setSelectedOpenRecord(
                selectedOpenRecord.filter((record) => (record !== id))
            );
        } else {
            setSelectedOpenRecord(
                [...selectedOpenRecord, id]
            );
        }
    }

    return (
        <>
            <div className={styles.operation_container}>
                <div className={styles.operation_area}>
                    <div className={styles.selected_tokens_area}>
                        Selected Tokens: [{selectedOpenRecord.length}] tokens
                    </div>
                    <ChangeStatus
                        operate={'Open'}
                        address={props.address}
                        tokens={...selectedOpenRecord}
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
                                    key={`closed_${parseInt(token)}`}
                                >
                                    <label htmlFor={`closed_${parseInt(token)}`}>
                                        <input
                                            type="checkbox"
                                            id={`closed_${parseInt(token)}`}
                                        />

                                        <div
                                            className={styles.grid_selected}
                                            onClick={() => {
                                                selectOpenRecord(parseInt(token));
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
