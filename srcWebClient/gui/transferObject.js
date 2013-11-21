util.scoped(function(){
  
  var extractPlayer = function( content, entry, index ){
    entry.innerHTML = model.player_data[content].name;  
  };

  controller.registerMenuRenderer("team_transferProperty",extractPlayer);
  controller.registerMenuRenderer("team_transferUnit",extractPlayer);
});