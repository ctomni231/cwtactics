require(["cwt/drawer"], function( drawer ){
  
  console.log("START CWT");
  
  // load data
  MOD = "default";
  require(["cwt/dataLoader"],function(){
	  var _oTime = (new Date()).getTime();
	  var _nTime;
	  var _delay;
	    
	    
	  /**
	   * DRAW ROUTINE
	   */
	  function step()
	  {
	    _nTime = (new Date()).getTime();
	    _delay = _nTime - _oTime;
	    _oTime = _nTime;
	    
	    // redraw screen
	    drawer.draw( _delay );
	    
	    setTimeout(step, 0);
	    
	  }
	  
	  // main loop
	  setTimeout(step, 0);
  });
});
