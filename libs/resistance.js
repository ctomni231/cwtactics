/*!
  * Resistance - A javascript flow controller
  * v1.3.2
  * https://github.com/jgallen23/resistance
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('R', function() {

var instant = function(fn) {
  setTimeout(fn, 0);
};

var runSeries = function(fns, callback) {
  if (fns.length === 0) return callback();
  var completed = 0;
  var data = [];
  var iterate = function() {
    fns[completed](function(results) {
      data[completed] = results;
      if (++completed == fns.length) {
        // this is preferred for .apply but for size, we can use data
        if (callback) callback.apply(data, data);
      } else {
        iterate();
      }
    });
  };
  iterate();
};

var runParallel = function(fns, callback) {
  if (fns.length === 0) return callback();
  var started = 0;
  var completed = 0;
  var data = [];
  var iterate = function() {
    fns[started]((function(i) {
      return function(results) {
        data[i] = results;
        if (++completed == fns.length) {
          if (callback) callback.apply(data, data);
          return;
        }
      };
    })(started));
    if (++started != fns.length) iterate();
  };
  iterate();
};

var queue = function(fn, series) {
  var q = [];
  return {
    push: function(obj) {
      if (obj instanceof Array) {
        for (var i = 0, c = obj.length; i < c; i++) {
          var item = obj[i];
          this.push(item);
        }
      } else {
        q.push(function(cb) {
          fn(obj, cb);
        });
      }
    },
    run: function(cb) {
      if (!series)
        runParallel(q, cb);
      else
        runSeries(q, cb);
    },
    clear: function() {
      q = [];
    }
  };
};

var R = {
  series: runSeries,
  parallel: runParallel,
  queue: queue
};

return R;
});