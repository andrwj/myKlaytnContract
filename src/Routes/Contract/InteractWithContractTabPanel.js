import React from 'react';

import Accessor from './Accessor';
import ImportFunctionsButton from './ImportFunctionsButton';
import ReadWriteContract from './ReadWriteContract';

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
    return (
      <div>
        <h3 className={styles.h3}>Contact Address</h3>
        <form>
          <input
            className={styles.input}
            style={{ marginBottom: 30 }}
            type="text"
            value={this.props.contractAddress}
            onChange={this.props.onContractAddressChange}
            placeholder='0x1f30e4cAAAABBBBCCCCeeeefffFFFFBBBCCeefff'
          />
        </form>
        <h3 className={styles.h3}>ABI / JSON Interface</h3>
        <form>
          <textarea
            className={this.props.validABIClassName}
            onChange={this.props.onABIChanges}
            value={this.props.ABI_string}
            placeholder='[{ "type":"contructor", "inputs": [{ "name":"param1", "type":"uint256", "indexed":true }], "name":"Event" }, { "type":"function", "inputs": [{"name":"a", "type":"uint256"}], "name":"foo", "outputs": [] }] '
          />
          <ImportFunctionsButton
            visible={this.props.hasValidABI && this.props.hasValidContractAddress && this.props.isAuthorized}
            onClick={this.props.handleImportFunctions}
          />
        </form>
        <ReadWriteContract
          visible={this.props.isFunctionsImported && this.props.isAuthorized}
          contractAddress={this.props.contractAddress}
          ABI={this.props.ABI}
        />
      </div>
    )
  }
}

export default InteractWithContractTabPanel;