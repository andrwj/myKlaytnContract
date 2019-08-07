import React from 'react';
import styles from './Contract.module.scss';

export default function ImportFunctionsButton(props) {
  if(!props.visible) return '';
  return (
    <input
      className={styles.submit}
      style={{ margin: 0 }}
      type="button"
      value="Access"
      disabled={!props.visible}
      onClick={props.onClick}
    />
  )
}

