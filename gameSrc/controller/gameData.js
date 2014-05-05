/**
 * @namespace
 */
cwt.GameData = {

  /**
   *
   */
  saveGame: (function () {
    var caller = cwt.createModuleCaller("$onSaveGame");
    return function (name, callback) {
      var dom = {};
      caller(dom);

      // save object model
      cwt.Storage.mapStorage.set(name, JSON.stringify(dom), callback);
    };
  })(),

  /**
   * Sets the game model to a state that represents the given save game object.
   *
   * @param name
   * @param isSave
   * @param callback
   */
  loadGame: (function () {
    var caller = cwt.createModuleCaller("$onLoadGame");
    return function (name, isSave, callback) {
      if (typeof name === "string") {
        cwt.Storage.mapStorage.get(name, function (obj) {
          cwt.assert(obj.value);
          caller(JSON.parse(obj.value), isSave);
          callback();
        });
      } else {
        caller(name, isSave);
        callback();
      }
    };
  })()

};