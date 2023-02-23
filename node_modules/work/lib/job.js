/** ⏏ Job
 * Module exporting the Job class.
 */
import Node from './node.js'

/** ♺ Job ⇐ Node
 * Define a job to run later. A Job is a Node which when processed executes a function.
 */
class Job extends Node {
  /** ▪︎ Job()

  • [options] :object
  • [options.fn] :function
  • [options.result] :string
  */
  constructor (options = {}) {
    super(options)
    if (options.fn) {
      /** ▪︎ job.fn
       * The command to execute. Required.
       */
      this.fn = options.fn
    }
    if (options.result) {
      /** ▪︎ job.result
       * Write result to this scope key.
       */
      this.result = options.result
    }
    this.type = 'job'
  }

  async _process (...args) {
    return this.fn(...args)
  }
}

export default Job
