//
//
controller.minimap_mapSelectionCanvas = document.getElementById("cwt_ingame_minimap_canvas");

//
//
controller.minimap_ingameCanvas = document.getElementById("cwt_ingame_minimap_canvas");

//
//
controller.minimap_ingameBlend = document.getElementById("cwt_ingame_minimap_blend");

//
//
controller.minimap_showIngameMinimap = function(){
  var blend = controller.minimap_ingameBlend.style;
  var cvEl = controller.minimap_ingameCanvas;
  var cv = cvEl.style;

  // render it
  controller.minimap_renderIngameMinimap();

  // show it
  blend.display = "block";
  cv.display = "block";
  cv.left = parseInt( (controller.screenWidthPx/2)-(cvEl.width/2) , 10 )+"px";
  cv.top = parseInt( (controller.screenHeightPx/2)-(cvEl.height/2) , 10 )+"px";
};

//
//
controller.minimap_hideIngameMinimap = function(){
  var blend = controller.minimap_ingameBlend.style;
  var cv = controller.minimap_ingameCanvas.style;

  // hide it
  blend.display = "none";
  cv.display = "none";
};

// Draws the ingame minimap.
//
controller.minimap_renderIngameMinimap = function(){
  var canvas = controller.minimap_ingameCanvas;

  // 1. set size
  canvas.width  = model.map_width*4;
  canvas.height = model.map_height*4;
  
  // 2. remove old stuff
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // 3. render all 
  var x;
  var y;
  var xe = model.map_width;
  var ye = model.map_height;
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){      

      // 3.1. tiles first
      var type = model.map_data[x][y];
      if( type.assets.mmap4x_gfx !== void 0 ){
        var img = view.getInfoImageForType("MINIMAP4X");
        
        ctx.drawImage(
          img,
          type.assets.mmap4x_gfx*4,0,4,4,
          x*4,y*4,4,4
        );

      } else{

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x*4,y*4,4,4);
      }
      
  }}
};

//
//
controller.minimap_renderMapMinimap = function( mapData ){

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