import React from 'react';
import styles from './Contract.module.scss';

export default function TransactionBox(props) {
    if(!props.visible) return '';
    return (
      <div>
        <div className={styles.transactionBox}>
          <form>
            <h3 className={styles.h3}>Raw Transaction</h3>
            <textarea
              className={styles.textarea}
              type="text"
              value={JSON.stringify(props.rawTransaction)}
              disabled
              onChange={() => void 0}
            />
          </form>

          <form >
            <h3 className={styles.h3}>Signed Transaction</h3>
            <textarea
              className={styles.textarea}
              value={props.signedTransaction}
              disabled
              onChange={() => void 0}
            />
          </form>
        </div>
        <input
          className={styles.submit}
          style={{ margin: 0 }}
          type="submit"
          value="Deploy Contract"
          disabled={props.disabled}
          onClick={props.onClick}
        />
      </div>
    );
  }

