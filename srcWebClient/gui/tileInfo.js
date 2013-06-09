util.scoped(function(){
  
  var elements = {
    BOX: document.getElementById( ID_ELMT_TILEINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_TILEINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_TILEINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_TILEINFOBOX_DESC),
    
    DEFENSE: document.getElementById( ID_ELMT_TILEINFOBOX_DEFENSE),
    CAPPT: document.getElementById( ID_ELMT_TILEINFOBOX_CAPPT),
    OWNER: document.getElementById( ID_ELMT_TILEINFOBOX_OWNER),
    
    DEFENSE_D: document.getElementById( ID_ELMT_TILEINFOBOX_DEFENSE_D),
    OWNER_D: document.getElementById( ID_ELMT_TILEINFOBOX_OWNER_D),
    CAPPT_D: document.getElementById( ID_ELMT_TILEINFOBOX_CAPPT_D)
  }
  
  controller.showTileInfo = function(){
    if( controller.tileInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var type = model.map[x][y];
    var prop = model.propertyPosMap[x][y];
    if( prop !== null ) type = prop.type;
    
    if( DEBUG ) util.log("show tile information screen");
    
    // BASE
    elements.NAME.innerHTML = model.localized( type.ID );
    elements.DEFENSE.innerHTML = type.defense;
    elements.DEFENSE_D.innerHTML = model.localized( "DEFENSE" );
    
    elements.CAPPT_D.innerHTML = model.localized( "CAPTURE_PT" );
    elements.CAPPT.innerHTML = ( prop !== null )? prop.capturePoints : "-";
    
    elements.OWNER_D.innerHTML = model.localized( "OWNER" );
    elements.OWNER.innerHTML = ( prop !== null )? model.players[prop.owner].name : "-";
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.tileInfoVisible = true;
  };
  
  controller.tileInfoVisible = false;
  
  controller.hideTileInfo = function(){
    if( !controller.tileInfoVisible ) return;
    if( DEBUG ) util.log("hide tile information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.tileInfoVisible = false;
  };
  
});