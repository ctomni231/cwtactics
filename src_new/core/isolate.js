const generatePipeKey = function(name) {
  return "_MSGH_" + name + "_";
};

cwt.connectMessagePusher = function(pipeName) {
  const pipeHandlerKey = generatePipeKey(pipeName);
  return function() {
    cwt[pipeHandlerKey].apply(null, arguments);
  };
};

cwt.connectMessageHandler = function(pipeName, onMessage) {
  cwt[generatePipeKey(pipeName)] = onMessage;
};