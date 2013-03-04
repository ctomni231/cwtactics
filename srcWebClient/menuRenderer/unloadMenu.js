controller.registerMenuRenderer("UNUN",function( content, entry, index ){
  if( content === "done" ){
    entry.innerHTML = util.i18n_localized( "done" );  
  }
  else entry.innerHTML = util.i18n_localized( model.units[ content ].type );  
});