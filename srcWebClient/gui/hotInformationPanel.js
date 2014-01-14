util.scoped(function(){
  
  var PANEL       = document.getElementById( "cwt_game_infoBar" );

  var damageDivEl = document.getElementById("game_infobox_damage");
  var damageDivHolderEl = document.getElementById("game_infobox_damage_holder");

  // -------------------------------------------------------------------------------------------
  
  var ROW1        = document.getElementById( "infoBox_unitRow1" );
  var ROW2        = document.getElementById( "infoBox_unitRow2" );
  var ROW3        = document.getElementById( "infoBox_unitRow3" );

  var NAME        = document.getElementById( "infoBox_name" );
  var HP          = document.getElementById( "infoBox_hp");
  var GAS         = document.getElementById( "infoBox_fuel" );
  var AMMO        = document.getElementById( "infoBox_ammo" );
  var GAS2        = document.getElementById( "infoBox_fuel2" );
  var AMMO2       = document.getElementById( "infoBox_ammo2" );
  var ATTRANGE    = document.getElementById( "infoBox_attrange" );
  var ATTRANGE2   = document.getElementById( "infoBox_attrange2" );
  var HP_D        = document.getElementById( "infoBox_hp_d" );
  var PR_HP_D     = document.getElementById( "infoBox_pr_hp_d" );
  var GAS_D       = document.getElementById( "infoBox_fuel_d" );
  var AMMO_D      = document.getElementById( "infoBox_ammo_d");
  var ATTRANGE_D  = document.getElementById( "infoBox_attrange_d" );
  
  // -------------------------------------------------------------------------------------------
  
  var PLAYER_NAME     = document.getElementById( "infoBox_playerName" );
  var PLAYER_POWER    = document.getElementById( "infoBox_playerpower" );
  var PLAYER_GOLD     = document.getElementById( "infoBox_playergold" );
  
  // -------------------------------------------------------------------------------------------
  
  var TILE_ROW1   = document.getElementById( "infoBox_tileRow1" );
  var TILE_ROW2   = document.getElementById( "infoBox_tileRow2" );
  var TILE_ROW2D2 = document.getElementById( "infoBox_tileRow2d2" );

  var TILE_NAME   = document.getElementById( "infoBox_tilename" );
  var DEFENSE_D   = document.getElementById( "infoBox_defense_d" );
  var DEFENSE     = document.getElementById( "infoBox_defense" );
  var CAPPT_D     = document.getElementById( "infoBox_capPt_d" );
  var CAPPT       = document.getElementById( "infoBox_capPt" );
  var CAPPT2      = document.getElementById( "infoBox_capPt2" );
  
  // -------------------------------------------------------------------------------------------
  
  var symbolsRendered = false;
  var capCanvasRendered = true;

  controller.sideSimpleTileInformationPanel = -1;

  controller.moveSimpleTileInformationToLeft = function(){
    if( controller.sideSimpleTileInformationPanel < 0 ) return;

    //PANEL.style.left = "4px";
    //PANEL.style.right = "";

    controller.sideSimpleTileInformationPanel = -1;
  };

  controller.moveSimpleTileInformationToRight = function(){
    if( controller.sideSimpleTileInformationPanel > 0 ) return;

    //PANEL.style.right = "4px";
    //PANEL.style.left = "";

    controller.sideSimpleTileInformationPanel = +1;
  };

  controller.updateSimpleTileInformation = function( dmg ){
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unit_posData[x][y];
    var prop = model.property_posMap[x][y];
    
    var type; 
    
    // ### Render Symbols
    if( !symbolsRendered ){
      
      HP_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_HP"), 0, 0);
      PR_HP_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_HP"), 0, 0);
      GAS_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_FUEL"), 0, 0);
      AMMO_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_AMMO"), 0, 0);
      ATTRANGE_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_ATT"), 0, 0);    
      DEFENSE_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_DEFENSE"), 0, 0);
      CAPPT_D.getContext("2d").drawImage( view.getInfoImageForType("SYM_CAPTURE"), 0, 0);
      
      symbolsRendered = true;
    }

    // ------------------------------------------------------------------------------------
    
    // Render unit information
    if( !unit ){
      NAME.style.opacity = 0;
      ROW1.style.opacity = 0;
      ROW2.style.opacity = 0;
      ROW3.style.opacity = 0;
    }
    else{
      type = unit.type;
      
      NAME.innerHTML  = model.data_localized( type.ID );
      HP.innerHTML    = model.unit_convertHealthToPoints(unit.hp);
      GAS.innerHTML   = unit.fuel;
      GAS2.innerHTML  = type.fuel;
      AMMO.innerHTML  = unit.ammo;
      AMMO2.innerHTML = type.ammo;
      
      // ATTACK DATA
      var attack = type.attack;
      if( attack ){
        ATTRANGE.innerHTML  = attack.minrange || 1;
        ATTRANGE2.innerHTML = attack.maxrange || 1;
      }
      else{
        ATTRANGE.innerHTML  = "";
        ATTRANGE2.innerHTML = "";
      }
            
      NAME.style.opacity = 1;
      ROW1.style.opacity = 1;
      ROW2.style.opacity = 1;
      ROW3.style.opacity = 1;
    }
    
    // ------------------------------------------------------------------------------------

    // Render tile / property information
    if( !prop ){
      type = model.map_data[x][y];
      
      TILE_NAME.innerHTML = model.data_localized( type.ID );
      DEFENSE.innerHTML   = type.defense;
      
      TILE_ROW2D2.style.opacity = 0;
    }
    else{
      type = prop.type;
      
      TILE_NAME.innerHTML = model.data_localized( type.ID );
      CAPPT.innerHTML = prop.capturePoints;

      // is normal property --> show property symbol
      if( prop.capturePoints < 0 ){
        if( !capCanvasRendered ){ // prevent additional css changes
          PR_HP_D.style.display = "none";
          CAPPT_D.style.display = "";
          capCanvasRendered     = true;
        }
      }
      // is battle property --> show heart symbol
      else{
        if( capCanvasRendered ){ // prevent additional css changes
          PR_HP_D.style.display = "";
          CAPPT_D.style.display = "none";
          capCanvasRendered     = false;
        }
      }
      CAPPT2.innerHTML = 20;
      
      DEFENSE.innerHTML = type.defense;
      TILE_ROW2D2.style.opacity = 1;
    }
    
    // ------------------------------------------------------------------------------------

    // Render owner information
    
    // The rendered information will be calculated by the tile objects if a unit is on a 
    // tile then the owner of it will be rendered as player information else the owner
    // of the property. (**TODO:**) If both objects are null then the active client will
    // be rendered
    type = null;
    var id = -1;
    
    // grab identical number
    if( unit  )                                             id = unit.owner;
    else if( prop && prop.owner !== INACTIVE_ID )           id = prop.owner;
    else                                                    id = model.round_turnOwner;
    
    if( id > -1 ){
      type = model.player_data[ id ];
      
      PLAYER_NAME.innerHTML  = type.name;
      PLAYER_GOLD.innerHTML  = type.gold;
      PLAYER_POWER.innerHTML = model.co_data[id].power;
    }
    else{
      
      PLAYER_NAME.innerHTML  = "";
      PLAYER_GOLD.innerHTML  = "";
      PLAYER_POWER.innerHTML = "";
    }
    
    // ------------------------------------------------------------------------------------

    // Render damage information

    if( dmg >= 0 ){
      damageDivHolderEl.style.display = "block";
      damageDivEl.innerHTML = dmg;
    }else{
      damageDivHolderEl.style.display = "none";
    }
  };
});
