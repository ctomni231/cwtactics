util.scoped(function(){
  
  var elements = {
    
    BOX: document.getElementById( ID_ELMT_UNITINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_UNITINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_UNITINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_UNITINFOBOX_DESC),
    
    CLASS: document.getElementById( ID_ELMT_UNITINFOBOX_CLASS),
    MVTP: document.getElementById( ID_ELMT_UNITINFOBOX_MVTP),
    MAINWP: document.getElementById( ID_ELMT_UNITINFOBOX_MAINWP),
    SECWP: document.getElementById( ID_ELMT_UNITINFOBOX_SECWP),
    HP: document.getElementById( ID_ELMT_UNITINFOBOX_HP),
    GAS: document.getElementById( ID_ELMT_UNITINFOBOX_GAS),
    AMMO: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO),
    GAS2: document.getElementById( ID_ELMT_UNITINFOBOX_GAS2),
    AMMO2: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO2),
    MVRANGE: document.getElementById( ID_ELMT_UNITINFOBOX_MVRANGE),
    VISION: document.getElementById( ID_ELMT_UNITINFOBOX_VISION),
    ATTRANGE: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE),
    ATTRANGE2: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE2),
    AG_INF: document.getElementById( ID_ELMT_UNITINFOBOX_AG_INF),
    AG_VEH: document.getElementById( ID_ELMT_UNITINFOBOX_AG_VEH),
    AG_AIR: document.getElementById( ID_ELMT_UNITINFOBOX_AG_AIR),
    AG_HELI: document.getElementById( ID_ELMT_UNITINFOBOX_AG_HELI),
    AG_SHIP: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SHIP),
    AG_SUB: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SUB),
    
    CLASS_D: document.getElementById( ID_ELMT_UNITINFOBOX_CLASS_D),
    MVTP_D: document.getElementById( ID_ELMT_UNITINFOBOX_MVTP_D),
    MAINWP_D: document.getElementById( ID_ELMT_UNITINFOBOX_MAINWP_D),
    SECWP_D: document.getElementById( ID_ELMT_UNITINFOBOX_SECWP_D),
    HP_D: document.getElementById( ID_ELMT_UNITINFOBOX_HP_D),
    GAS_D: document.getElementById( ID_ELMT_UNITINFOBOX_GAS_D),
    AMMO_D: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO_D),
    MVRANGE_D: document.getElementById( ID_ELMT_UNITINFOBOX_MVRANGE_D),
    VISION_D: document.getElementById( ID_ELMT_UNITINFOBOX_VISION_D),
    ATTRANGE_D: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE_D),
    AG_INF_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_INF_D),
    AG_VEH_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_VEH_D),
    AG_AIR_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_AIR_D),
    AG_HELI_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_HELI_D),
    AG_SHIP_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SHIP_D),
    AG_SUB_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SUB_D)
  }
  
  controller.showUnitInfo = function(){
    if( controller.unitInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unitPosMap[x][y];
    if( !unit ) return; // NO UNIT SELECTED
    var type = unit.type;
    
    if( DEBUG ) util.log("show unit information screen");
    
    // BASE
    elements.NAME.innerHTML = model.localized( type.ID );
    
    // SUPPLY DATA
    elements.MVTP_D.innerHTML = model.localized( "MOVETYPE" );
    elements.MVTP.innerHTML = model.localized( type.movetype );
    elements.MAINWP_D.innerHTML = model.localized( "PRIMARY_WP" );
    elements.MAINWP.innerHTML = "";
    elements.SECWP_D.innerHTML = model.localized( "SECONDARY_WP" );
    elements.SECWP.innerHTML = "";
    elements.HP_D.innerHTML = model.localized( "HP" );
    elements.HP.innerHTML = unit.hp;
    elements.GAS_D.innerHTML = model.localized( "FUEL" );
    elements.GAS.innerHTML = unit.fuel;
    elements.GAS2.innerHTML = type.fuel;
    elements.AMMO_D.innerHTML = model.localized( "AMMO" );
    elements.AMMO.innerHTML = unit.ammo;
    elements.AMMO2.innerHTML = type.ammo;
    elements.MVRANGE_D.innerHTML = model.localized( "MOVERANGE" );
    elements.MVRANGE.innerHTML = type.range;
    elements.VISION_D.innerHTML = model.localized( "VISION" );
    elements.VISION.innerHTML = type.vision;
    elements.ATTRANGE_D.innerHTML = model.localized( "ATTACK_RANGE" );
    
    // ATTACK DATA
    var attack = type.attack;
    if( attack ){
      elements.ATTRANGE.innerHTML = attack.minrange || 1;
      elements.ATTRANGE2.innerHTML = attack.maxrange || 1;
    }
    else{
      elements.ATTRANGE.innerHTML = "";
      elements.ATTRANGE2.innerHTML = "";
    }
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.unitInfoVisible = true;
  };
  
  controller.unitInfoVisible = false;
  
  controller.hideUnitInfo = function(){
    if( !controller.unitInfoVisible ) return;
    if( DEBUG ) util.log("hide unit information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.unitInfoVisible = false;
  };
  
});