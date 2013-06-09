controller.playerInfoEl_gold = document.getElementById("playerGold");
controller.playerInfoEl_power = document.getElementById("playerPower");

controller.renderPlayerInfo = function(){
  var activePl = model.players[ model.turnOwner ];
  
  controller.playerInfoEl_gold.innerHTML = activePl.gold;
  controller.playerInfoEl_power.innerHTML = activePl.power;
};

// ------------------------------------------------------------------------

util.scoped(function(){
  
  var elements = {
    BOX: document.getElementById( ID_ELMT_PLAYERINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_PLAYERINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_PLAYERINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_PLAYERINFOBOX_DESC),
    
    POWER: document.getElementById( ID_ELMT_PLAYERINFOBOX_POWER),
    POWER_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_POWER_D),
    
    PROPS: document.getElementById( ID_ELMT_PLAYERINFOBOX_PROPS),
    PROPS_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_PROPS_D),
    
    UNITS: document.getElementById( ID_ELMT_PLAYERINFOBOX_UNITS),
    UNITS_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_UNITS_D)
  }
  
  controller.showPlayerInfo = function(){
    if( controller.playerInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var pid = -1;
    
    // TRY PROPERTY
    var prop = model.propertyPosMap[x][y];
    if( prop !== null ) pid = prop.owner;
    else{
    
      // TRY UNIT
      var unit = model.unitPosMap[x][y];
      if( unit !== null ) pid = unit.owner;
    }
    
    if( pid === -1 ) return;
    var player = model.players[pid];
    
    if( DEBUG ) util.log("show player information screen");
    
    // BASE
    elements.NAME.innerHTML = player.name;
    
    elements.POWER_D.innerHTML = "POWER_METER";
    elements.POWER.innerHTML = player.power;
    
    elements.PROPS_D.innerHTML = "NUMBER PROPERTIES";
    elements.PROPS.innerHTML = model.countProperties(pid);
    
    elements.UNITS_D.innerHTML = "NUMBER UNITS";
    elements.UNITS.innerHTML = model.countUnits(pid);
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.playerInfoVisible = true;
  };
  
  controller.playerInfoVisible = false;
  
  controller.hidePlayerInfo = function(){
    if( !controller.playerInfoVisible ) return;
    if( DEBUG ) util.log("hide player information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.playerInfoVisible = false;
  };
  
});