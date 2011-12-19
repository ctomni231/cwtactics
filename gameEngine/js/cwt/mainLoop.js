define("",function( ){
  
  //todo solve
  var stM,neko;
  
  var gameRunning = true;
  neko.event.onEvent("gameDone",function(){ gameRunning = false; });
  var step = function()
  {
    

    if( gameRunning ) setTimeout(step, 0);
    else
    {
      // game round ended
    }
  }

  // main loop
  setTimeout(step, 0);
});