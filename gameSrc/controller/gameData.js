/**
 * @namespace
 */
cwt.GameData = {

  save: function () {
    var dom = {};

    cwt.Gameround.save(dom);
    cwt.Map.save(dom);

    return JSON.stringify(dom);
  },

  load: function (dom) {
    cwt.Gameround.load(dom);
  },

  prepare: function (dom) {
    cwt.Gameround.prepare(dom);
    cwt.Map.prepare(dom);
  }

};