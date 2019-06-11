import React from 'react';
import Accessor from './Accessor';

import styles from './Contract.module.scss';

class ImportFunctionsButton extends Accessor {

  render() {
    if(!this.props.visible) return '';
    return (
      <input
        className={styles.submit}
        style={{ margin: 0 }}
        type="button"
        value="Access"
        disabled={!this.props.visible}
        onClick={this.props.onClick}
      />
    )
  }
}

export default ImportFunctionsButton;