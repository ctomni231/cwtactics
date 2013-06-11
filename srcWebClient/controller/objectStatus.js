/**
 * Status map with status information for the unit objects.
 * 
 * @private
 */
controller.unitStatusMap = util.list( CWT_MAX_UNITS_PER_PLAYER*CWT_MAX_PLAYER, function(){
  return {
    HP_PIC: null,
    LOW_AMMO:false,
    LOW_FUEL:false,
    HAS_LOADS:false,
    CAPTURES: false,
    CLIENT_VISIBLE: false
  };
});

/**
 * 
 * @param {type} unit
 */
controller.getUnitStatusForUnit = function( unit ){
  var id = model.extractUnitId(unit);
  return controller.unitStatusMap[id];
};

controller.inVision_ = function( x,y, pid,tid ){
  if( !model.isValidPosition(x,y) ) return false;
  
  var unit = model.unitPosMap[x][y];
  return ( 
    unit !== null &&
    ( unit.owner === pid || model.players[ unit.owner ].team == tid )
  );
};

/**
 * 
 * @param {type} uid
 */
controller.updateUnitStatus = function( uid ){
  var unit = model.units[uid];
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
    num = parseInt( unit.hp/10 , 10 )+1;
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
    var property = model.propertyPosMap[ unit.x ][ unit.y ];
    if( property !== null && property.capturePoints < 20 ){
      unitStatus.CAPTURES = true;
    }
    else unitStatus.CAPTURES = false;
  }
  
  // VISIBLE FOR CLIENT ?
  unitStatus.CLIENT_VISIBLE = false;
  var tpid = model.turnOwner;
  var ttid = model.players[tpid].team;
  var inVis = controller.inVision_;
  
  if( inVis( x-1,y, tpid,ttid ) || 
     inVis( x,y-1, tpid,ttid ) || 
     inVis( x,y+1, tpid,ttid ) || 
     inVis( x+1,y, tpid,ttid ) ){
    
    unitStatus.CLIENT_VISIBLE = true;
  }
};