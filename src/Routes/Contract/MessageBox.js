import React from 'react';
import Accessor from './Accessor';

import styles from './Contract.module.scss';

const assets = {
  "warning": {
    boxClassName: styles.warningBox,
    iconClassName: "fal fa-exclamation-triangle",
  },
  "info": {
    boxClassName: styles.infoBox,
    iconClassName: "fal fa-info-circle",
  }
};

const defaultValues = {
  message: '',
  visible: false,
  type: "warning",
};


class MessageBox extends Accessor {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
    this.onClick = this.props.onClick;
  }

  render() {
    if(!this.state.visible) return '';
    const a = assets[this.props.type];
    return (
      <div className={a.boxClassName}>
        <div className={styles.boxDescWrap}>
          <div className={styles.fontAweSomeWrap}>
            <i className={a.iconClassName} />
          </div>
          <div className={styles.boxDesc}>
            {this.state.message}
          </div>
          <div className={styles.fontAweSomeWrap} onClick={this.onClick}>
            <i className="fal fa-times-circle" />
          </div>
        </div>
      </div>
    )
  }
}

export default MessageBox;