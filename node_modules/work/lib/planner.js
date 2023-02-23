import { Node, Job, Queue, Loop } from 'work'
import lodashGet from 'lodash.get'
import Emitter from 'obso'

class Planner extends Emitter {
  constructor (ctx) {
    super()
    this.services = {}
    this.ctx = ctx || this._createContext()
  }

  _createContext () {
    const planner = this
    const ctx = new Proxy({}, {
      get: function (target, prop) {
        planner.emit('ctx-read', prop, target[prop])
        return Reflect.get(...arguments)
      },
      set: function (target, prop, value) {
        planner.emit('ctx-write', prop, value)
        return Reflect.set(...arguments)
      }
    })
    return ctx
  }

  _getServiceFunction (plan) {
    const service = this.services[plan.service || 'default']
    const fn = service[plan.invoke]
    if (fn) {
      return fn.bind(service)
    } else {
      throw new Error('Could not find function: ' + plan.invoke)
    }
  }

  addService (...args) {
    const [name, service] = args.length === 1
      ? ['default', args[0]]
      : args
    const existingService = this.services[name]
    if (existingService) {
      Object.assign(existingService, service)
    } else {
      this.services[name] = service
    }
  }

  getLoopClass (plan) {
    const planner = this
    if (plan.type === 'job' && plan.invoke) {
      const fn = this._getServiceFunction(plan)
      return class LoopJob extends Job {
        constructor (options) {
          super(plan)
          if (plan.onFail) {
            this.onFail = planner.toModel(plan.onFail)
          }
        }

        fn (...args) {
          return fn(...args)
        }
      }
    } else if (plan.type === 'queue' && plan.queue) {
      return class LoopQueue extends Queue {
        constructor (options) {
          super(options)
          for (const item of plan.queue) {
            this.add(planner.toModel(item))
          }
        }
      }
    } else {
      const err = new Error('invalid plan item type: ' + plan.type)
      err.plan = plan
      throw err
    }
  }

  toModel (plan) {
    if (plan._process) {
      /* already a model */
      return plan
    } else {
      plan = Object.assign({}, plan)
    }

    if (!['job', 'queue', 'template', 'loop', 'factory'].includes(plan.type)) {
      const err = new Error('invalid plan item type: ' + plan.type)
      err.plan = plan
      throw err
    }

    if (plan.onFail) {
      plan.onFail = this.toModel(plan.onFail)
    }
    if (plan.onSuccess) {
      plan.onSuccess = this.toModel(plan.onSuccess)
    }

    let node

    if (plan.type === 'job' && plan.invoke) {
      plan.fn = this._getServiceFunction(plan)
      node = new Job(plan)
    } else if (plan.type === 'job' && plan.fn) {
      node = new Job(plan)
    } else if (plan.type === 'queue' && plan.queue) {
      node = new Queue(plan)
      for (const item of plan.queue) {
        node.add(this.toModel(item))
      }
    } else if (plan.type === 'template' && plan.template) {
      node = new Queue(plan)
      const items = Array.isArray(plan.repeatForEach)
        ? plan.repeatForEach
        : plan.repeatForEach()
      for (const i of items) {
        // TODO: insert in place, rather than appending to end of queue
        node.add(this.toModel(plan.template(i)))
      }
    } else if (plan.type === 'loop') {
      node = new Loop(plan)
      if (plan.for) {
        node.for = () => {
          const ofFn = lodashGet(this.ctx, plan.for.of)
          if (!ofFn) {
            throw new Error('of not found: ' + plan.for.of)
          }
          return {
            var: plan.for.var,
            of: typeof ofFn === 'function' ? ofFn() : ofFn
          }
        }
      }
      node.Node = this.getLoopClass(plan.node)
      if (plan.args) node.args = this.ctx[plan.args]
      if (plan.argsFn) node.argsFn = this.ctx[plan.argsFn]
    } else if (plan.type === 'factory' && plan.fn) {
      node = plan.fn()
      if ('args' in plan) {
        node.args = plan.args
      }
    } else if (plan.type === 'factory' && plan.invoke) {
      plan.fn = this._getServiceFunction(plan)
      node = plan.fn()
      Node.validate(node)
      if ('args' in plan) {
        node.args = plan.args
      }
    }

    if (plan.result) {
      node.on('successful', (target, result) => {
        if (target === node) {
          this.ctx[target._replaceScopeToken(plan.result)] = result
        }
      })
    }
    return node
  }
}

export default Planner
