var timestamp = function() {
  return new Date().toISOString().slice(11, -2);
};

exports.log = function(msg) {
  console.log("[" + timestamp() + "] " + msg);
};