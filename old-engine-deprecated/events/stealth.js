// Only unhidden stealth units can hide.
//
model.event_on( "unitHide_check",function(  uid ){
  var unit = model.unit_data[uid];
  if( !unit.type.stealth || unit.hidden ) return false;
});

// Only hidden stealth units can unhide.
//
model.event_on( "unitUnhide_check",function(  uid ){
  var unit = model.unit_data[uid];
  if( !unit.type.stealth || !unit.hidden ) return false;
});

// Hides an unit.
//
model.event_on( "unitHide_invoked",function( uid ){
  model.unit_data[uid].hidden = true;
});


// Hides an unit.
//
model.event_on( "unitUnhide_invoked",function( uid ){
  model.unit_data[uid].hidden = false;
});
