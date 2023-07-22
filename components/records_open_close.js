
import { useState } from 'react'
import styles from 'styles/records_open_close.module.css';
import MenuOpened from 'components/menu_opened';
import MenuClosed from 'components/menu_closed';

export default function RecordsOpenClose(props) {
    const [openedButtonDisabled, setOpenedButtonDisabled] = useState(true);
    const [closedButtonDisabled, setClosedButtonDisabled] = useState(false);
    const [menuState, setMenuState] = useState('opened');

    return (
        <div className={styles.container_outer}>
            <div className={styles.menu_bar_area}>
                <div className={styles.menu_bar}>
                    <button
                        disabled={openedButtonDisabled}
                        className={styles.menu_item}
                        onClick={() => {
                            setMenuState('opened');
                            setOpenedButtonDisabled(true);
                            setClosedButtonDisabled(false);
                        }}
                    >
                        Opened Records
                    </button>
                    <button
                        disabled={closedButtonDisabled}
                        className={styles.menu_item}
                        onClick={() => {
                            setMenuState('closed')
                            setOpenedButtonDisabled(false);
                            setClosedButtonDisabled(true);
                        }}
                    >
                        Closed Records
                    </button>
                </div>
            </div>

            {menuState == 'opened' &&
                <MenuOpened address={props.address} />
            }

            {menuState == 'closed' &&
                <MenuClosed address={props.address} />
            }
        </div>
    )
}