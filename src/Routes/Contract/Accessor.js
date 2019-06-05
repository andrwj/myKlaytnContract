import React, {Component} from 'react';
import * as R from 'ramda';

class Accessor extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    const changes = Object.entries(props)
      .filter( ([k, v]) => v !== this.props[k])
      .map(([k, v]) => ({[k]: v}))
      .reduce((acc, el) => Object.assign(acc, el), {});
    this.setState(changes);

  }
  every = (...args) => args.every(name => !!this.state[name]);
  some = (...args) => args.some(name => !!this.state[name]);
  get = (name) => this.state[name];
  sethunk = R.curry((name, value, _) => this.setState({[name]: value}));
  gethunk = R.curry((name, _) => this.state[name]);
  enable = R.curry((name, _) => this.setState({[name]: true}));
  disable = R.curry((name, _) => this.setState({[name]: false}));
  stringify = () => JSON.stringify(this.state);
  log = (prefix) => console.log(`${prefix} ${this.stringify()}`);
  property = (name,value) => Object.is(value, undefined) ? this.props[name] : this.props[name] = value;
  set = R.curry((name, value) =>
    Object.is(value, undefined)
      ? this.state[name]
      : this.setState({[name]: value})
  );
  toggle = R.curry((values, name) =>
    this.setState({
      [name]: values[1 - (Object.is(!!this.state[name], true) ? 1 : 0)]
    })
  );

}

// export const attach = (scope, from, ...methods) => methods.reduce((mixin, m)=> { mixin[m] = from[m]; return mixin}, scope);
// export const attachAll = (scope, from=methods) => Object.entries(from).reduce((mixin, [k, v]) => { mixin[k]=v; return mixin}, scope);

export const handler = (scope, f) => f.bind(scope);
export default Accessor;
