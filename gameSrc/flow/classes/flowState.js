//
//
// @class
//
cwt.GameState = my.Class({
  constructor: function (enterFn, exitFn, updateFn, renderFn, data ) {

    // data
    this.data = data;

    // handler
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});