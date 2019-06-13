import React from 'react';
import styles from './Contract.module.scss';

export default function TxResultBox(props) {
  if(!props.visible) return '';
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
          <a href={this.Klaytnscope('tx', props.transactionHash)} target="_blank">{props.transactionHash}</a>
          <br />
          4) View your transaction & Contract Address:{' '}
          <a href={this.Klaytnscope( 'account', props.contractAddress )} target="_blank">{props.contractAddress}</a>
        </div>
        <div className={styles.fontAweSomeWrap} onClick={props.onClick}>
          <i className="fal fa-times-circle" />
        </div>
      </div>
    </div>
  );
}

