import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Router from 'Components/Router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import styled from 'styled-components'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import styles from './Contract.module.scss'

library.add(faThumbsUp)

const Section = styled.section`
  width: 100%;
  // background-color: red;
`

const ContainerWrap = styled.div`
  width: 1024px;
  margin: 0 auto;
  padding: 80px 40px;
`

const Container = styled.div`
  width: 100%;
  // height: 780px;
  margin: 0 auto;
  background: white;
  padding: 5rem 10rem;
  box-sizing: border-box;
  border: 1px solid #e7eaf3;
  border-radius: 5px;
  box-shadow: 0 0.5rem 1.2rem rgba(189, 197, 209, 0.2);
`

const DeploySuccess = styled.div`
  width: 100%;
  background: #5eda9e;
  text-align: center;
  padding: 30px 0;
  box-shadow: 0.5rem 0.5rem 1.2rem rgba(189, 197, 209, 0.2);
  color: #fff;
  opacity: 0.8;
`

const DeploySuccessDesc = styled.div`
  width: 1280px;
  margin: 0 auto;
  font-size: 14px;
  text-align: left;
  line-height: 18px;
  display: flex;
`

const FontAweSomeWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 50px;
  font-size: 30px;
`

class Contract extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDeployContract: false,
      isDeploySueccess: false
    }
  }

  deploySection = () => {
    this.setState({
      isDeployContract: true
    })
  }
  deploySueccess = () => {
    this.setState({
      isDeploySueccess: true
    })
  }
  deployClose = () => {
    this.setState({
      isDeploySueccess: false
    })
  }

  render() {
    const { isDeployContract, isDeploySueccess } = this.state

    return (
      <Section>
        <ContainerWrap>
          <Container>
            <h2>Interact with Contract or Deploy Contract</h2>
            <Tabs className={styles.tabs}>
              <TabList className={styles.tabList}>
                <Tab selectedTabClassName="asd" className={styles.tab}>
                  Interact with Contract
                </Tab>
                <Tab className={styles.tab}>Deploy Contract</Tab>
              </TabList>
              <div className={styles.description}>
                MyEtherWallet.com does not hold your keys for you. We cannot
                access accounts, recover keys, reset passwords, nor reverse
                transactions. Protect your keys & always check that you are on
                correct URL. You are responsible for your security.
              </div>
              <TabPanel className={styles.tabPanel}>
                <h3>Contact Address</h3>
                <form>
                  <input
                    className={styles.input}
                    style={{ marginBottom: 30 }}
                    type="text"
                    placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
                  />
                </form>
                <h3>Select Existing Contract</h3>
                <form>
                  <input
                    className={styles.input}
                    style={{ marginBottom: 30 }}
                    type="text"
                    placeholder="Select a Contract"
                  />
                </form>
                <h3>ABI / JSON Interface</h3>
                <form>
                  <textarea className={styles.textarea} type="text" />
                  <input
                    className={styles.submit}
                    style={{ margin: 0 }}
                    type="submit"
                    value="Access"
                  />
                </form>
              </TabPanel>
              <TabPanel className={styles.tabPanel}>
                <h3>Byte Code</h3>
                <form>
                  <textarea className={styles.textarea} type="text" />
                </form>
                <h3>Gas Limit</h3>
                <form
                //  onSubmit={this.handleSubmit}
                >
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="30000"
                  />
                  <input
                    className={styles.submit}
                    type="button"
                    value="Sign Transaction"
                    onClick={this.deploySection}
                  />
                </form>
                {isDeployContract && (
                  <div>
                    <div className={styles.transactionBox}>
                      <form>
                        <h3>Raw Transaction</h3>
                        <textarea className={styles.textarea} type="text" />
                      </form>

                      <form
                      //  onSubmit={this.handleSubmit}
                      >
                        <h3>Signed Transaction</h3>
                        <textarea className={styles.textarea} type="text" />
                      </form>
                    </div>
                    <input
                      className={styles.submit}
                      style={{ margin: 0 }}
                      type="submit"
                      value="Deploy Contract"
                      onClick={this.deploySueccess}
                    />
                  </div>
                )}
              </TabPanel>
            </Tabs>
          </Container>
        </ContainerWrap>
        {isDeploySueccess && (
          <DeploySuccess>
            <DeploySuccessDesc>
              <FontAweSomeWrap>
                <i class="fal fa-thumbs-up" />
              </FontAweSomeWrap>
              Your TX has been broadcast to the network. This does not mean it
              has been mined & sent. During times of extreme volume, it may take
              3+ hours to send. <br />
              1) Check your TX below. <br />
              2) If it is pending for hours or disappears, use the Check TX
              Status Page to replace. <br />
              3) Use ETH Gas Station to see what gas price is optimal. <br />
              4) Save your TX Hash in case you need it later:
              0xb35126f5a4150fad4b65ac34e997b60fa18fde4b704f46b4120577e5e3ce71fa
              View your transaction & Contract Address
              0x492f293c07a1b010a54629afe23fd89cde996357
              <FontAweSomeWrap onClick={this.deployClose}>
                <i class="fal fa-times-circle" />
              </FontAweSomeWrap>
            </DeploySuccessDesc>
          </DeploySuccess>
        )}
      </Section>
    )
  }
}

export default Contract
