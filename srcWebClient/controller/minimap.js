// The canvas for the map selection mini map.
//
controller.minimap_mapSelectionCanvas = document.getElementById("cwt_versus_minimap_canvas");

// The canvas for the ingame mini map.
//
controller.minimap_ingameCanvas = document.getElementById("cwt_ingame_minimap_canvas");

// The container element for the ingame mini map canvas.
//
controller.minimap_ingameBlend = document.getElementById("cwt_ingame_minimap_blend");

// Shows the mini map container in the game round screen.
//
controller.minimap_showIngameMinimap = function(){
  var blend = controller.minimap_ingameBlend.style;
  var cvEl = controller.minimap_ingameCanvas;
  var cv = cvEl.style;

  // render it
  controller.minimap_renderMinimap_(
    cvEl,
    model.map_width,
    model.map_height,
    model.map_data,
    null,
    true
  );

  // show it
  blend.display = "block";
  cv.display = "block";
  cv.left = parseInt( (controller.screenWidthPx/2)-(cvEl.width/2) , 10 )+"px";
  cv.top = parseInt( (controller.screenHeightPx/2)-(cvEl.height/2) , 10 )+"px";
};

// Hides the mini map container in the game round screen.
//
controller.minimap_hideIngameMinimap = function(){
  var blend = controller.minimap_ingameBlend.style;
  var cv = controller.minimap_ingameCanvas.style;

  // hide it
  blend.display = "none";
  cv.display = "none";
};

// Draws the minimap. 
//
controller.minimap_renderMinimap_ = function(canvas,w,h,map,typeMap,biggerMap){
  var img = view.getInfoImageForType( (biggerMap)? "MINIMAP4X" : "MINIMAP2X" );
  var base = (biggerMap)? 4:2;

  // 1. set size
  canvas.width  = w*base;
  canvas.height = h*base;
  
  // 2. remove old stuff
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // 3. render all 
  var x;
  var y;
  var xe = w;
  var ye = h;
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){      

      // 3.1. tiles first
      var type = (typeMap)? model.data_tileSheets[ typeMap[ map[x][y] ] ] : map[x][y];
      if( type.assets.mmap4x_gfx !== void 0 ){
        
        ctx.drawImage(
          img,
          type.assets.mmap4x_gfx*base,0,
          base,base,
          x*base,y*base,
          base,base
        );

      } else{

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x*base,y*base,base,base);
      }
      
  }}
};

// Draws the map selection mini map. The data will be extracted 
// from the given mapData which is a loaded map file data model.
//
controller.minimap_renderMapSelectionMinimap = function( mapData ){
  var cv = controller.minimap_mapSelectionCanvas;

  controller.minimap_renderMinimap_(
    cv,
    mapData.mpw,
    mapData.mph,
    mapData.map,
    mapData.typeMap,
    ( mapData.mph <= MAX_MAP_HEIGHT/2 && mapData.mpw <= MAX_MAP_WIDTH )
  );

  cv.style.top =  "calc(50% - "+parseInt( (cv.height/2) , 10 )+"px)";
};