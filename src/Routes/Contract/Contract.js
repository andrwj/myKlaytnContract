import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Router from 'Components/Router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled from 'styled-components';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import * as R from 'ramda';
import * as utils from 'Utils/index';
import * as Mason from 'Utils/mason';

import styles from './Contract.module.scss';

library.add(faThumbsUp);

const {caver, baobabNetwork} = Mason;

const Section = styled.section`
  width: 100%;
  // background-color: red;
`;

const ContainerWrap = styled.div`
  width: 1024px;
  margin: 0 auto;
  // padding: 100px 40px;
`;

const Tabss = styled(Tab)`
  width: 50%;
  text-align: center;
  padding: 25px 10px;
  font-size: 16px;
  font-weight: 700;
  color: #031f42;
  border-bottom: 4px solid #031f42
    // ${props => (props.current ? '#031f42' : 'transparent')};
`;

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

const ContainerBottom = styled.div`
  width: 100%;
  // height: 780px;
  margin: 0 auto;
  background: white;
  padding: 5rem 3rem;
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
const defaultValues = {
    showAccessTab: false,
    showSignButton: false,
    isAuthorized: false,
    hasBytecode: false,
    hasSigned: false,
    isContractDeployed: false,
    gotDeployedContract: false,
    validBytrecodeClassName: styles.textarea,
    bytecode: '',
    gasLimit: 0,
    password: '',
    privateKey: '',
    rawTransaction: '',
    signedTransaction: '',
    caver: null, // in case ...
    contractAddress:'',
    transactionHash: '',
    };

class Contract extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, defaultValues);
    caver(baobabNetwork());
  }

  every = (...args) => args.every(name => !!this.state[name]);
  sethunk = R.curry((name, value, _) => this.setState({[name]: value}));
  gethunk = R.curry((name, _) => this.state[name]);
  enable = R.curry((name,_)  => this.setState({[name]: true}));
  disable = R.curry((name, _) => this.setState({[name]: false}));
  toggle = R.curry((values, name) => this.setState({[name]: values[1 - (Object.is(!!this.state[name], true) ? 1 : 0)]}));
  get = (name) => this.state[name];
  set = R.curry((name, value) => Object.is(value, undefined) ? this.state[name] : this.setState({[name]: value}));
  Set = (args) => this.setState(Object.entries(args).map(([k,v]) => ({[k]: v})).reduce((acc,el) => Object.assign(acc,el), {}));

  toggleAccessTab = () => this.toggle([false, true],'showAccessTab');
  resetAll = () => this.Set(defaultValues);

  // bytecode를 통해 컨트랙을 생성 > TEXTAREA에 bytecode를 넣을 경우
  BytecodeChangeHandler = ({target: {value}}) => {
    if(utils.isValidHexString(value)) {
      Mason.estimateGas(value)
      .then(this.set('gasLimit'))
      .then(this.enable('hasBytecode'))
      .then(this.sethunk('bytecode', String(value).trim()))
      .then(this.sethunk('validBytrecodeClassName', `${styles.textarea} validate-ok`))
      .catch(e=> {
        this.Set({'gasLimit':0, hasBytecode: false, bytecode: '', validBytrecodeClassName: styles.textarea});
      });
    } else {
        this.Set({'gasLimit':0, hasBytecode: false, bytecode: '', validBytrecodeClassName: styles.textarea});
    }
  }

  // 사용자가 bytecode의 gasLimit값을 직접 수정해서 넣었을 경우
  // TODO: validation check
  handleGasLimitChange = ({target: {value}}) => this.set('gasLimit', value);

  // 사용자의 PC에 저장된 Keystore (JSON) 파일을 읽어 들일 때
  // TODO: 상황별 가이드라인
  handleFileChange = ({target: {files:[path]}}) => {
    const fileReader = new FileReader();
    fileReader.readAsText(path);
    fileReader.onload = ({target:{result}}) => {
      try {
        this.state.keystore = Mason.getKeystoreFromString(result)
        // focus on password input field
      } catch (event) {
        this.get('password');
      }
    }
  }

  // 사용자의 PC에 저장된 Keystore (JSON) 파일을 읽어 들인 후, 비밀번호 입력할 때
  // TODO: focus 떠날 때 값을 받을 것
  handlePasswordChange = ({target: {value}}) => this.set('password', value);

  authByKeystore = (e) => {
    try {
      const verified = /*caver object */Mason.authenticate(this.get('keystore'), this.get('password'));
      this.Set({caver: verified, isAuthorized: !!verified});
    } catch(e) { }
  }

  // 개인 인증을 PrivateKey로 선택했을 때
  handlePrivateKeyChange = ({target: {value}}) => this.set('privateKey', value);

  // 개인 인증을 로컬에 저장된 keystore(JSON) 파일로 선택했을 때
  authByPrivateKey = () => {
    try {
      const verified = Mason.privateKeyToAccount(this.get('privateKey'));
      this.Set({caver: verified, isAuthorized: !!verified});
    } catch(e) { }
  };

  signTransaction = () => {
    if(!this.get('isAuthorized')) return;

    const payload = {
      data: this.get('bytecode'),
      gas: this.get('gasLimit'),
      from: caver().klay.defaultAccount,
      value: '0x00'
    };
    Mason.signTransaction(payload)
    .then(R.tap(tx => console.log(JSON.stringify(tx))))
    .then(({rawTransaction}) => {
      this.Set({
          hasSigned: true,
          rawTransaction: Object.assign({}, payload, {to: null}),
          signedTransaction: rawTransaction
        });
    })
    .catch(e => {
      this.Set({hasSigned: false, rawTransaction: ''});
      console.log(e);
    });
  }

  deployContract = () => {
    Mason.sendSignedTransaction(this.get('signedTransaction'))
    .then(R.tap(tx => console.log(JSON.stringify(tx))))
    .then(({contractAddress, transactionHash}) => this.Set({contractAddress, transactionHash}))
    .then(this.enable('isContractDeployed'))
    .catch(console.log)
  };

  Klaytnscope = (type, addr) => `https://baobab.klaytnscope.com/api/${type}/${addr}`;

  render() {
    return (
      <Section>
        <ContainerWrap>
          <Container>
            <h2>Interact with Contract or Deploy Contract</h2>
            <Tabs className={styles.tabs}>
              <TabList className={styles.tabList}>
                <Tabss
                  className={styles.tab}
                  onClick={this.toggleAccessTab}>
                  Interact with Contract
                </Tabss>
                <Tabss
                  className={styles.tab}
                  onClick={this.toggleAccessTab}>
                  Deploy Contract
                </Tabss>
              </TabList>
              <div className={styles.description}>
                This site does not hold your keys for you. We cannot
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
                  {
                    (this.every('isAuthorized', 'gotDeployedContract')) && (
                    <input
                      className={styles.submit}
                      style={{ margin: 0 }}
                      type="submit"
                      value="Access"
                    />)
                  }
                </form>
              </TabPanel>
              <TabPanel className={styles.tabPanel}>
                <h3>Byte Code</h3>
                <form>
                  <textarea
                  className={this.get('validBytrecodeClassName')}
                  onChange={this.BytecodeChangeHandler}
                  type="text"
                  value={this.get('bytecode')}
                  />
                </form>
        <h3>Gas Limit</h3>
        <form
      //  onSubmit={this.handleSubmit}
        >
        <input
          className={styles.input}
          type="text"
          placeholder=""
          value={this.state.gasLimit}
          onChange={this.handleGasLimitChange}
        />
        {this.every('isAuthorized', 'hasBytecode') && (
            <input
              className={styles.submit}
              type="button"
              value="Sign Transaction"
              onClick={this.signTransaction}
            />
        )}
      </form>
        {this.every('isAuthorized', 'hasBytecode', 'hasSigned') && (
            <div>
            <div className={styles.transactionBox}>
            <form>
            <h3>Raw Transaction</h3>
            <textarea
              className={styles.textarea} type="text" value={JSON.stringify(this.get('rawTransaction'))}
              disabled
              onChange={() => void(0)}
            />
            </form>

            <form
          //  onSubmit={this.handleSubmit}
            >
            <h3>Signed Transaction</h3>
            <textarea
              className={styles.textarea} type="text" value={this.get('signedTransaction')}
              disabled
              onChange={() => void(0)}
            />
            </form>
            </div>
            <input
              className={styles.submit}
              style={{ margin: 0 }}
              type="submit"
              value="Deploy Contract"
              disabled={this.get('isContractDeployed')}
              onClick={this.deployContract}
            />
            </div>
        )}
              </TabPanel>
            </Tabs>
          </Container>
        </ContainerWrap>
        {this.every('isAuthorized', 'hasSigned', 'isContractDeployed') && (
          <DeploySuccess>
            <DeploySuccessDesc>
              <FontAweSomeWrap>
                <i className="fal fa-thumbs-up" />
              </FontAweSomeWrap>
              Your TX has been broadcast to the network.
              1) Check your TX below. <br />
              2) If it is pending for minutes or disappears, use the Check TX Status Page to replace. <br />
              3) Save your Transaction Hash in case you need it later: {this.get('transactionHash')} <br/>
              4) View your transaction & Contract Address: {this.get('contractAddress')}

              <FontAweSomeWrap onClick={this.resetAll}>
                <i className="fal fa-times-circle" />
              </FontAweSomeWrap>
            </DeploySuccessDesc>
          </DeploySuccess>
        )}
        {!this.get('isAuthorized') && (
          <ContainerWrap style={{ paddingTop: 0, paddingBottom: 60 }}>
            <ContainerBottom>
              <h2>Access Existing Account</h2>
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
                    <h3>Private Key or HRA Private Key</h3>
                    <input
                      className={styles.input}
                      style={{ marginBottom: 30 }}
                      onChange={this.handlePrivateKeyChange}
                    />
                    <input
                      className={styles.submit}
                      type="submit"
                      value="Access"
                      onClick={this.authByPrivateKey}
                    />
                  </TabPanel>
                  <TabPanel>
                    <h3>Import Keystore File (.json)</h3>
                    <input
                      type="file"
                      className={styles.file}
                      style={{ marginBottom: 30 }}
                      onChange={this.handleFileChange}
                    />
                    <h3>Password</h3>
                    <input
                      type="password"
                      className={styles.input}
                      onBlur={this.handlePasswordChange}
                    />
                    <input
                      className={styles.submit}
                      type="submit"
                      value="Access"
                      onClick={this.authByKeystore}
                    />
                  </TabPanel>
                </div>
              </Tabs>
            </ContainerBottom>
          </ContainerWrap>
        )}
      </Section>
    )
  }
}

export default Contract
