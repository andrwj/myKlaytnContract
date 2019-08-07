import React from 'react';
import styles from './Contract.module.scss';

export default function TransactionSignButton(props) {
  if(!props.visible) return '';
  return (
    <input
      className={styles.submit}
      type="button"
      value="Sign Transaction"
      disabled={props.disabled}
      onClick={props.onClick}
    />
  )
}

