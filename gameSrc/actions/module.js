//
// Action stack of Custom Wars: Tactics.
//
// @namespace
//
cwt.Action = {

  //
  // Map actions are called in the idle state on the map.
  //
  // @constant
  //
  MAP_ACTION: 0,

  //
  // Unit actions are called on units.
  //
  // @constant
  //
  UNIT_ACTION: 1,

  //
  // Property actions are called on properties.
  //
  // @constant
  //
  PROPERTY_ACTION: 2,

  //
  // Engine actions are callable by the engine itself.
  //
  // @constant
  //
  ENGINE_ACTION: 3,

  //
  //
  //
  // @constant
  //
  CLIENT_ACTION: 4,

  //
  // Pool for holding {cwt.ActionData} objects when they aren't in the buffer.
  //
  // @type {cwt.CircularBuffer.<cwt.ActionData>}
  //
  actionDataPool: new cwt.CircularBuffer(200),

  //
  // Buffer object.
  //
  // @type {cwt.CircularBuffer.<cwt.ActionData>}
  //
  buffer: new cwt.CircularBuffer(200),

  //
  // List of all available actions.
  //
  actions: {},

  $afterLoad: function() {
    Object.seal(this.actions);
  },

  //
  //
  //
  registerAction_: function(name, impl) {
    var action = new cwt.ActionClass(impl);
    this.actions_[name] = action;
  },

  //
  //
  // @param impl
  //
  unitAction: function(impl) {
    impl.type = this.UNIT_ACTION;
    this.registerAction_(impl.key, impl);
  },

  //
  //
  // @param impl
  //
  propertyAction: function(impl) {
    impl.type = this.PROPERTY_ACTION;
    this.registerAction_(impl.key, impl);
  },

  //
  //
  // @param impl
  //
  mapAction: function(impl) {
    impl.type = this.MAP_ACTION;
    this.registerAction_(impl.key, impl);
  },

  //
  //
  // @param impl
  //
  clientAction: function(impl) {
    impl.type = this.CLIENT_ACTION;
    this.registerAction_(impl.key, impl);
  },

  //
  //
  // @param impl
  //
  engineAction: function(impl) {
    impl.type = this.ENGINE_ACTION;
    this.registerAction_(impl.key, impl);
  },

  //
  // @return {Array}
  //
  getActionNames: function() {
    return Object.keys(this.actions_);
  },

  //
  // Resets the buffer object.
  //
  resetData: function() {
    while (this.hasData()) {
      this.actionDataPool.push(this.buffer.pop());
    }
  },

  //
  // Returns true when the buffer has elements else false.
  //
  hasData: function() {
    return !this.buffer.isEmpty();
  },

  //
  //
  //
  invokeNext: function() {
    var data = this.buffer.popFirst();

    if (cwt.DEBUG) cwt.assert(data);
    if (cwt.DEBUG) console.log(data);

    // TODO invoke it

    // pool used object
    data.reset();
    this.actionDataPool.push(data);
  },

  //
  // Adds a command to the command pool. Every parameter of the call will be submitted beginning from index 1 of the
  // arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
  // Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
  // a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
  //
  pushCommand: function(local, id, num1, num2, num3, num4, num5) {
    var data = this.actionDataPool.pop();

    // inject data
    data.id = id;
    data.p1 = num1;
    data.p2 = num2;
    data.p3 = num3;
    data.p4 = num4;
    data.p5 = num5;

    // send command over network
    if (!local && cwt.Network.isActive()) {
      cwt.Network.sendMessage(cwt.ActionData.toJSON(data));
    }

    this.buffer.push(data);
  }
};
