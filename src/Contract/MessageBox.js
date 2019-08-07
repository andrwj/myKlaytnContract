import React from 'react';
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

export default function MessageBox(props) {
    if(!props.visible) return '';
    const a = assets[props.type];
    return (
      <div className={a.boxClassName}>
        <div className={styles.boxDescWrap}>
          <div className={styles.fontAweSomeWrap}>
            <i className={a.iconClassName} />
          </div>
          <div className={styles.boxDesc}>
            {props.message}
          </div>
          <div className={styles.fontAweSomeWrap} onClick={props.onClick}>
            <i className="fal fa-times-circle" />
          </div>
        </div>
      </div>
    )
}

