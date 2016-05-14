model.event_on("modification_loaded",function(){
  var i,sheet;

  // global
  controller.script_parseRule(model.data_globalRules);
  
  // weather
  for (i = model.data_nonDefaultWeatherTypes.length - 1; i >= 0; i--) {
    controller.script_parseRule(model.data_nonDefaultWeatherTypes[i].rules);
  }

  // co
  for (i = model.data_coTypes.length - 1; i >= 0; i--) {
    sheet = model.data_coSheets[model.data_coTypes[i]];
    controller.script_parseRule(sheet.d2d);
    controller.script_parseRule(sheet.cop.turn);
    controller.script_parseRule(sheet.scop.turn);
  }
  
});
