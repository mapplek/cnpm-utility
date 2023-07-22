import { useEffect } from 'react'
import { Alert } from '@mui/material'
import Loading from 'components/loading';
import styles from 'styles/change_status.module.css';
import abi from '/public/config/abi.json' assert { type: "json" };
import {
    usePrepareContractWrite,
    useContractWrite,
} from 'wagmi';

export default function ChangeStatus(props) {
    const change_code = {'Open': 0, 'Close': 1};

    const {
        config,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'setRecordStateTokens',
        args: [props.tokens, change_code[props.operate]]
    });
    const { data, isLoading, isSuccess, isError, error, write } = useContractWrite(config);

    return (
        <>
            <div className={styles.button_area}>
                <button
                    disabled={!write || props.tokens.length == 0 || isSuccess}
                    className={styles.button_style}
                    onClick={() => write?.()}
                >
                    {props.operate} selected records
                </button>
                {isLoading &&
                    <div>
                        <Loading />
                    </div>
                }
                {isSuccess &&
                    <div className={styles.alert_area}>
                        <Alert severity="success">
                            Success changing records status.<br />
                            Please reload or select another menu.
                        </Alert>
                    </div>
                }
                {isError || isPrepareError &&
                    <div className={styles.alert_area}>
                        <Alert severity="error">Occurred Error: {error}</Alert>
                    </div>
                }
            </div>
        </>
    )
}