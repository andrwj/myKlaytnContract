import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Accessor from './Accessor';
import styles from './Contract.module.scss';

export default function AccountBox(props) {
    if(!props.visible) return '';
    return (
      <div
        className={styles.containerWrap}
        style={{ paddingTop: 30, paddingBottom: 60 }}>
        <div className={styles.containerBottom}>
          <h2 className={styles.h2}>Access Existing Account</h2>
          <Tabs
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'row'
            }}>
            <TabList className={styles.accountTabs}>
              <Tab className={styles.accountTab}>
                Sign-in Using Private Key
              </Tab>
              <Tab className={styles.accountTab}>
                Sign-in Using Keystore File
              </Tab>
            </TabList>
            <div style={{ flex: 1.3, padding: '0 30px' }}>
              <div className={styles.description} style={{ paddingTop: 0 }}>
                You can access your account using your private key or Klaytn
                HRA Private Key (for custom address accounts). Or you can
                also use your keystore file and its password.
              </div>
              <TabPanel>
                <h3 className={styles.h3}>
                  Private Key or HRA Private Key
                </h3>
                <input
                  className={styles.input}
                  style={{ marginBottom: 30 }}
                  onChange={props.handlePrivateKeyChange}
                />
                <input
                  className={styles.submit}
                  type="submit"
                  value="Access"
                  onClick={props.authByPrivateKey}
                />
              </TabPanel>
              <TabPanel>
                <h3 className={styles.h3}>Import Keystore File (.json)</h3>
                <input
                  type="file"
                  className={styles.file}
                  style={{ marginBottom: 30 }}
                  onChange={props.handleFileChange}
                />
                <h3 className={styles.h3}>Password</h3>
                <input
                  type="password"
                  className={styles.input}
                  onBlur={props.handlePasswordChange}
                />
                <input
                  className={styles.submit}
                  type="submit"
                  value="Access"
                  onClick={props.authByKeystore}
                />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    );
}
