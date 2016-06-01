cwt.produceDataBuffer = function(handler) {
  const buffer = [];

  return {

    pushData(msg) {
      buffer.push(msg);
    },

    evaluateData() {
      if (buffer.length > 0) {
        handler(buffer.shift());
        return true;
      }
      return false;
    }
  };
};