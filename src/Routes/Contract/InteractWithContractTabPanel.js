import React from 'react';
import { TabPanel } from 'react-tabs';

import Accessor from './Accessor';
import styles from './Contract.module.scss';

const defaultValues = {
  visible: false,
  disabled: true,
};

class InteractWithContractTabPanel extends Accessor {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
  }

  render() {
    if(!this.state.visible) return '';

    return (
      <TabPanel className={styles.tabPanel}>
        <h3 className={styles.h3}>Contact Address</h3>
        <form>
          <input
            className={styles.input}
            style={{ marginBottom: 30 }}
            type="text"
          />
        </form>
        <h3 className={styles.h3}>Select Existing Contract</h3>
        <form>
          <input
            className={styles.input}
            style={{ marginBottom: 30 }}
            type="text"
            placeholder="Select a Contract"
          />
        </form>
        <h3 className={styles.h3}>ABI / JSON Interface</h3>
        <form>
          <textarea className={styles.textarea} type="text" />
          {/*{this.every('isAuthorized', 'gotDeployedContract') && (*/}
          {/*  <input*/}
          {/*    className={styles.submit}*/}
          {/*    style={{ margin: 0 }}*/}
          {/*    type="submit"*/}
          {/*    value="Access"*/}
          {/*  />*/}
          {/*)}*/}
        </form>
      </TabPanel>
    )
  }
}

export default InteractWithContractTabPanel;