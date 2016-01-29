model.factory_wish = util.wish();

// Returns `true` when the given factory object (by its `prid`) is a factory and can produce
// something technically, else `false`.
//
model.factory_canProduceSomething = function( prid, pid  ){
  return model.events.buildUnit_check( prid, pid );
};

// Returns `true` when the given factory object (by its `prid`) is a factory, else `false`.
//
model.factory_isFactory = function( prid ){
  assert( model.property_isValidPropId(prid) );
  return model.property_data[prid].type.builds;
};

// Generates the build menu for a given factory object (by its `prid`).
//
model.factoryGenerateBuildMenu = function( prid, menu, markDisabled ){
  assert( model.property_isValidPropId(prid) );
  assert( model.factory_isFactory(prid));

  var property   = model.property_data[prid];

  // the factory must be ownerd by someone
  assert( model.player_isValidPid(property.owner) );

  var availGold  = model.player_data[ property.owner ].gold;
  var unitTypes  = model.data_unitTypes;
  var bList      = property.type.builds;

  for( var i=0,e=unitTypes.length; i<e; i++ ){
    var key  = unitTypes[i];
    var type = model.data_unitSheets[key];

    if( bList.indexOf( type.movetype ) === -1 ) continue;

    // TODO FIND BETTER SOLUTION
    // if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;

    if( type.cost <= availGold || markDisabled ) menu.addEntry( key, (type.cost <= availGold) );
  }
};
