var inputActionHandler = {

  _getActionList(action) {
    if (!this.actions.hasOwnProperty(action)) {
      this.actions[action] = [];
    }
    return this.actions[action];
  },

  isActionPressed(action) {
    return this._getActionList(action).some(key => this.keys[key]);
  },

  demapKeyFromAction(key, action) {
    var keyList = this._getActionList(action);
    var index = keyList.indexOf(key);
    keyList.splice(index, 1);
  },

  mapKeyToAction(key, action) {
    this._getActionList(action).push(key);
  }
};

var fakeInputActionHandler = {
  isActionPressed(action) {
    return false;
  },

  demapKeyFromAction(key, action) {
  },

  mapKeyToAction(key, action) {
  }
};

var inputKeyHandler = {

  pressKey(key) {
    this.keys[key] = true;
  },

  releaseKey(key) {
    this.keys[key] = false;
  }
};

cwt.produceFakeInputHandler = function() {
  return fakeInputActionHandler;
};

cwt.produceInputHandler = function() {
  var keys = {};

  var actions = Object.assign(Object.create(inputActionHandler), {
    actions: {},
    keys
  });

  var keys = Object.assign(Object.create(inputKeyHandler), {
    keys
  });

  actions.mapKeyToAction("KB_13", "ACTION");

  cwt.produceKeyboardBackend(keys).bind();

  return actions;
};