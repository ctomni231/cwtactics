controller.registerMenuRenderer("BDUN",function( content, entry, index ){
  
  var cost = model.sheets.unitSheets[ content ].cost
  entry.innerHTML = util.i18n_localized(content)+" ("+cost+"$)";
});