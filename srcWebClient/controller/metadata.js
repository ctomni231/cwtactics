//
//
controller.metadata_TYPES = {
  SIZE_X:0,
  SIZE_Y:1,
  NUM_PROPERTIES:2,
  MAX_PLAYER:3
};

//
//
controller.metadata_grabFromMapData = function( mapData, btns, types ){
  var props;
  for( var i = 0; i < btns.length; i++ ){
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
    }
  };
};