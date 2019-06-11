import React from 'react';
import { withRouter } from 'react-router-dom';
import Router from 'Components/Router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled from 'styled-components';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import * as R from 'ramda';
import { Either, tryCatch } from '../../FP/FP';
import * as utils from '../../Utils/index';
import * as Mason from '../../Utils/mason';
import Accessor, {handler} from './Accessor';

import styles from './Contract.module.scss';
import TransactionSignButton from "./TransactionSignButton";
import InteractWithContractTabPanel from "./InteractWithContractTabPanel";
import TransactionBox from './TransactionBox';
import AccountBox from './AccountBox';
import TxResultBox from "./TxResultBox";
import MessageBox from "./MessageBox";

library.add(faThumbsUp);

const { caver, baobabNetwork } = Mason;

const defaultValues = {
  showDeployContractTab: true,
  showSignButton: false,
  isAuthorized: false,
  hasBytecode: false,
  hasSigned: false,
  hasValidABI: false,
  hasValidContractAddress: false,
  isContractDeployed: false,
  gotDeployedContract: false,
  isFunctionsImported: false,
  validDataClassName: styles.textarea,
  validABIClassName: styles.textarea,
  bytecode: '',
  abi_string: '',
  ABI: '',
  gasLimit: 0,
  password: '',
  privateKey: '',
  rawTransaction: '',
  signedTransaction: '',
  caver: null, // in case ...
  contractAddress: '',
  transactionHash: '',
  showMessageBox: false,
  message:'',
  MessageBoxType: 'info',
};

