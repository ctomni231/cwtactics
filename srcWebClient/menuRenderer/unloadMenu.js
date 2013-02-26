controller.registerMenuRenderer("UNUN",function( content, entry, index ){
  entry.innerHTML = model.units[ content ].type;  
});