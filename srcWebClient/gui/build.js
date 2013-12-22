controller.registerMenuRenderer("buildUnit",
function( content, entry, index, enabled ){
  
  var cost = model.data_unitSheets[ content ].cost;
  if( enabled ) entry.innerHTML = model.data_localized(content)+" ("+cost+" G)";
  else entry.innerHTML = "<span style='color:red;'>"+model.data_localized(content)+" ("+cost+" G) </span>";
});