/**
 * Command stack of Custom Wars: Tactics.
 */
cwt.CommandStack = {
  
  /**
   * Current read position.
   */
  curReadPos_: 0,

  /**
   * Current write position.
   */
  curWritePos_: 0,

  /**
   * Command buffer.
   */
  buffer_: cwt.list( (1 + 6) * ACTIONS_BUFFER_SIZE, INACTIVE_ID ),

  /**
   * 
   */
  resetData: function () {
    this.buffer_.resetValues();
    this.curReadPos_ = 0;
    this.curWritePos_ = 0;
  },

  /**
   * 
   */
  hasData: function () {
    return this.curReadPos_ !== this.curWritePos_;
  },

  /**
   * 
   */
  invokeNext: function () {
    assert(this.hasData());

    // write content
    var i = this.curReadPos_ * (6 + 1);
    var e = i + 6 + 1;
    var data = this.buffer_;
    var event = model.event_eventName[data[i]];

    if (DEBUG) {
      console.log(
        "invoke", event, "with arguments",
        data[i + 1],
        data[i + 2],
        data[i + 3],
        data[i + 4],
        data[i + 5],
        data[i + 6]
      );
    }

    // invoke event with given data
    model.events[event](
      data[i + 1],
      data[i + 2],
      data[i + 3],
      data[i + 4],
      data[i + 5],
      data[i + 6]
    );

    // free slot
    data[i] = INACTIVE_ID;

    // increase writing index
    controller.commandStack_curReadPos++;
    if (controller.commandStack_curReadPos >= ACTIONS_BUFFER_SIZE) {
      controller.commandStack_curReadPos = 0;
    }
  },

  /**
   * Adds a command to the command pool. Every parameter of the call will be
   * submitted beginning from index 1 of the arguments. The maximum amount
   * of parameters are controlled by the controller (3).commandStack_MAX_PARAMETERS
   * property. Anyway every parameter should be an integer to support intelligent
   * JIT compiling. The function throws a warning if a parameter type does not
   * match, but it will be accepted anyway ** ( for now! ) **.
   */
  localInvokement: function (cmd) {
    assertStr(cmd);
    assertIntRange(arguments.length, 1, 7);

    // write content
    var offset = this.curWritePos_ * (6 + 1);
    var i = 0;
    var e = 7;

    assert(this.buffer_[i + offset] === INACTIVE_ID);
    this.buffer_[i + offset] = model.event_eventIndex[cmd]; //TODO to number
    i++;

    while (i < e) {
      if (DEBUG && arguments.length > i && typeof arguments[i] !== "number") {
        util.log("!! warning !! used a command invocation with non numeric types on command", cmd);
      }

      this.buffer_[i + offset] = (arguments.length > i) ?
        arguments[i] : INACTIVE_ID;

      i++;
    }

    if (DEBUG) {
      console.log("adding", JSON.stringify(arguments), "to the command stack");
    }

    // increase writing index
    this.curWritePos_++;
    if (this.curWritePos_ >= ACTIONS_BUFFER_SIZE) {
      this.curWritePos_ = 0;
    }
  },

  /**
   * Invokes a shared command call. All clients gets a notification of this
   * call and doing the same locally. This invokes a local call too, to realize
   * the activation of the action.
   */
  sharedInvokement: function (cmd) {
    if (controller.network_isActive()) {
      controller.network_sendMessage(JSON.stringify(arguments));
    }
    
    this.localInvokement.apply(this, arguments);
  },

  /**
   *
   * @param fn
   * @return {Function}
   */
  sharedFunction: function( fn ){
    var nFn = function () {

    };

    nFn.originalFn = fn;

    return fn;
  }

};