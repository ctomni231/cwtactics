controller.registerMenuRenderer("unloadUnit",
function( content, entry, index ){
  
  if( content === "done" ){
    entry.innerHTML = model.data_localized( "done" );  
  }
  else entry.innerHTML = model.data_localized( model.unit_data[ content ].type.ID );  
});