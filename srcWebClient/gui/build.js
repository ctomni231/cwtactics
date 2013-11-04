controller.registerMenuRenderer("factory_produceUnit",
function( content, entry, index ){
  
  var cost = model.unitTypes[ content ].cost;
  entry.innerHTML = model.localized(content)+" ("+cost+"$)";
});