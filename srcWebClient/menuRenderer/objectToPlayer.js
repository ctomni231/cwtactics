(function(){
  
  var extractPlayer = function( content, entry, index ){
    entry.innerHTML = model.players[content].name;  
  } 

  controller.registerMenuRenderer("GPTP",extractPlayer);
  controller.registerMenuRenderer("GUTP",extractPlayer);
})();