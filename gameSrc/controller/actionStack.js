/**
 * Action stack of Custom Wars: Tactics.
 *
 * @namespace
 */
cwt.ActionStack = {

  /**
   * Pool for holding {cwt.ActionData} objects when they aren't in the buffer.
   *
   * @type {cwt.CircularBuffer.<cwt.ActionData>}
   */
  actionDataPool: new cwt.CircularBuffer(200),

  /**
   * Buffer object.
   *
   * @type {cwt.CircularBuffer.<cwt.ActionData>}
   */
  buffer: new cwt.CircularBuffer(200),

  /**
   * Resets the buffer object.
   */
  resetData: function () {
    while (this.hasData()) {
      this.actionDataPool.push(this.buffer.pop());
    }
  },

  /**
   * Returns true when the buffer has elements else false.
   */
  hasData: function () {
    return !this.buffer.isEmpty();
  },

  /**
   *
   */
  invokeNext: function () {
    var data = this.buffer.pop();
    if (cwt.DEBUG) cwt.assert(data);

    if (cwt.DEBUG) {
      cwt.log(data);
    }

    // TODO invoke it

    // pool used object
    data.reset();
    this.actionDataPool.push(data);
  },

  /**
   * Adds a command to the command pool. Every parameter of the call will be submitted beginning from index 1 of the
   * arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
   * Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
   * a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
   *
   * @param {boolean} local will the command only invoked locally
   * @param {number} id identical number of the used action
   * @param {number} p1 parameter 1
   * @param {number} p2 parameter 2
   * @param {number} p3 parameter 3
   * @param {number} p4 parameter 4
   * @param {number} p5 parameter 5
   */
  pushCommand: function (local, id, p1, p2, p3, p4, p5) {
    var data = this.actionDataPool.pop();

    // inject data
    data.id = id;
    data.p1 = p1;
    data.p2 = p2;
    data.p3 = p3;
    data.p4 = p4;
    data.p5 = p5;

    // send command over network
    if (!local && cwt.Network.isActive()) {
      cwt.Network.sendMessage(cwt.ActionData.toJSON(data));
    }

    this.buffer.push(data);
  }
};
