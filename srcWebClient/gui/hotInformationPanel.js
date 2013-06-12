util.scoped(function(){
  
  var NAME = document.getElementById( "bottomBar_name" );
  var ROW1 = document.getElementById( "bottomBar_unit_row1" );
  var ROW2 = document.getElementById( "bottomBar_unit_row2" );
  
  var HP = document.getElementById( "bottomBar_hp");
  var GAS = document.getElementById( "bottomBar_fuel" );
  var AMMO = document.getElementById( "bottomBar_ammo" );
  var GAS2 = document.getElementById( "bottomBar_fuel2" );
  var AMMO2 = document.getElementById( "bottomBar_ammo2" );
  var ATTRANGE = document.getElementById( "bottomBar_attrange" );
  var ATTRANGE2 = document.getElementById( "bottomBar_attrange2" );
  
  var HP_D = document.getElementById( "bottomBar_hp_d" );
  var GAS_D = document.getElementById( "bottomBar_fuel_d" );
  var AMMO_D = document.getElementById( "bottomBar_ammo_d");
  var ATTRANGE_D = document.getElementById( "bottomBar_attrange_d" );
  
  // -------------------------------------------------------------------------------------------
  
  var PLAYER_NAME = document.getElementById( "bottomBar_playerName" );
  var PLAYER_POWER = document.getElementById( "bottomBar_playerpower" );
  var PLAYER_GOLD = document.getElementById( "bottomBar_playergold" );
  
  var TPLAYER_NAME = document.getElementById( "bottomBar_tplayerName" );
  var TPLAYER_POWER = document.getElementById( "bottomBar_tplayerpower" );
  var TPLAYER_GOLDROW = document.getElementById( "bottomBar_tplayergoldrow" );
  var TPLAYER_GOLD = document.getElementById( "bottomBar_tplayergold" );
  
  // -------------------------------------------------------------------------------------------
  
  var TILE_NAME = document.getElementById( "bottomBar_tilename" );
  var TILE_ROW1 = document.getElementById( "bottomBar_tile_row1" );
  var TILE_ROW2 = document.getElementById( "bottomBar_tile_row2" );
  var DEFENSE_D = document.getElementById( "bottomBar_defense_d" );
  var DEFENSE = document.getElementById( "bottomBar_defense" );
  var CAPPT_D  = document.getElementById( "bottomBar_capPt_d" );
  var CAPPT    = document.getElementById( "bottomBar_capPt" );
  var CAPPT2   = document.getElementById( "bottomBar_capPt2" );
  
  var rendered = false;
  
  controller.updateTileInformation = function(){
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var type;
    var unit = model.unitPosMap[x][y];
    var prop = model.propertyPosMap[x][y];
    
    if(!rendered){
      
      // UNIT SYMBOLS
      HP_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_HP"), 0, 0);
      GAS_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_FUEL"), 0, 0);
      AMMO_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_AMMO"), 0, 0);
      ATTRANGE_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_ATT"), 0, 0);
      
      DEFENSE_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_DEFENSE"), 0, 0);
      CAPPT_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_CAPTURE"), 0, 0);
      
      rendered = true;
    }
    
    /* **************************************************************************** */
    
    controller.renderPlayerInfo();

    /* **************************************************************************** */
    
    if( !unit ){
      NAME.style.opacity = 0;
      ROW1.style.opacity = 0;
      ROW2.style.opacity = 0;
    }
    else{
      type = unit.type;
      
      NAME.innerHTML = model.localized( type.ID );
      HP.innerHTML = unit.hp;
      GAS.innerHTML = unit.fuel;
      GAS2.innerHTML = type.fuel;
      AMMO.innerHTML = unit.ammo;
      AMMO2.innerHTML = type.ammo;
      
      // ATTACK DATA
      var attack = type.attack;
      if( attack ){
        ATTRANGE.innerHTML = attack.minrange || 1;
        ATTRANGE2.innerHTML = attack.maxrange || 1;
      }
      else{
        ATTRANGE.innerHTML = "";
        ATTRANGE2.innerHTML = "";
      }
            
      NAME.style.opacity = 1;
      ROW1.style.opacity = 1;
      ROW2.style.opacity = 1;
    }
    
    /* **************************************************************************** */
    
    if( !prop ){
      TILE_NAME.style.opacity = 0;
      TILE_ROW1.style.opacity = 0;
      TILE_ROW2.style.opacity = 0;
    }
    else{
      type = prop.type;
      
      TILE_NAME.innerHTML = model.localized( type.ID );
      CAPPT.innerHTML = prop.capturePoints;
      CAPPT2.innerHTML = 20;
      
      DEFENSE.innerHTML = type.defense;
    
      TILE_NAME.style.opacity = 1;
      TILE_ROW1.style.opacity = 1;
      TILE_ROW2.style.opacity = 1;
    }
    
    /* **************************************************************************** */
    
    type = null;
         if( unit && unit.owner !== model.turnOwner ) type = model.players[ unit.owner ];
    else if( prop && prop.owner !== model.turnOwner ) type = model.players[ prop.owner ];
      
    if( type ){
      TPLAYER_NAME.innerHTML = type.name;
      TPLAYER_GOLD.innerHTML = type.gold;
      TPLAYER_POWER.innerHTML = type.power;  
      TPLAYER_NAME.style.opacity = 1;
      TPLAYER_GOLDROW.style.opacity = 1;
      TPLAYER_POWER.style.opacity = 1;     
    }
    else{
      TPLAYER_NAME.style.opacity = 0;
      TPLAYER_GOLDROW.style.opacity = 0;
      TPLAYER_POWER.style.opacity = 0;   
    }
  }
  
  controller.renderPlayerInfo = function(){
    var activePl = model.players[ model.turnOwner ];
    
    PLAYER_NAME.innerHTML = activePl.name;
    PLAYER_GOLD.innerHTML = activePl.gold;
    PLAYER_POWER.innerHTML = activePl.power;
  };
});