import * as R from 'ramda';

export const applyChanges = (self) => (...args) => self.setState(
          Object
            .entries(args)
            .map(([k,v]) => ({[k]:v}))
            .reduce((acc, el)=>Object.assign(acc, el))
        );

export const isValidHexString = function (s) {
  const arg = String(s).trim();
  if (!arg.length) return false;
  const bytecodes = arg.substring(0, 2) === '0x' ? arg.substring(2).toUpperCase() : arg.toUpperCase();
  const re = /^[0-9A-F]+$/g;
  return re.test(bytecodes);
};

export const sleep = (msec) => new Promise((resolv, reject) => setTimeout(() => resolv(msec), msec));

export const toggleClassName = (cls, target) => (String(cls).indexOf(target) === -1) ? `${cls} ${target}` : String(cls).replace(target, '').trim();

export const IfElse = (f, onTrue, onFalse) => f ? onTrue : onFalse;

export default {

}
