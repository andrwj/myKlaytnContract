import React from 'react';
import * as R from 'ramda';

import ReactRadioButtonGroup from './react-radio-button-group';
import Accessor from './Accessor';
import { Either } from '../../FP/FP';
import * as Mason from '../../Utils/mason';

import styles from './Contract.module.scss';

const inputStyle = {
  fontSize: '1.2em', width: '100%', padding: '0.5em',
  margin: '1em 0 1.5em 0', backgroundColor: '#ffffff',
  border: '1px solid #ccc'
};
const inputNameStyle = {fontWeight:600, fontSize: '1.2em'};
const inputTypeStyle = {fontWeight:300, fontSize: '1.2em'};

let instanceId = 0;

const buildArguments = (/*DOM collection object*/inputs) => {
  return [...inputs]
    .filter(({name}) => ['submit', 'result'].some(n => name !== n))
    .filter(({type}) => ['text', 'radio'].some(t => type === t))
    .filter(({disabled}) => !disabled) //disabled 필드 제외
    .reduce((acc, el) => {
      Either
        .of(({type}) => type==='radio', el)
        .fold(
          // ({name, value, dataset:{type}}) => acc.push({name, value, type}),
          ({value}) => acc.push(value),
          ({value, checked})=>{
            // if(checked) acc.push({name, 'value': (value.toLowerCase()==='true'), type: 'bool'})
            if(checked) acc.push(value.toLowerCase()==='true');
          }
        );
      return acc;},[]);
};

const Validators = R.curry((type, value) => {
  return {
    'string': (v) => {
      return Either
        .fromNullable(v)
        .map(v => String(v).trim())
        .filter(v => v.length)
        .fold(()=>[false, 'Please use at least one character.'],
          () => [true, 'ok']);
    } ,
    'number': (v) => {
      return Either
        .fromNullable(v)
        .map(v => (v).trim())
        .filter(v => v.length)
        .filter(v => !/\D/.test(v))
        .filter(v => v.length < 65)
        .fold(()=>[false, 'Please use only number characters (0-9).'],
          () => [true, 'ok']);
    },
    'address': (v) => {
      return Either
        .fromNullable(v)
        .map(v => (v).trim())
        .filter(v => v.length)
        .filter(address => /^0x[0-9a-fA-F]{40}$/.test(address))
        .fold(()=>[false, 'Please use valid address for Klaytn Network.'],
          () => [true, 'ok']);
    },
  }[type](value);
});

class RunCommand extends Accessor {

  constructor(args) {
    super(args);
    this.state = {

    };
    this.id = instanceId++;
  }

  execCommand (event) {
    event.preventDefault();
    console.log('this:', this);

      const {id} = event.target;
      const {name:method} = this.props.command;
      const ARGS = buildArguments(document.getElementById(id).elements);
      const caver = this.$('caver')();
      const ABI = this.$('ABI')();
      const address =  this.$('contractAddress')();
      const owner = caver.klay.defaultAccount;
      const opts = {from: owner, gasPrice: '25000000000000'};
      const KC = new caver.klay.Contract(ABI, address, opts);
      KC.methods[method](...ARGS).call(opts)
        .then(console.log)
        .catch(console.log);
  };

  validate (t) {
    const type = Either
      .of(v => v === 'string', t)
      .fold((v) => Either
        .of(v => v.indexOf('uint') !== -1, v)
        .fold((v) => {
            const message =`getValidator(${v}), and is not supported yet. Stop`;
            console.log(message);
            throw new Error(message);
          }, () => 'number')
      , () => 'string'
      );

    const validator = Validators(type);

    return (domEl) => {
      const {target: {value, name}} = domEl;
      console.log(`got ${value} from ${name}`);

      return Either
        .of(([ok, ]) => ok, validator(value))
        .fold(
          ([,message]) => {
            this.$('warningBox')(message);
            return false;
          },
          () => true,
        );
    };
  };

  getButtonTitle = () => {
    if(!this.props.command) return ' Please select function ';
    return this.props.command.constant ? 'Read' : 'Write';
  };

  render() {
    console.log(this.props.inputs);

    return (
      <div style={{margin:'2em 0 1em 0em'}} >
        <form id={`formCommand${this.id}`} onSubmit={this.execCommand.bind(this)}>
          {this.props.inputs.map((input,idx) =>
            <div key={String(idx)}>
              <span style={inputNameStyle}>{input.name}</span>&nbsp;&nbsp;<span style={inputTypeStyle}>{input.type}</span>
              {
                 Either.of(t => t === 'bool', input.type)
                  .fold(
                    () => <input style={inputStyle} name={input.name} type='text' data-type={input.type} onChange={this.validate(input.type)}/>,
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
              name='result'
              type='text'
              style={inputStyle}
              disabled={true}
              value={this.props.returnValue}
            />
          </div>
          <input
            name="submit"
            className={styles.submit}
            style={{ margin: '2em 0 0 0' }}
            type="submit"
            disabled={!this.props.command}
            value={this.getButtonTitle()}
          />
        </form>
      </div>
    );
  }
}

export default RunCommand;
