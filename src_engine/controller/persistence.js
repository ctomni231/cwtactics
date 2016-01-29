model.event_define("prepare_game");
model.event_define("load_game");
model.event_define("save_game");

// Converts the current game model into a JSON compatible string by invoking all registered
// `save` functions of the persistence handlers.
//
controller.persistence_saveModel = function(){
  var dom = {};
  model.events.save_game(dom);
  return JSON.stringify(dom);
};

//
//
controller.persistence_prepareModel = function( data ){
  model.events.prepare_game(data);
};

// Loads a given JSON compatible string and calls all `load`functions of the persistence
// handlers with this object as argument.
//
controller.persistence_loadModel = function( data ){
  model.events.load_game(data);
};
