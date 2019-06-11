import React from 'react';
import Select from 'react-select'; //https://react-select.com/styles
import * as R from 'ramda';

import Accessor from './Accessor';
import RunCommand from './RunCommand';
import { sleep, revoke } from '@andrwj/fp/FP';

import styles from './Contract.module.scss';

const lensReturnType = R.lensPath(['outputs', 0, 'type']);
const lensInputs = R.lensProp('inputs');

class ReadWriteContract extends Accessor {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  handleMethodSelectBoxChange = selected => {
    this.setState({ selected });
    // when selected command to run, call child method to update return value.
    sleep(0).then(() => this.$('handleCommandReturnValue')()).catch(revoke);
  };

  selectedMethod = () => this.state.selected;

  render() {
    if(!this.props.visible) return '';

    const { selected } = this.state;

    return (

      <div style={{marginTop: '3em'}}>
        <h3 className={styles.h3}>Read/Write Contract</h3>
        <div style={{margin:'1em 0' }}>
          <span style={{fontSize: '1.2em', fontWeight: 600}}>{this.props.contractAddress}</span>
        </div>
        <Select
          isSearchable={true}
          value={selected||{}}
          onChange={this.handleMethodSelectBoxChange}
          options={this.props.ABI||[]}
          placeholder='Select a function'
          // styles={{container: () => ({width: `500px`, fontSize: '1.2em'})}}
        />
        <RunCommand
          inputs={R.view(lensInputs, selected)||[]}
          returnType={R.view(lensReturnType, this.state.selected)}
          command={this.state.selected}
        />
      </div>
    )
  }
}

export default ReadWriteContract;