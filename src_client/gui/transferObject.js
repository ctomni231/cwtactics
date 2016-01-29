util.scoped(function(){
  
  var extractPlayer = function( content, entry, index ){
    entry.innerHTML = model.player_data[content].name;  
  };

  controller.registerMenuRenderer("transferProperty",extractPlayer);
  controller.registerMenuRenderer("transferUnit",extractPlayer);
});