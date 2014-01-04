// Returns `true` when a player can transfer money to a tile owner.
//
model.event_on("transferMoney_check",function(  pid, x,y ){
  var ref;

  if( model.player_data[ pid ].gold < model.team_MONEY_TRANSFER_STEPS[0] ){
    return false;
  }

  if( model.fog_turnOwnerData[x][y] === 0 ) return false;
  
  // check unit first
  ref = model.unit_posData[x][y];
  if( ref === null || ref.owner === pid ){

    // check property
    ref = model.property_posMap[x][y];
    if( ref !== null && ref.owner !== pid && ref.owner !== -1 ){
      return;
    }

    return false;
  }
});

// Returns `true` when a player can transfer money to a tile owner.
//
model.event_on("transferMoney_addEntries",function( pid, menu ){
  assert( model.player_isValidPid(pid) );

  var availGold = model.player_data[ pid ].gold;
  for( var i=0,e=model.team_MONEY_TRANSFER_STEPS.length; i<e; i++ ){
    if( availGold >= model.team_MONEY_TRANSFER_STEPS[i] ){
      menu.addEntry( model.team_MONEY_TRANSFER_STEPS[i] );
    }
  }
});

// Transfers money from one player to another player.
//
model.event_on("transferMoney_invoked",function( spid, tpid, money ){
  var sPlayer = model.player_data[ spid ];
  var tPlayer = model.player_data[ tpid ];

  sPlayer.gold -= money;
  tPlayer.gold += money;

  assert( sPlayer.gold >= 0 );
});

model.event_on("transferUnit_check",function( uid ){
  if( model.transport_hasLoads( uid ) ) return false;
});

model.event_on("transferUnit_addEntries",function( pid, menu ){
  for( var i=0,e=MAX_PLAYER; i<e; i++ ){
    if( i !== pid && model.player_data[i].team !== INACTIVE_ID ){
      menu.addEntry(i, true );
    }
  }
});

model.event_on("transferUnit_invoked",function( suid, tplid ){
  var selectedUnit = model.unit_data[suid];
  var tx           = selectedUnit.x;
  var ty           = selectedUnit.y;
  var opid         = selectedUnit.owner;

  selectedUnit.owner = INACTIVE_ID;

  // Remove vision
  if( model.player_data[tplid].team !== model.player_data[opid].team ){
    model.events.modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
  }

  var tSlot = model.unit_getFreeSlot(tplid);
  model.events.clearUnitPosition(suid);
  model.events.createUnit( tSlot, tplid, tx, ty, selectedUnit.type.ID );

  var targetUnit      = model.unit_data[ tSlot ];
  targetUnit.hp       = selectedUnit.hp;
  targetUnit.ammo     = selectedUnit.ammo;
  targetUnit.fuel     = selectedUnit.fuel;
  targetUnit.exp      = selectedUnit.exp;
  targetUnit.type     = selectedUnit.type;
  targetUnit.x        = tx;
  targetUnit.y        = ty;
  targetUnit.loadedIn = selectedUnit.loadedIn;
});

model.event_on("transferProperty_check",function(  prid ){
  if( model.property_data[prid].type.notTransferable ) return false;
});

model.event_on("transferProperty_addEntries",function( pid, menu ){
  for( var i=0,e=MAX_PLAYER; i<e; i++ ){
    if( i !== pid && model.player_data[i].team !== INACTIVE_ID ){
      menu.addEntry(i, true );
    }
  }
});

model.event_on("transferProperty_invoked",function( sprid, tplid ){
  var prop =  model.property_data[sprid];
  prop.owner = tplid;

  var x;
  var y;
  var xe = model.map_width;
  var ye = model.map_height;

  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      if( model.property_posMap[x][y] === prop ){
        // TODO fog?
      }
    }
  }
});
