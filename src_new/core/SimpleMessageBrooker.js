class SimpleMessageBrooker {

  constructor() {
    this.topics = {};
  }

  _getTopic(topic) {
    if (Types.isNothing(this.topics[topic])) {
      this.topics[topic] = [];
    }
    return this.topics[topic];
  }

  subscribe(topic, handler) {
    Require.isString(topic);
    Require.isFunction(handler);

    this._getTopic(topic).push(handler);
  }

  sendMessage(topic, data) {
    Require.isString(topic);

    var handlers = this._getTopic(topic);
    for (var i = 0; i < handlers.length; i++) {
      handlers[i](data || null);
    }
  }
}
