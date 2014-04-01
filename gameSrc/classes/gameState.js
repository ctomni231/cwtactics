/**
 *
 * @class
 */
cwt.GameState = my.Class({
  constructor: function (initFn, enterFn, exitFn, updateFn, renderFn, data ) {
    this.data = data;
    this.init = initFn;
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});