import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import styles from './Contract.module.scss';

export default function AccountBox(props) {
    if(!props.visible) return '';
    return (
      <div
        className={styles.containerWrap} style={{ paddingTop: 50}}>
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
                개인 키로 계정에 연결
              </Tab>
              <Tab className={styles.accountTab}>
                Keystore 파일로 계정에 연결
              </Tab>
            </TabList>
            <div style={{ flex: 1.3, padding: '0 30px' }}>
              <div className={styles.description} style={{ paddingTop: 0 }}>
              개인 키 또는 keystore 파일을 사용하여 계정에 액세스할 수 있습니다.
              </div>
              <TabPanel>
                <h3 className={styles.h3}>
                  Private Key 
                </h3>
                <input
                  className={styles.input}
                  style={{ marginBottom: 30 }}
                  onChange={props.handlePrivateKeyChange}
                />
                <input
                  className={styles.submit}
                  type="submit"
                  value="로그인"
                  onClick={props.authByPrivateKey}
                />
              </TabPanel>
              <TabPanel>
                <h3 className={styles.h3}>Keystore 파일읽기 (.json)</h3>
                <input
                  type="file"
                  className={styles.file}
                  style={{ marginBottom: 30 }}
                  onChange={props.handleFileChange}
                />
                <h3 className={styles.h3}>Keystore 파일 비밀번호</h3>
                <input
                  type="password"
                  className={styles.input}
                  onBlur={props.handlePasswordChange}
                />
                <input
                  className={styles.submit}
                  type="submit"
                  value="로그인"
                  onClick={props.authByKeystore}
                />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    );
}
