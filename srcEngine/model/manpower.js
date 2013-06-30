model.manpower = util.list( constants.MAX_PLAYER, 999999 );

controller.onsave( function(dom){
  
  // clone values into a new array and place
  // it into the save dom
  dom.mpw = model.manpower.cloneValues([]);
});

controller.onload( function(){
  model.manpower.resetValues();
  
  // grab values from dom model
  if( dom.mpw.length > 0 ) model.manpower.grabValues( dom.mpw );
});