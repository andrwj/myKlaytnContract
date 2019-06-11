import React from 'react';
import * as R from 'ramda';

import ReactRadioButtonGroup from './react-radio-button-group';
import Accessor from './Accessor';
import { Either, tryCatch, identity,revoke, truth } from '@andrwj/fp';

import styles from './Contract.module.scss';

const inputStyle = {
  fontSize: '1.2em', width: '100%', padding: '0.5em',
  margin: '1em 0 1.5em 0', backgroundColor: '#ffffff',
  border: '1px solid #ccc'
};
const inputNameStyle = {fontWeight:600, fontSize: '1.2em'};
const inputTypeStyle = {fontWeight:300, fontSize: '1.2em'};

const commandFormId = 'formCommand1';
const lensTransactionHash = R.lensProp('transactionHash');

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
          ({name, value}) => {
            if(!value) throw new Error(`Empty value for parameter '${name}`);
            acc.push(value);
            },
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

  constructor(...args) {
    super(...args);
    this.state = {
      returnValue: '',
    };
  }

  execCommand (command) {
    if(!command) return;
    const {name:method, constant:isReadFunction} = command;
    const ARGS = buildArguments(document.getElementById(commandFormId).elements);
    const caver = this.$('caver')();
    const ABI = this.$('ABI')();
    const address =  this.$('contractAddress')();
    const owner = caver.klay.defaultAccount;
    const opts = {from: owner, /*fix for now*/gas: '15000000'};
    const KC = new caver.klay.Contract(ABI, address, opts);
    const interfaceCall = isReadFunction ? 'call' : 'send';

    this.$('infoBox')(`calling ${method}() ...`, 5000);

    Promise.resolve(opts)
      .then(KC.methods[method](...ARGS)[interfaceCall])
      .then(tx => {
        this.$('hideMessageBox')();
        const result = isReadFunction ? tx : R.view(lensTransactionHash, tx);
        console.log(`tx ==>`, result);
        this.setState({returnValue: result});
      })
      .catch(e => {
        this.$('hideMessageBox')();
        console.log(e);
        this.setState({returnValue: ''});
        this.$('warningBox')(`We got an exception while calling method '${method}()'. Please refer output of console.log`, 3000);
      });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.execCommand(this.props.command);
  };

  validate (t) {
    const type = Either
      .of(t=> t.indexOf('uint') === -1, t) //uint8, uint32, uint128, ...
      .fold(
        () => Either.right('number'),
        (t) => Either.of(t => ['string', 'bool', 'address'].find(supported => t.indexOf(supported)), t)
          .fold(
            (t) => {
              const message =`getValidator(${t}), and is not supported yet. Stop`;
              console.log(message);
              throw new Error(message);
              },
            (t) => Either.right(t)
          )
      ).fold(identity, identity);

    const validator = Validators(type);

    return (domEl) => {
      const {target: {value, name}} = domEl;
      // console.log(`got ${value} from ${name}`);

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

  handleCommandReturnValue = () => {
    // when selected command, constant=true, has no argument, execute it for displaying return value.
    this.setState({returnValue: ''});
    // const {command} = this.state;
    // Either.of(v=>v && !v.length, this.getFormInputElements(commandFormId))
    //   .chain(() => tryCatch(({constant})=> constant, command))
    //   .chain(tryCatch(this.execCommand, command));
  };

  // get DOM elements of 'input' tag in <form id={commandFormId}>
  getFormInputElements = (id=commandFormId) =>
    tryCatch(id => document.getElementById(id).elements, id)
      .fold(revoke, identity);


  render() {
    return (
      <div style={{margin:'2em 0 1em 0em'}} >
        <form id={commandFormId} onSubmit={this.submitHandler.bind(this)}>
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
                                             onChange={()=> void(0)}
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
              value={this.state.returnValue}
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
