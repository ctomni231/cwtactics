/**
 * @class
 */
cwt.FogMap = my.Class({

  constructor: function () {

    /**
     * Vision map
     *
     * @type {Array.<Array<Number>>}
     */
    this.data = cwt.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT);

    /**
     * Player id's that will be visible
     *
     * @type {Array.<Boolean>}
     */
    this.pids = cwt.list(MAX_PLAYER);
  },

  isPlayerVisible: function(player){

  }

});