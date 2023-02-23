/** ⏏ Placeholder */

import Node from './node.js'

/** ♺ Placeholder ⇐ Node
 *
 */
class Placeholder extends Node {
  /** ▪︎ Placeholder()

  • [options] :object
  • [options.factory] :function
  */
  constructor (options = {}) {
    super(options)
    this.type = 'placeholder'
    if (options.factory) {
      /** ▪︎ placeholder.factory
       */
      this.factory = options.factory
    }
    this.node = null
  }

  async _process (...args) {
    this.node = this.factory(...args)
    return this.node.process()
  }
}

export default Placeholder
