import React from 'react';
import Accessor from './Accessor';

import styles from './Contract.module.scss';

const defaultValues = {
  visible: false,
  disabled: false,
};

class TransactionSignButton extends Accessor {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
    this.onClick = this.props.onClick;
  }

  render() {
    if(!this.state.visible) return '';
    return (
      <input
        className={styles.submit}
        type="button"
        value="Sign Transaction"
        disabled={this.state.disabled}
        onClick={this.onClick}
      />
    )
  }
}

export default TransactionSignButton;