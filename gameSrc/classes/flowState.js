/**
 *
 * @class
 */
cwt.GameState = my.Class({
  constructor: function (enterFn, exitFn, updateFn, renderFn, data ) {
    this.data = data;
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});