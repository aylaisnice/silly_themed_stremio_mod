import Planner from './planner.js'

class Work {
  /**
   * @param {object} options
   */
  constructor (options) {
    this.name = 'Work'
    this.ctx = undefined // proxy, monitor read and writes via traps
    this.planner = new Planner()
    /**
     * Required model to process.
     */
    this.model = null
  }

  addService (...args) {
    this.planner.addService(...args)
  }

  setPlan (plan) {
    this.model = this.planner.toModel(plan)
  }

  async process () {
    return this.model.process()
  }
}

export default Work
