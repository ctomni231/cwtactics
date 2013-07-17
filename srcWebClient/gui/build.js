controller.registerMenuRenderer("buildUnit",
function( content, entry, index ){
  
  var cost = model.unitTypes[ content ].cost;
  entry.innerHTML = model.localized(content)+" ("+cost+"$)";
});