class Contract extends Accessor {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultValues);
    caver(baobabNetwork());
  }

  caver = (url)  => caver(url);
  ABI = () => this.state.ABI;
  contractAddress = () => this.state.contractAddress;

  toggleAccessTab = () => this.toggle([false, true], 'showDeployContractTab');
  resetAll = () => {
    //window.location.reload();
    this.setState(Object.assign({}, defaultValues, {isAuthorized: true}));
  };

  // bytecode를 통해 컨트랙을 생성 > TEXTAREA에 bytecode를 넣을 경우
  BytecodeChangeHandler = ({ target: { value } }) => {
    const bytecode = String(value).trim();
    if (bytecode.length > 256 && utils.isValidHexString(bytecode)) {
      Mason.estimateGas({data:bytecode, to:Mason.whoami()})
        .then(this.set('gasLimit'))
        .then(this.enable('hasBytecode'))
        .then(this.sethunk('bytecode', bytecode))
        .then(
          this.sethunk(
            'validDataClassName',
            `${styles.textarea} validate-ok`
          )
        )
        .catch(e => {
          this.setState({
            gasLimit: 0,
            hasBytecode: false,
            bytecode: '',
            validDataClassName: styles.textarea
          });
        });
    } else {
      this.setState({
        gasLimit: 0,
        hasBytecode: false,
        bytecode: '',
        hasSigned: false,
        validDataClassName: styles.textarea,
      });
      this.warningBox(`Invalid Byte Codes.`);
    }
  };

  // 사용자가 bytecode의 gasLimit값을 직접 수정해서 넣었을 경우
  // TODO: validation check
  handleGasLimitChange = ({ target: { value } }) => this.set('gasLimit', value);

  // 사용자의 PC에 저장된 Keystore (JSON) 파일을 읽어 들일 때
  // TODO: 상황별 가이드라인
  handleFileChange = ({
    target: {
      files: [path]
    }
  }) => {
    const fileReader = new FileReader();
    fileReader.readAsText(path);
    fileReader.onload = ({ target: { result } }) => {
      try {
        this.setState({keystore: Mason.getKeystoreFromString(result)});
        // focus on password input field
      } catch (event) {
        console.log(JSON.stringify(event));
        this.warningBox(`Error while reading keystore file. Please refer console.log output`);
      }
    };
  }

  // 사용자의 PC에 저장된 Keystore (JSON) 파일을 읽어 들인 후, 비밀번호 입력할 때
  // TODO: focus 떠날 때 값을 받을 것
  handlePasswordChange = ({ target: { value } }) => this.set('password', value);

  authByKeystore = () => {
    try {
      const verified = /*caver object */ Mason.authenticate(
        this.get('keystore'),
        this.get('password')
      );
      this.setState({ caver: verified, isAuthorized: !!verified });
      this.infoBox(`Account on BaobabNetwork: ${Mason.whoami()}`, 2000);
    } catch (e) {
      this.warningBox(`Failed to authenticate. Wrong Password?`, 2000);
      console.log(e);
    }
  };

  // 개인 인증을 PrivateKey로 선택했을 때
  handlePrivateKeyChange = ({ target: { value } }) =>
    this.set('privateKey', value);

  // 개인 인증을 로컬에 저장된 keystore(JSON) 파일로 선택했을 때
  authByPrivateKey = () => {
    try {
      const verified = Mason.privateKeyToAccount(this.get('privateKey'));
      this.setState({ caver: verified, isAuthorized: !!verified });
      this.infoBox(`Account on BaobabNetwork: ${Mason.whoami()}`, 1000);
    } catch (e) {
      this.setState({isAuthorized:false});
      this.warningBox(`Failed to authenticate. Invalid Private Key?`);
    }
  };

  signTransaction = () => {
    if (!this.get('isAuthorized')) return;
    const changes = {
      data: this.get('bytecode'),
      gas: this.get('gasLimit'),
      from: caver().klay.defaultAccount,
      value: '0x00'
    };
    Mason.signTransaction(changes)
      .then(R.tap(tx => console.log(JSON.stringify(tx))))
      .then(({ rawTransaction }) => {
        this.setState({
          hasSigned: true,
          rawTransaction: Object.assign({}, changes, { to: null }),
          signedTransaction: rawTransaction
        });
      })
      .catch(e => {
        this.warningBox(e);
        this.setState({ hasSigned: false, rawTransaction: '' });
      });
  };

  deployContract = () => {
    this.infoBox('Deploying signed contract ...');
    Mason.sendSignedTransaction(this.get('signedTransaction'))
      .then(R.tap(tx => console.log(JSON.stringify(tx))))
      .then(({ contractAddress, transactionHash }) => {
        this.hideMessageBox();
        this.setState({ contractAddress, transactionHash });
      })
      .then(this.enable('isContractDeployed'))
      .catch(e => {
        console.log(e);
        this.warningBox(`Deploy failed. Please refer output in console.log`)
          .then(this.resetAll);
      });
  };

  Klaytnscope = (type, addr) => `https://baobab.klaytnscope.com/${type}/${addr}`;
  hideMessageBox = () => this.setState({showMessageBox: false});
  infoBox = (message, msec=3000) => {
    this.hideMessageBox();
    this.setState({showMessageBox: true, message, MessageBoxType: 'info'});
    return utils.sleep(msec).then(this.hideMessageBox);
  };
  warningBox = (message, msec=3000) => {
    this.hideMessageBox();
    this.setState({showMessageBox: true, message, MessageBoxType: 'warning'});
    return utils.sleep(msec).then(this.hideMessageBox);
  };

  handleABIChanges = ({ target: { value } }) => {
    // ABI 문자열을 Eval()을 통해 객체화 한다
    // eslint-disable-next-line no-eval
    tryCatch(eval, value)
      .filter(v => Array.isArray(v))
      .map(evaluated =>
        evaluated.map(spec =>
          spec.type === 'constructor' ?
            Object.assign({}, spec, {value: 'constructor', label:'constructor'}) :
            Object.assign({}, spec, {value: spec.name, label:spec.name})
        ))
      .fold(
        () => {
          this.setState({
            ABI: null,
            abi_string: value,
            hasValidABI: false,
            validABIClassName: `${styles.textarea}` });
          this.infoBox(`Invalid ABI. Please use valid ABI definition`);
        },
        (evaluated) => {
          this.setState({
            ABI: evaluated,
            abi_string: value,
            hasValidABI: true,
            validABIClassName: `${styles.textarea} validate-ok` })
        });
  };

  handleImportFunctions = () => {
    if(!(this.state.hasValidContractAddress && this.state.hasValidABI)) return false;

    this.setState({isFunctionsImported: true});
  };

  handleContractAddress = ({ target: { value } }) => {
      Either.of(address => /^0x[0-9a-fA-F]{40}$/.test(address), value)
        .fold((address) => {
            this.setState({
              contractAddress: address,
              hasValidContractAddress: false,
            });
            this.infoBox(`Invalid Contract Address.`);
          },
          (address) => {
            this.setState({
              contractAddress: address,
              hasValidContractAddress: true,
            });
          });
  };

  render() {
    return (
      <section className={styles.section}>
        <div className={styles.containerWrap}>
          <div className={styles.container}>
            <h2 className={styles.h2}>
              Interact with Contract or Deploy Contract
            </h2>
            <Tabs className={styles.tabs}>
              <TabList className={styles.tabList}>
                <Tab className={styles.tab} onClick={this.toggleAccessTab}>
                  Deploy Contract
                </Tab>
                <Tab className={styles.tab}  onClick={this.toggleAccessTab}>
                    Interact with Contract
                </Tab>
              </TabList>
              <div className={styles.description}>
                This site does not hold your keys for you. We cannot access
                accounts, recover keys, reset passwords, nor reverse
                transactions. Protect your keys & always check that you are on
                correct URL. You are responsible for your security.
              </div>
              <TabPanel className={styles.tabPanel}>
                <h3 className={styles.h3}>Byte Code</h3>
                <form>
                  <textarea
                    className={this.get('validDataClassName')}
                    onChange={this.BytecodeChangeHandler}
                    type="text"
                    value={this.get('bytecode')}
                  />
                </form>
                <h3 className={styles.h3}>Gas Limit</h3>
                <form>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder=""
                    value={this.state.gasLimit}
                    onChange={this.handleGasLimitChange}
                  />
                  <TransactionSignButton
                    visible={this.every('isAuthorized', 'hasBytecode')}
                    disabled={this.some('isContractDeployed', 'hasSigned')}
                    onClick={handler(this, this.signTransaction)}
                  />
                </form>
                <TransactionBox
                  visible={this.every('isAuthorized', 'hasBytecode', 'hasSigned')}
                  rawTransaction={this.get('rawTransaction')}
                  signedTransaction={this.get('signedTransaction')}
                  disabled={this.get('isContractDeployed')}
                  onClick={handler(this, this.deployContract)}
                />
              </TabPanel>
              <TabPanel className={styles.tabPanel}>
                <InteractWithContractTabPanel
                  ABI={this.state.ABI}
                  ABI_string={this.state.abi_string}
                  visible={!this.state.showDeployContractTab}
                  validABIClassName={this.state.validABIClassName}
                  hasValidABI={this.state.hasValidABI}
                  hasValidContractAddress={this.state.hasValidContractAddress}
                  handleImportFunctions={this.handleImportFunctions}
                  contractAddress={this.state.contractAddress}
                  onABIChanges={this.handleABIChanges}
                  onContractAddressChange={this.handleContractAddress}
                  isFunctionsImported={this.state.isFunctionsImported}
                  isAuthorized={this.state.isAuthorized}
                  warningBox={this.warningBox}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <MessageBox
          visible={this.state.showMessageBox}
          message={this.state.message}
          type={this.state.MessageBoxType}
          onClick={handler(this, this.hideMessageBox)}
        />
        <TxResultBox
          visible={this.every('isAuthorized', 'hasSigned', 'isContractDeployed')}
          onClick={handler(this, this.resetAll)}
          transactionHash={this.state.transactionHash}
          contractAddress={this.state.contractAddress}
          Klaytnscope={handler(this, this.Klaytnscope)}
        />
        <AccountBox
          handlePrivateKeyChange={handler(this, this.handlePrivateKeyChange)}
          authByPrivateKey={handler(this, this.authByPrivateKey)}
          handleFileChange={handler(this, this.handleFileChange)}
          handlePasswordChange={handler(this, this.handlePasswordChange)}
          authByKeystore={handler(this, this.authByKeystore)}
          visible={!this.state.isAuthorized}
        />
      </section>
    );
  }
}

export default Contract;

