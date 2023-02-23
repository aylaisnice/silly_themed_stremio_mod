[![view on npm](https://badgen.net/npm/v/fsm-base)](https://www.npmjs.org/package/fsm-base)
[![npm module downloads](https://badgen.net/npm/dt/fsm-base)](https://www.npmjs.org/package/fsm-base)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/75lb/fsm-base)](https://github.com/75lb/fsm-base/network/dependents?dependent_type=REPOSITORY)
[![Gihub package dependents](https://badgen.net/github/dependents-pkg/75lb/fsm-base)](https://github.com/75lb/fsm-base/network/dependents?dependent_type=PACKAGE)
[![Node.js CI](https://github.com/75lb/fsm-base/actions/workflows/node.js.yml/badge.svg)](https://github.com/75lb/fsm-base/actions/workflows/node.js.yml)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# fsm-base

```js
const StateMachine = require('fsm-base')

class Stateful extends StateMachine {
  constructor () {
    super([
      { from: undefined, to: 'one' },
      { from: 'one', to: 'two' },
      { from: 'two', to: 'three' },
      { from: [ 'one', 'three' ], to: 'four'}
    ])
  }
}
const instance = new Stateful()
instance.state = 'one'  // valid state change
instance.state = 'two'  // valid state change
instance.state = 'four' // throws - invalid state change
```

<a name="module_fsm-base"></a>

## fsm-base

* [fsm-base](#module_fsm-base)
    * [StateMachine](#exp_module_fsm-base--StateMachine) ⇐ <code>Emitter</code> ⏏
        * [new StateMachine(initialState, validMoves)](#new_module_fsm-base--StateMachine_new)
        * [.state](#module_fsm-base--StateMachine+state) : <code>string</code>
        * [.setState(state)](#module_fsm-base--StateMachine+setState)
        * [.resetState()](#module_fsm-base--StateMachine+resetState)
        * ["state" (state, prev)](#module_fsm-base--StateMachine+event_state)

<a name="exp_module_fsm-base--StateMachine"></a>

### StateMachine ⇐ <code>Emitter</code> ⏏
**Kind**: Exported class  
**Extends**: <code>Emitter</code>  
<a name="new_module_fsm-base--StateMachine_new"></a>

#### new StateMachine(initialState, validMoves)

| Param | Type | Description |
| --- | --- | --- |
| initialState | <code>string</code> | Initial state, e.g. 'pending'. |
| validMoves | <code>Array.&lt;object&gt;</code> | Array of valid move rules. |

<a name="module_fsm-base--StateMachine+state"></a>

#### stateMachine.state : <code>string</code>
The current state

**Kind**: instance property of [<code>StateMachine</code>](#exp_module_fsm-base--StateMachine)  
**Throws**:

- `INVALID_MOVE` if an invalid move made

<a name="module_fsm-base--StateMachine+setState"></a>

#### stateMachine.setState(state)
Set the current state. The second arg onward will be sent as event args.

**Kind**: instance method of [<code>StateMachine</code>](#exp_module_fsm-base--StateMachine)  

| Param | Type |
| --- | --- |
| state | <code>string</code> | 

<a name="module_fsm-base--StateMachine+resetState"></a>

#### stateMachine.resetState()
Reset to initial state.

**Kind**: instance method of [<code>StateMachine</code>](#exp_module_fsm-base--StateMachine)  
**Emits**: <code>event:&quot;reset&quot;</code>  
<a name="module_fsm-base--StateMachine+event_state"></a>

#### "state" (state, prev)
fired on every state change

**Kind**: event emitted by [<code>StateMachine</code>](#exp_module_fsm-base--StateMachine)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>string</code> | the new state |
| prev | <code>string</code> | the previous state |


* * *

&copy; 2015-21 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
