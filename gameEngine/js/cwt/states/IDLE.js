define(["lib/neko"],function( neko ){
  
  // todo solve var stM,screen
  var stM;
  var screen;
  var map, turn;
  
  stM.addState("IDLE",{
    
    ACTION: function()
    {
      var pos = screen.getCursorPos;
      
      var unit = map.unitAt(x,y);
      if( unit )
      {
        if( unit.owner === turn.activeUser() )
        {
          // pop unit info and move menu
          stM.changeState("UNIT_MOVE"); // UNIT_MOVE places a listener on state 
                                        // change to build automatically the 
                                        // move field if its state will be 
                                        // entered
        }
        else
        {
          // pop enemy unit info
        }
      }
      else stM.changeState("MAP_MENU");
    },
    
    CANCEL: function()
    {
      var unit = map.unitAt(x,y);
      if( unit )
      {
        // show attack range
        stM.changeState("UNIT_ATTACK_RANGE"); // same as UNIT_MOVE
      }
    }
  });
  
});