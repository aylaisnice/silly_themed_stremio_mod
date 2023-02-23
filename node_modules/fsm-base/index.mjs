import Emitter from 'obso/index.mjs'
import arrayify from 'array-back'

/**
 * @module fsm-base
 * @typicalname stateMachine
 */

const _initialState = new WeakMap()
const _state = new WeakMap()
const _validMoves = new WeakMap()

/**
 * @alias module:fsm-base
 * @extends {Emitter}
 */
class StateMachine extends Emitter {
  /**
   * @param {string} - Initial state, e.g. 'pending'.
   * @param {object[]} - Array of valid move rules.
   */
  constructor (initialState, validMoves) {
    super()
    _validMoves.set(this, arrayify(validMoves).map(move => {
      move.from = arrayify(move.from)
      move.to = arrayify(move.to)
      return move
    }))
    _state.set(this, initialState)
    _initialState.set(this, initialState)
  }

  /**
   * The current state
   * @type {string} state
   * @throws `INVALID_MOVE` if an invalid move made
   */
  get state () {
    return _state.get(this)
  }

  set state (state) {
    this.setState(state)
  }

  /**
   * Set the current state. The second arg onward will be sent as event args.
   * @param {string} state
   */
  setState (state, ...args) {
    /* nothing to do */
    if (this.state === state) return

    const validTo = _validMoves.get(this).some(move => move.to.indexOf(state) > -1)
    if (!validTo) {
      const msg = `Invalid state: ${state}`
      const err = new Error(msg)
      err.name = 'INVALID_MOVE'
      throw err
    }

    let moved = false
    const prevState = this.state
    _validMoves.get(this).forEach(move => {
      if (move.from.indexOf(this.state) > -1 && move.to.indexOf(state) > -1) {
        _state.set(this, state)
        moved = true
        /**
         * fired on every state change
         * @event module:fsm-base#state
         * @param state {string} - the new state
         * @param prev {string} - the previous state
         */
        this.emit('state', state, prevState)

        /**
         * fired on every state change
         */
        this.emit(state, ...args)
      }
    })
    if (!moved) {
      const froms = _validMoves.get(this)
        .filter(move => move.to.indexOf(state) > -1)
        .map(move => move.from.map(from => `'${from}'`))
        .flat()
      const msg = `Can only move to '${state}' from ${froms.join(' or ') || '<unspecified>'} (not '${prevState}')`
      const err = new Error(msg)
      err.name = 'INVALID_MOVE'
      throw err
    }
  }

  /**
   * Reset to initial state.
   * @emits "reset"
   */
  resetState () {
    const prevState = this.state
    const initialState = _initialState.get(this)
    _state.set(this, initialState)
    this.emit('reset', prevState)
  }
}

export default StateMachine
