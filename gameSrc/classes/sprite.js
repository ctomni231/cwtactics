/**
 * @class
 */
cwt.Sprite = my.Class({
  constructor: function () {
    this.images = [];
  },

  getImage: function (type) {
    return this.images[type];
  }
});