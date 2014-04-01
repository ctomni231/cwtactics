/**
 * Action stack of Custom Wars: Tactics.
 *
 * @namespace
 */
cwt.ActionStack = {

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
   *
   * @type {Array.<cwt.ActionData>}
   */
  buffer_: /* self calling function */ (function () {
    var MAX_COMMAND_ENTRIES = 200;
    var arr = [];

    while (arr.length < MAX_COMMAND_ENTRIES) {
      arr.push(new cwt.ActionData());
    }

    return arr; /* arr will be put into buffer_ */
  })(),

  /**
   *
   */
  resetData: function () {
    var n = 0;
    while (n < this.buffer_.length) {
      this.buffer_[n].reset();
      n++;
    }
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
    cwt.assert(this.hasData());

    // write content
    var i = this.curReadPos_ * (6 + 1);
    var e = i + 6 + 1;
    var data = this.buffer_;
    var event = model.event_eventName[data[i]];

    if (this.DEBUG) {
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

    // invoke event with given aw2
    model.events[event](
      data[i + 1],
      data[i + 2],
      data[i + 3],
      data[i + 4],
      data[i + 5],
      data[i + 6]
    );

    // free slot
    data[i] = cwt.INACTIVE;

    // increase writing index
    controller.commandStack_curReadPos++;
    if (controller.commandStack_curReadPos >= ACTIONS_BUFFER_SIZE) {
      controller.commandStack_curReadPos = 0;
    }
  },

  /**
   * Adds a command to the command pool. Every parameter of the call will be
   * submitted beginning from index 1 of the arguments. The maximum amount
   * of parameters are controlled by the controller.commandStack_MAX_PARAMETERS
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

    cwt.assert(this.buffer_[i + offset] === cwt.INACTIVE);
    this.buffer_[i + offset] = model.event_eventIndex[cmd]; //TODO to number
    i++;

    while (i < e) {
      if (this.DEBUG && arguments.length > i && typeof arguments[i] !== "number") {
        util.log("!! warning !! used a command invocation with non numeric types on command", cmd);
      }

      this.buffer_[i + offset] = (arguments.length > i) ?
        arguments[i] : cwt.INACTIVE;

      i++;
    }


    if( !action.clientAction && isNetwork ) {
      network.send(action.toJSON());
    }


    if (this.DEBUG) {
      console.log("adding", JSON.stringify(arguments), "to the command stack");
    }

    // increase writing index
    this.curWritePos_++;
    if (this.curWritePos_ >= ACTIONS_BUFFER_SIZE) {
      this.curWritePos_ = 0;
    }
  }

};