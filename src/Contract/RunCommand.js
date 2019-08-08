import React from 'react';
import * as R from 'ramda';

import ReactRadioButtonGroup from './react-radio-button-group';
import Accessor from './Accessor';
import { Either, identity } from '@andrwj/fp';

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
    .filter(({name}) => ['submit', 'result'].some(n => name !== n)) // 두개의 이름 제외
    .filter(({disabled}) => !disabled) // disabled 된 항목도 제외
    .filter(({type}) => ['text', 'radio'].some(t => type === t)) // text 또는 라디오버튼 항목만 처리
    .reduce((acc, el) => {
      Either
        .of(el, ({type}) => type==='radio')
        .fold(
          ({value, checked})=>{ // Right: radio
            // if(checked) acc.push({name, 'value': (value.toLowerCase()==='true'), type: 'bool'})
            if(checked) acc.push(value.toLowerCase()==='true');
          },
          // ({name, value, dataset:{type}}) => acc.push({name, value, type}),
          ({name, value}) => { // Left: text
            if(!String(value).trim().length) throw new Error(`Empty value for parameter '${name}`);
            acc.push(value);
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
        .fold(
          () => [true, 'ok'],
          ()=>[false, 'Please use at least one character.']
        );
    } ,
    'number': (v) => {
      return Either
        .fromNullable(v)
        .map(v => (v).trim())
        .filter(v => v.length)
        .filter(v => !/\D/.test(v))
        .filter(v => v.length < 65)
        .fold(
          () => [true, 'ok'],
          ()=>[false, 'Please use only number characters (0-9).']
        );
    },
    'address': (v) => {
      return Either
        .fromNullable(v)
        .map(v => String(v).trim())
        .filter(v => v.length)
        .filter(address => /^0x[0-9a-fA-F]{40}$/.test(address))
        .fold(
          () => [true, 'ok'],
          ()=>[false, 'Please use valid address for Klaytn Network.']
        );
    },
    'bool': () =>  [true, 'ok'],
    'unsupported': (t) => [false, `Type '${t}' is not supported yet. Stop`],
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
    const ARGS = Either.try(
        () => buildArguments(document.getElementById(commandFormId).elements)
    ).fold(
      identity,
      e => {
        console.log(e.message);
        this.$('warningBox')(`${e.message}`, 3000);
        return null;
      });

    if(!ARGS) return;
    const caver = this.$('caver')();
    const ABI = this.$('ABI')();
    const address =  this.$('contractAddress')();
    const owner = caver.klay.defaultAccount;
    const opts = {from: owner, /*fix for now*/gas: '15000000'};
    const KC = new caver.klay.Contract(ABI, address, opts);
    const interfaceCall = isReadFunction ? 'call' : 'send';

    // 'call()' 함수의 처리결과가 너무 빨리 넘어오기 때문에 메세지 박스가 껌뻑이는 것 처럼 보여서 좋지않다.
    if(!isReadFunction) this.$('infoBox')(`calling ${method}() ...`, 5000);

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
        console.log(e.message);
        this.setState({returnValue: ''});
        this.$('warningBox')(`${e.message}`,  3000);
      });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.execCommand(this.props.command);
  };

  validate (t) {
    // supported type: 'number', 'address', 'string', 'bool'
    // 'uint8, uint16, .. uint128 => 'number'
    // otherwise, 'unsupported'
    const isSupportable  = value => ['string', 'address', 'bool'].find(type => value.indexOf(type) !== -1);
    const type = Either.doneIf(  isSupportable, t)
      .throwIf(x => x.indexOf('uint') !==-1, 'number')
      .done('unsupported')
      .catch()
      .take();

    const validator = Validators(type);
    const validationOf = (value) => Either.of(value, ([ok]) => ok);

    return (domEl) => {
      const {target: {value, /* name */ }} = domEl;
      // console.log(`got ${value} from ${name}`, validator(value));

      return validationOf(validator(value))
        .fold(
          () => true,
          ([,message]) => {
            this.$('warningBox')(message);
            domEl.target.value = '';
            this.forceUpdate();
            return false;
          }
        );
    };
  };

  getButtonTitle = () => {
    if(!this.props.command) return ' Please select function ';
    return this.props.command.constant ? 'Read' : 'Write';
  };

  handleCommandReturnValue = () => {
    // TODO: <Select> 컴포넌트에서 실행할 함수를 선택하면 이전 결과값을 없애는 역활을 함.
    this.setState({returnValue: ''});
  };

  render() {
    return (
      <div style={{margin:'2em 0 1em 0em'}} >
        <form id={commandFormId} onSubmit={this.submitHandler.bind(this)}>
          {this.props.inputs.map((input,idx) =>
            <div key={String(idx)}>
              <span style={inputNameStyle}>{input.name}</span>&nbsp;&nbsp;<span style={inputTypeStyle}>{input.type}</span>
              {
                Either.of(input.type, t => t === 'bool')
                  .fold(
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
                    ),
                    () => <input style={inputStyle} name={input.name} type='text' data-type={input.type} onChange={this.validate(input.type)}/>
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
