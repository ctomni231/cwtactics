// Define event
controller.defineEvent("transferMoney");

// Transfers money from one player to another player.
// 
// @param {Number} splid id of the source player
// @param {Number} tplid id of the target player
// @param {Number} money amount of money
model.transferMoney = function( splid, tplid, money ){
  
  // check parameters
  if( !model.isValidPlayerId(splid) || !model.isValidPlayerId(tplid) ){
    model.criticalError( 
      constants.error.ILLEGAL_PARAMETERS, 
      constants.error.UNKNOWN_PLAYER_ID
    );
  }
  
  var sPlayer = model.players[ splid ];
  var tPlayer = model.players[ tplid ];

  // check parameters
  if( money > sPlayer.gold ){
    model.criticalError( 
      constants.error.ILLEGAL_PARAMETERS, 
      constants.error.NOT_ENOUGH_MONEY 
    );
  }

  // Transfer gold from one player to the other player
  sPlayer.gold -= money;
  tPlayer.gold += money;
  
  // Invoke event
  var evCb = controller.events.transferMoney;
  if( evCb ) evCb( splid, tplid, money ); 
};

// Define event
controller.defineEvent("transferUnit");

// Transfers an unit from one player to another player.
// 
// @param {Number} suid
// @param {Number} tplid 
model.transferUnit = function( suid, tplid ){
  var selectedUnit = model.units[suid];
  var tx           = selectedUnit.x;
  var ty           = selectedUnit.y;
  var opid         = selectedUnit.owner;

  selectedUnit.owner = constants.INACTIVE_ID;

  // Remove vision
  if( model.players[tplid].team !== model.players[opid].team ){
    model.modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
  }

  model.clearUnitPosition( suid );
  model.createUnit( tplid, tx, ty, selectedUnit.type.ID );
  
  // TODO
  var targetUnit      = model.unitPosMap[ tx ][ ty ];
  targetUnit.hp       = selectedUnit.hp;
  targetUnit.ammo     = selectedUnit.ammo;
  targetUnit.fuel     = selectedUnit.fuel;
  targetUnit.exp      = selectedUnit.exp;
  targetUnit.type     = selectedUnit.type;
  targetUnit.x        = tx;
  targetUnit.y        = ty;
  targetUnit.loadedIn = selectedUnit.loadedIn;
  
  // Invoke event
  var evCb = controller.events.transferUnit;
  if( evCb ) evCb( suid, tplid ); 
};

// Define event
controller.defineEvent("transferProperty");

// Transfers a property from one player to another player.
//
// @param {Number} sprid
// @param {Number} tplid
model.transferProperty = function( sprid, tplid ){
  var prop =  model.properties[sprid];
  prop.owner = tplid;

  var x;
  var y;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      if( model.propertyPosMap[x][y] === prop ){
        // TODO fog?
      }
    }
  }
  
  // Invoke event
  var evCb = controller.events.transferProperty;
  if( evCb ) evCb( sprid, tplid ); 
};