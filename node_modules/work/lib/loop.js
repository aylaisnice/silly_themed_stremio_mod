import { Queue } from 'work'

class Loop extends Queue {
  /**
  • [options]      :object
  • [options.for]  :function - A function which returns `{ var: string, of: iterable }`.
  • [options.Node] :Node     - Node to create for each item yielded by the iterable.
  */
  constructor (options = {}) {
    super(options)
    this.type = 'loop'
    this.for = options.for
    /**
     * A new instance will be created on each iteration.
     */
    this.Node = options.Node
  }

  async _process (...fnArgs) {
    if (this.for) {
      const { var: varName, of: iterable } = await this.for()
      for (const i of iterable) {
        const node = new this.Node()
        this.add(node)
        node.scope[varName] = i
        const args = this._getArgs(fnArgs, i)
        node.args = node.args || args
      }
    }
    return super._process()
  }
}

export default Loop
