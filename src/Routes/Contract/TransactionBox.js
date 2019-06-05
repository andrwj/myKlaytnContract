import React from 'react';
import Accessor from './Accessor';

import styles from './Contract.module.scss';

const defaultValues = {
  visible: false,
  disabled: false,
  rawTransaction: '',
  signedTransaction: '',
};


class TransactionBox extends Accessor {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
    this.onClick = this.props.onClick;
  }

  render() {
    if(!this.state.visible) return '';

    return (
      <div>
        <div className={styles.transactionBox}>
          <form>
            <h3 className={styles.h3}>Raw Transaction</h3>
            <textarea
              className={styles.textarea}
              type="text"
              value={JSON.stringify(this.state.rawTransaction)}
              disabled
              onChange={() => void 0}
            />
          </form>

          <form >
            <h3 className={styles.h3}>Signed Transaction</h3>
            <textarea
              className={styles.textarea}
              value={this.state.signedTransaction}
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
          disabled={this.state.disabled}
          onClick={this.onClick}
        />
      </div>
    )
  }
}

export default TransactionBox;