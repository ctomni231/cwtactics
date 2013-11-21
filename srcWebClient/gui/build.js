controller.registerMenuRenderer("factory_produceUnit",
function( content, entry, index ){
  
  var cost = model.data_unitSheets[ content ].cost;
  entry.innerHTML = model.data_localized(content)+" ("+cost+"$)";
});