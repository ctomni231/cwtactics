var commandPool = {
  pushData(msg) {
    this.buffer.push(msg);
  },

  evaluateData() {
    if (this.buffer.length > 0) {
      this.handler(this.buffer.shift());
      return true;
    }
    return false;
  }
};

cwt.produceDataBuffer = function(dataHandler) {
  return Object.assign(Object.create(commandPool), {
    buffer: [],
    handler: dataHandler
  });
};