//
//
controller.minimap_mapSelectionCanvas = document.getElementById("cwt_ingame_minimap_canvas");

//
//
controller.minimap_ingameCanvas = document.getElementById("cwt_ingame_minimap_canvas");

// Draws the minimap for a given map data to a canvas.
//
controller.minimap_drawToCanvas = function( canvas, mapData ){
  canvas.width  = model.map_width*4;
  canvas.height = model.map_height*4;
  
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  var x;
  var y;
  var xe = model.map_width;
  var ye = model.map_height;
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){      
      var type = model.map_data[x][y];
      if( type.assets.mmap4x_gfx ){
        var img = view.getInfoImageForType(type.assets.mmap4x_gfx[0]);
        ctx.drawImage(
          img,
          type.assets.mmap4x_gfx[1],0,4,4,
          x*4,y*4,4,4
        );
      } else{
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x*4,y*4,4,4);
      }
      
  }}
};
 
// Draws the minimap for a given map name to a canvas. This leads
// into an asynchron workflow. If blockInput is ture, then all 
// further inputs will be blocked until the minimap was generated
// successfully.
//
controller.minimap_drawToCanvasByMapName = function( canvas, mapName, blockInput ){
  if( blockInput ){
    
    // block new input requests until the map was converted into a minimap
    controller.input_requestBlock();
    controller.storage_maps.get( mapName, controller.minimap_loadWithBlock_ );
  } 
  else controller.storage_maps.get( mapName, controller.minimap_loadWithoutBlock_ );
};
 
//
//
controller.minimap_loadWithoutBlock_ = function( obj ){
  assert( obj.value );
  controller.minimap_drawToCanvas( controller.minimap_ingameCanvas, mapData );
};
 
//
//
controller.minimap_loadWithBlock_ = function( obj ){
  assert( obj.value );
  
  controller.minimap_drawToCanvas( controller.minimap_ingameCanvas, mapData );
  controller.input_releaseBlock();
};