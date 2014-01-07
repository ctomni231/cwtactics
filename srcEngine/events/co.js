// Decline attach commander action on game modes that isn't AW4.
//
model.event_on("attachCommander_check",function(  pid ){
  if( model.co_activeMode !== model.co_MODES.AWDR ) return false;
});

// Attaches a commander from a player pool to a given unit.
//
model.event_on("attachCommander_invoked", function( pid, uid ){
  assert( model.co_data[pid].detachedTo === INACTIVE_ID );
  model.co_data[pid].detachedTo = uid;
});

// Decline detach commander action on game modes that isn't AW4.
//
model.event_on("detachCommander_check",function(  pid ){
  if( model.co_activeMode !== model.co_MODES.AWDR ) return false;
});

// Detaches a commander from a given unit back to the player pool.
//
model.event_on("detachCommander_invoked", function( pid, uid ){
  assert( model.co_data[pid].detachedTo !== uid );
  model.co_data[pid].detachedTo = INACTIVE_ID;
});

// Decline activate power action on game modes that aren't AW1-3.
//
model.event_on("activatePower_check",function(  pid ){
  if(  controller.configValue( "co_enabledCoPower" ) === 0 ) return false;
  
  if( model.co_activeMode !== model.co_MODES.AW1 &&
     model.co_activeMode !== model.co_MODES.AW2 &&
     model.co_activeMode !== model.co_MODES.AWDS ) return false;
});

// Decline activate power action when a player cannot activate the base cop level.
//
model.event_on("activatePower_check",function(  pid ){
  if( !model.co_canActivatePower(pid,model.co_POWER_LEVEL.COP) ) return false;
});

// Decline activate power action when a player cannot activate the base cop level.
//
model.event_on("activatePower_invoked",function( pid, level ){
  var data   = model.co_data[pid];
  data.power = 0;
  data.level = level;
  data.timesUsed++;
});

(function(){

  function setCo( pid,type,isMain ){
    if( type === null ){
      if( isMain ) model.co_data[pid].coA = null;
      else         model.co_data[pid].coB = null;
    } else {
      assert( model.data_coSheets.hasOwnProperty(type) );
      if( isMain ) model.co_data[pid].coA = model.data_coSheets[type];
      else         model.co_data[pid].coB = model.data_coSheets[type];
    }
  }

  // Sets the main CO of a player.
  //
  model.event_on("setMainCo", function( pid, type ){
    setCo(pid,type,true);
  });

  // Sets the side CO of a player.
  //
  model.event_on("setSideCo", function( pid, type ){
    setCo(pid,type,false);
  });

})();

// Modifies the power level of a player.
//
model.event_on("co_modifyPowerLevel", function( pid, value ){
  assert( model.player_isValidPid(pid) );

  var data = model.co_data[pid];

  data.power += value;
  if( data.power < 0 ) data.power = 0;
});
