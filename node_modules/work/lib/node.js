import StateMachine from 'fsm-base'
import CompositeClass from 'composite-class'
import mixInto from 'create-mixin'
import arrayify from 'array-back'
import lodashGet from 'lodash.get'

const _name = new WeakMap()
const _args = new WeakMap()

class Node extends mixInto(CompositeClass)(StateMachine) {
  constructor (options = {}) {
    super('pending', [
      { from: 'pending', to: 'in-progress' },
      { from: 'pending', to: 'skipped' },
      { from: 'in-progress', to: 'failed' },
      { from: 'in-progress', to: 'successful' },
      { from: 'pending', to: 'cancelled' },
      { from: 'in-progress', to: 'cancelled' }
    ])
    this.name = options.name
    this.args = options.args
    this.id = (Math.random() * 10e20).toString(16)
    /**
     * A function which returns the args.
     * Since a function is a valid arg, `this.args` could not be reused for this value too.
     * @type {funciton}
     */
    this.argsFn = options.argsFn

    /**
     * @type {node}
     */
    this.onFail = options.onFail

    /**
     * @type {RegExp}
     */
    this.onFailCondition = options.onFailCondition

    /**
     * @type {node}
     */
    this.onSuccess = options.onSuccess

    /**
     * @type {node}
     */
    this.finally = options.finally

    /**
     * Skip processing if true.
     * @type {boolean}
     */
    this.skipIf = options.skipIf

    /**
     * The _process implementation can be passed in as an option as a shortcut instead of subclassing Node and overriding _process.
     * TODO: Remove, this is sloppy.
     */
    if (options._process) this._process = options._process

    /**
     * Arbitrary data context for this node tree. Property value requests bubble up.
     * @type {object}
     */
    this.scope = new Proxy({}, {
      get: (target, prop) => {
        if (prop in target) {
          return Reflect.get(target, prop)
        } else if (this.parent) {
          return Reflect.get(this.parent.scope, prop)
        }
      },
      set: function (target, prop, value) {
        return Reflect.set(target, prop, value)
      }
    })
    Object.assign(this.scope, options.scope)
  }

  get global () {
    return this.root().scope
  }

  set global (val) {
    this.root().scope = val
  }

  get name () {
    return this._replaceScopeToken(_name.get(this))
  }

  set name (val) {
    _name.set(this, val)
  }

  get args () {
    const args = _args.get(this)
    return Array.isArray(args) && args.length
      ? args.map(arg => this._replaceScopeToken(arg))
      : args
  }

  set args (val) {
    _args.set(this, val)
  }

  add (node) {
    super.add(node)
    this.emit('add', node)
  }

  async process (...processArgs) {
    if (this.skipIf) {
      for (const node of this) {
        node.setState('skipped', node)
      }
    } else {
      Node.validate(this)
      const args = this._getArgs(processArgs)
      let result
      try {
        this.setState('in-progress', this)
        result = await this._process(...args)
        if (this.onSuccess) {
          if (!(this.onSuccess.args && this.onSuccess.args.length)) {
            this.onSuccess.args = [result, this]
          }
          this.add(this.onSuccess)
          result = await this.onSuccess.process()
        }
        this.setState('successful', this, result)
      } catch (err) {
        this.setState('failed', this)
        const processFail = !this.onFailCondition ||
          (this.onFailCondition && this.onFailCondition.test(err.message))
        if (this.onFail && processFail) {
          if (!(this.onFail.args && this.onFail.args.length)) {
            this.onFail.args = [err, this]
          }
          this.add(this.onFail)
          result = await this.onFail.process()
        } else {
          throw err
        }
      } finally {
        if (this.finally) {
          if (!(this.finally.args && this.finally.args.length)) {
            this.finally.args = [result, this]
          }
          this.add(this.finally)
          result = await this.finally.process()
        }
      }
      return result
    }
  }

  _process () {
    throw new Error('not implemented')
  }

  toString () {
    return `${this.name || this.invoke || this.fn.name}: ${this.state}`.replace(/^bound /, '')
  }

  tree () {
    return Array.from(this).reduce((prev, curr) => {
      const indent = '  '.repeat(curr.level())
      const line = `${indent}- ${curr}\n`
      return (prev += line)
    }, '')
  }

  /**
   * Return process, argsFn or args.
   */
  _getArgs (processArgs, argsFnArg) {
    return processArgs.length
      ? processArgs
      : this.argsFn
        ? arrayify(this.argsFn(argsFnArg))
        : arrayify(this.args)
  }

  _replaceScopeToken (str) {
    if (typeof str === 'string' && str) {
      if (/^•[a-zA-Z]/.test(str)) {
        return lodashGet(this.scope, str.replace('•', ''))
      } else if (/•{.*}/.test(str)) {
        str = str.replace('•{', '${scope.')
        const fn = new Function('scope', `return \`${str}\``)
        return fn(this.scope)
      } else if (/\${.*}/.test(str)) {
        const fn = new Function('scope', `return \`${str}\``)
        return fn(this.scope)
      } else {
        return str
      }
    } else {
      return str
    }
  }

  resetState () {
    super.resetState()
    for (const node of this) {
      if (node !== this) node.resetState()
    }
  }

  static validate (node) {
    if (!(node.process && node.on && node.id)) {
      throw new Error('not a Node instance: ' + node)
    }
    if (node.onFail && !(node.onFail instanceof Node)) {
      throw new Error('onFail must be a valid Node instance')
    }
  }
}

export default Node
