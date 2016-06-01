cwt.produceEventHandler = function() {
  const handlers = {};

  const getHandler = function(key) {
    if (!handlers.hasOwnProperty(key)) {
      handlers[key] = [];
    }
    return handlers[key];
  };

  return {
    publish(key, p1, p2, p3, p4, p5) {
      if (!key) {
        cwt.raiseError("IllgalEvent");
      }
      getHandler(key).forEach(handler => handler(p1, p2, p3, p4, p5));
      getHandler("*").forEach(handler => handler(key, p1, p2, p3, p4, p5));
    },

    subscribe(key, handler) {
      getHandler(key).push(handler);
    }
  }
};