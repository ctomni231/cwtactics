/**
 *
 * @namespace
 */
cwt.Maps = {

  maps: [],

  grabFromLive: function (callback) {
    var stuff = [];

    Object.keys(cwt.mapList).forEach(function (key) {
      stuff.push(function (next) {
        grabRemoteFile({
          path: cwt.MOD_PATH + cwt.mapList[key],
          json: true,

          error: function (msg) {
            throw Error("could not load map");
          },

          success: function (resp) {
            cwt.Storage.mapStorage.set(key, resp, function () {
              next();
            });
          }
        });
      });
    });

    callAsSequence(stuff, function () {
      delete cwt.Maps.grabFromLive;
      callback();
    });
  },

  loadMap: function (path, callback) {
    cwt.Storage.mapStorage.get(path, function (obj) {
      callback(key, obj.value);
    });
  },

  grabMetaDataFromMap: function () {
    /*

     var props;
     for( var i = 0; i < btns.length; i++ ){
     canvases[i].width = 16;
     canvases[i].height = 32;
     var ctx = canvases[i].getContext("2d");
     ctx.clearRect(0,0,16,32);
     if( mapData === null || types === null || i >= types.length ){
     btns[i].innerHTML = "&#160;";
     }else{
     if( !props ) props = mapData.prps;
     var n = 0;
     var type = types[i];
     for( var j = 0; j < props.length; j++){
     if( props[j][3] === type ) n++;
     };
     btns[i].innerHTML = n;
     ctx.drawImage(
     view.getPropertyImageForType( type, view.COLOR_NEUTRAL ),
     0,0,
     16,32,
     0,0,
     16,32
     );
     }
     };
     */
  }

};