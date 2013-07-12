// # Factory module

// ### Meta Data

controller.registerInvokableCommand("buildUnit");

controller.defineEvent("buildUnit");

model.unitTypeParser.addHandler(function(sheet){
  if(!util.expectNumber(sheet, "cost", true, true, 0, 99999))return false;
});

model.tileTypeParser.addHandler(function(sheet){
  if( util.expectArray(sheet, "builds", false) === util.expectMode.DEFINED ){
    var list = sheet.builds;
    for( var i=0, e=list.length; i<e; i++){
      if( !util.expectString(list,i,true) ) return false;
    }
  }
});

// ---

// Contructs a unit for a player.
model.buildUnit = function(x, y, type){

  // get factory object
  var prop = model.getPropertyByPos(x, y);
  if(!prop){
    model.criticalError(constants.error.ILLEGAL_PARAMETERS, constants.error.PROPERTY_NOT_FOUND);
  }

  // cannot be a neutral factory
  if(prop.owner === constants.INACTIVE_ID){
    model.criticalError(constants.error.ILLEGAL_PARAMETERS, constants.error.UNKNOWN_PLAYER_ID);
  }

  // invoke introduction event
  evCb = controller.events.buildUnit;
  if(evCb)evCb(x, y, type);

  var uid = model.createUnit(model.turnOwner, x, y, type);
  var cost = model.unitTypes[ type ].cost;
  var pl = model.players[ prop.owner ];

  // check money, if the buyer does not have enough money 
  // then the game state is broken
  if(pl.gold < cost)model.criticalError(constants.error.ILLEGAL_DATA, constants.error.NOT_ENOUGH_MONEY);

  pl.gold -= cost;

  // factory builds reduces the man power of the factory owner
  model.decreaseManpower(model.turnOwner);

  model.markUnitNonActable(uid);
};

// Returns true if a unit type is buildable by a property type.
// 
// @param {String} propertyType
// @param {unitType} type
//
model.isBuildableByFactory = function(property, type){

  // decline when the owner of the factory does not have man power unit left
  if(!model.hasLeftManpower(property.owner))return false;

  var bList = property.type.builds;
  if(!bList)return false;

  if(bList.indexOf(type.movetype) !== -1)return true;

  // TODO FIND BETTER SOLUTION
  // if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;

  return false;
};
