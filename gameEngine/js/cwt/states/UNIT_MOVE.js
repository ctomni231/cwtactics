/**
 * Module description...
 * 
 * @requires ...
 * @author BlackCat
 * @since date
 */
define("sys/event",function(event){
  
  // todo solve var stM,screen
  var stM;
  var screen;
  var map, turn;
  
  event.on("stateChange",function(from,to){
    if( to === "UNIT_MOVE" ){
      // build move path
    }
  });
  
  stM.addState("UNIT_MOVE",{
    
    ACTION: function()
    {
      // move unit
    },
    
    CANCEL: function()
    {
      stM.changeState("IDLE");
    }
  });
  
});