exports.sequence = function(fns, callback) {
  if (fns.length === 0){
    if( callback ) return callback();
    else return;
  }

  var completed = 0;
  var cbFn = function() {
    if (++completed == fns.length) {
      if (callback) {
        callback();
      }
    } else {
      iterate();
    }
  };

  var iterate = function() {
    fns[completed](cbFn);
  };

  iterate();
};