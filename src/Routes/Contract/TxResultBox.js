import React from 'react';
import Accessor from './Accessor';

import styles from './Contract.module.scss';

const defaultValues = {
  visible: false,
  transactionHash:'',
  contractAddress: '',
};

class TxResultBox extends Accessor {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
    this.resetAll = this.props.onClick;
    this.Klaytnscope = this.props.Klaytnscope;
  }

  render() {
    if(!this.state.visible) return '';
    return (
      <div className={styles.messageBox}>
        {/* warning일때, className="warningBox"  */}
        {/* information일때, className="infoBox"  */}
        <div className={styles.boxDescWrap}>
          <div className={styles.fontAweSomeWrap}>
            <i className="fal fa-thumbs-up" />
            {/* warning 일때  */}
            {/* <i class="fal fa-exclamation-triangle" /> */}
            {/* information 일때  */}
            {/* <i class="fal fa-info-circle" /> */}
          </div>
          <div className={styles.boxDesc}>
            Your TX has been broadcast to the network.
            <br /> 1) Check your TX below. <br />
            2) If it is pending for minutes or disappears, use the Check TX
            Status Page to replace. <br />
            3) Save your Transaction Hash in case you need it later:{' '}
            <a href={this.Klaytnscope('tx', this.state.transactionHash)} target="_blank">{this.state.transactionHash}</a>
            <br />
            4) View your transaction & Contract Address:{' '}
            <a href={this.Klaytnscope( 'account', this.state.contractAddress )} target="_blank">{this.state.contractAddress}</a>
          </div>
          <div className={styles.fontAweSomeWrap} onClick={this.resetAll}>
            <i className="fal fa-times-circle" />
          </div>
        </div>
      </div>
    )
  }
}

export default TxResultBox;