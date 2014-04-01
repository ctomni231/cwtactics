/**
 *
 * @namespace
 */
cwt.Maps = {

  maps: [],

  loadMap: function (path, callback) {

    // register map path (as identifier)
    this.maps.push(path);

    cwt.Storage.mapStorage.get(path, function (obj) {

      // load it when the map isn't available in the storage
      if (!obj.value) {
        util.grabRemoteFile({
          path: path,
          json: true,

          error: function (msg) {
            throw Error("could not load map");
          },

          success: function (resp) {
            cwt.Storage.mapStorage.set(path, resp, function () {
              callback();
            });
          }
        });
      }
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