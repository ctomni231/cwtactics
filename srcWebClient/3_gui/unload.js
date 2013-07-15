controller.registerMenuRenderer("unloadUnit",
function( content, entry, index ){
  
  if( content === "done" ){
    entry.innerHTML = model.localized( "done" );  
  }
  else entry.innerHTML = model.localized( model.units[ content ].type.ID );  
});