import React from 'react';
import Select from 'react-select'; //https://react-select.com/styles

import Accessor from './Accessor';
import RunCommand from './RunCommand';

import styles from './Contract.module.scss';

class ReadWriteContract extends Accessor {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

  handleChange = selected => {
    this.setState({ selected });
    console.log(selected);
  };

  render() {
    // if(!this.props.visible) return '';
    const { selected } = this.state;
    return (

      <div style={{marginTop: '3em'}}>
        <h3 className={styles.h3}>Read/Write Contract</h3>
        <div style={{margin:'1em 0' }}>
          <span style={{fontSize: '1.2em', fontWeight: 600}}>{this.props.contractAddress}</span>
        </div>
        <Select
          isSearchable={true}
          value={selected}
          onChange={this.handleChange}
          options={this.props.ABI||[]}
          placeholder='Select a function'
          // styles={{container: () => ({width: `500px`, fontSize: '1.2em'})}}
        />
        <RunCommand
          command={this.state.selected}
        />
      </div>
    )
  }
}

export default ReadWriteContract;