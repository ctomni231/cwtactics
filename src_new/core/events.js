var eventHandler = {

  _getHandler(key) {
    if (!this.handlers) this.handlers = {};
    if (!this.handlers.hasOwnProperty(key)) this.handlers[key] = [];
    return this.handlers[key];
  },

  publish(key, p1, p2, p3, p4, p5) {
    if (!key) {
      cwt.raiseError("IllgalEvent");
    }
    this._getHandler(key).forEach(handler => handler(p1, p2, p3, p4, p5));
    this._getHandler("*").forEach(handler => handler(key, p1, p2, p3, p4, p5));
  },

  subscribe(key, handler) {
    this._getHandler(key).push(handler);
  }
};

cwt.produceEventHandler = function() {
  return Object.create(eventHandler);
};