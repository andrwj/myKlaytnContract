import React from 'react';
import * as R from 'ramda';

import Accessor from './Accessor';
import RunConstantCommand from './RunConstantCommand';
import RunTxCommand from './RunTxCommand';

import { Either, tryCatch } from '../../FP/FP';

import styles from './Contract.module.scss';

const lensReturnType = R.lensPath(['outputs', 0, 'type']);
const lensInputs = R.lensProp('inputs');

class RunCommand extends Accessor {
  render() {
    if(!this.props.command) return '';

    return Either.of(cmd=> cmd.constant, this.props.command) //Right: constance, Left: non-constant
      .fold(
        (cmd) =>
          <RunTxCommand
            inputs={R.view(lensInputs, cmd)||[]}
            returnType={R.view(lensReturnType, cmd)}
            returnValue=''
            command={this.props.command}
          />
        ,
        (cmd) =>
           <RunConstantCommand
             inputs={R.view(lensInputs, cmd)||[]}
             returnType={R.view(lensReturnType, cmd)}
             returnValue=''
             command={this.props.command}
           />
      );
  }
}

export default RunCommand;