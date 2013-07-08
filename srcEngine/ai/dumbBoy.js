controller.registerAI({

  name:    "DumbBoy",
  version: "0.1",
  desc:    "Very simple minded AI",
    
  init: function( memory ){
    
  },
  
  tick: function( memory, action ){
  
    // 1. SEARCH CAPTURE TARGETS
    
    // 2. SEARCH INDIRECT TARGETS
    
    // 3. SEARCH DIRECT TARGETS
    
    // 4. BUILD UNITS
    
    // no actions left 
    action.doCommand("nextTurn"); 
  }

});