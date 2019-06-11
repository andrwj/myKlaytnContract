import React from 'react';
import ReactRadioButtonGroup from './react-radio-button-group';
import Accessor from './Accessor';
import { Either } from '../../FP/FP';

import styles from './Contract.module.scss';

const inputStyle = {
  fontSize: '1.2em', width: '100%', padding: '0.5em',
  margin: '1em 0 1.5em 0', backgroundColor: '#ffffff',
  border: '1px solid #ccc'
};
const inputNameStyle = {fontWeight:600, fontSize: '1.2em'};
const inputTypeStyle = {fontWeight:300, fontSize: '1.2em'};

class RunTxCommand extends Accessor {

  render() {
    console.log(this.props.inputs);

    return (
      <div style={{margin:'2em 0 1em 0em'}} >
          {this.props.inputs.map((input,idx) =>
            <div key={String(idx)}>
              <span style={inputNameStyle}>{input.name}</span>&nbsp;&nbsp;<span style={inputTypeStyle}>{input.type}</span>
              {
                 Either.of(t => t === 'bool', input.type)
                  .fold(
                    () => <input style={inputStyle} />,
                    () => (
                      <ReactRadioButtonGroup name={input.name}
                                             options={['False', 'True']}
                                             isStateful={true}
                                             value='False'
                                             onChange={(item) => console.log("New value: ", item)}
                                             groupClassName={styles.radioBG_Group}
                                             itemClassName={styles.radioBG_Item}
                                             labelClassName={styles.radioBG_Label}
                                             inputClassName={styles.radioBG_Input} >
                      </ReactRadioButtonGroup>
                    )
                  )
              }
            </div>
          )}
        <div style={{margin:'2em 0 1em 2em'}} >
          <span style={{fontWeight:600, fontSize: '1.5em'}} >↳</span>&nbsp;&nbsp;<span style={{fontWeight:300, fontSize: '1.2em'}}>{this.props.returnType}</span>
          <input
            style={inputStyle}
            disabled={true}
            value={this.props.returnValue}
          />
        </div>
        <input
          className={styles.submit}
          style={{ margin: '2em 0 0 0' }}
          type="button"
          value="Write"
        />
      </div>
    );
  }
}

export default RunTxCommand;
