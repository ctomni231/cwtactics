controller.registerMenuRenderer("unloadUnit",
function( content, entry, index ){
  
  if( content === "done" ){
    entry.innerHTML = model.localized( "done" );  
  }
  else entry.innerHTML = model.localized( model.unit_data[ content ].type.ID );  
});