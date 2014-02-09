/**
 * Status map with status information for the unit objects.
 * 
 * @private
 */
controller.unitStatusMap = util.list( MAX_UNITS_PER_PLAYER * MAX_PLAYER , function(){
  return {
    HP_PIC: null,
    LOW_AMMO:false,
    LOW_FUEL:false,
    HAS_LOADS:false,
    CAPTURES: false,
    VISIBLE: false
  };
});

/**
 * 
 * @param {type} unit
 */
controller.getUnitStatusForUnit = function( unit ){
  var id = model.unit_extractId(unit);
  return controller.unitStatusMap[id];
};

util.scoped(function(){
  
  
  function inVision( x,y, tid, unitStatus ){
    if( !model.map_isValidPosition(x,y) ) return;
    
    var unit = model.unit_posData[x][y];
    if( unit ){
      if( model.player_data[unit.owner].team !== tid ) unitStatus.VISIBLE = true;
      
      // IF UNIT IS HIDDEN THEN YOU CAN SEE IT NOW
      if( unit.hidden ) controller.unitStatusMap[ model.unit_extractId(unit) ].VISIBLE = true;
    }
  };
  
  function checkHiddenStatus( unit, unitStatus ){
    if( !unitStatus ){
      unitStatus = controller.unitStatusMap[ model.unit_extractId(unit) ];
    }
    
    unitStatus.VISIBLE = true;
    if( unit.hidden ){
      unitStatus.VISIBLE = false;
      
      // CHECK NEIGHBOURS AND HIDDEN ON NEIGHBOURS
      var x = unit.x;
      var y = unit.y;
      var ttid = model.player_data[unit.owner].team;
      inVision( x-1,y, ttid, unitStatus );
      inVision( x,y-1, ttid, unitStatus );
      inVision( x,y+1, ttid, unitStatus );
      inVision( x+1,y, ttid, unitStatus );
    }
  };
  
  /**
 * 
 * @param {type} uid
 */
  controller.updateUnitStatus = function( uid ){
    var unit = model.unit_data[uid];
    var x = unit.x;
    var y = unit.y;
    var unitStatus = controller.unitStatusMap[uid];
    var uSheet = unit.type;
    
    // LOW AMMO ?
    var cAmmo = unit.ammo;
    var mAmmo = uSheet.ammo;
    if( cAmmo <= parseInt(mAmmo*0.25, 10) ) unitStatus.LOW_AMMO = true;
    else                                    unitStatus.LOW_AMMO = false;
    if( mAmmo === 0 )                       unitStatus.LOW_AMMO = false;
    
    // LOW FUEL
    var cFuel = unit.fuel;
    var mFuel = uSheet.fuel;
    if( cFuel < parseInt(mFuel*0.25, 10) ) unitStatus.LOW_FUEL = true;
    else                                   unitStatus.LOW_FUEL = false;
    
    // HP PICTURE
    var num = -1;
    if( unit.hp <= 90 ){
      num = model.unit_convertHealthToPoints( unit.hp );
    }
    
    switch ( num ){
      case 1: unitStatus.HP_PIC = view.getInfoImageForType("HP_1"); break;
      case 2: unitStatus.HP_PIC = view.getInfoImageForType("HP_2"); break;
      case 3: unitStatus.HP_PIC = view.getInfoImageForType("HP_3"); break;
      case 4: unitStatus.HP_PIC = view.getInfoImageForType("HP_4"); break;
      case 5: unitStatus.HP_PIC = view.getInfoImageForType("HP_5"); break;
      case 6: unitStatus.HP_PIC = view.getInfoImageForType("HP_6"); break;
      case 7: unitStatus.HP_PIC = view.getInfoImageForType("HP_7"); break;
      case 8: unitStatus.HP_PIC = view.getInfoImageForType("HP_8"); break;
      case 9: unitStatus.HP_PIC = view.getInfoImageForType("HP_9"); break;
      default: unitStatus.HP_PIC = null;
    }
    
    // HAS LOADS ?
    if( unit.loadedIn < -1 ){
      unitStatus.HAS_LOADS = true;
    }
    else unitStatus.HAS_LOADS = false;
    
    // CAPTURES ?
    if( unit.x >= 0 ){
      var property = model.property_posMap[ unit.x ][ unit.y ];
      if( property !== null && property.capturePoints < 20 ){
        unitStatus.CAPTURES = true;
      }
      else unitStatus.CAPTURES = false;
    }
    
    checkHiddenStatus( unit, unitStatus );
  };
})
