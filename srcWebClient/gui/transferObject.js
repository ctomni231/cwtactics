util.scoped(function(){
  
  var extractPlayer = function( content, entry, index ){
    entry.innerHTML = model.players[content].name;  
  };

  controller.registerMenuRenderer("transferProperty",extractPlayer);
  controller.registerMenuRenderer("transferUnit",extractPlayer);
});