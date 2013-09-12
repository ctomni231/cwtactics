controller.registerAI({
	
	name:    "dumbBoy",
	version: "1.0.0",
	desc:    "Very simple minded AI from MiniWars",
	
	init: function( memory, pid ){
    memory.state = "START_TURN";
    memory.pid   = pid;
	},
	
	tick: function( memory ){
    switch( memory.state ){
        
        // #### Start 
        
        case "START_TURN":
          if( constants.DEBUG ) util.log("DumbBoy:: starts turn");
          
          memory.state  = "MOVE_ATTACK";
          memory.cIndex = model.getFirstUnitSlotId( memory.pid );
          memory.eIndex = model.getLastUnitSlotId( memory.pid );
          break;
        
        // #### Moving and Attack
        
        case "MOVE_ATTACK":
          if( constants.DEBUG ) util.log("DumbBoy:: moving and attack with units");  
        
          var unit = model.units[ memory.cIndex ];
          if( unit.owner === constants.INACTIVE_ID ){
            
            // if unit has a capture ability then try to capture or move near a property
            
            // else if enemy unit is in sight then try to move to it and attack
            
            // else move to a enemy HQ
            
          }
        
          memory.cIndex++;
          if( memory.cIndex > memory.eIndex ){
            memory.state  = "BUY";
            memory.cIndex = 0;
            memory.eIndex = constants.MAX_PROPERTIES;
          } 
          break;
        
        // #### Building units
        
        case "BUILD":
          if( constants.DEBUG ) util.log("DumbBoy:: building units");
          
          // property belongs to the AI player
          if( model.properties[memory.cIndex].owner === memory.pid ){
            
            // if factory
            if( true ){
              
              // take random unit type
              
              // build it
              controller.sharedInvokement("buildUnit",[prop.x,prop.y,null]); 
            }
          }
          
          memory.cIndex++;
          if( memory.cIndex > memory.eIndex ){
            memory.state = "END_TURN";
          }
          break;
        
        // #### End 
        
        case "END_TURN":
          if( constants.DEBUG ) util.log("DumbBoy:: ends turn");
          controller.sharedInvokement("nextTurn",[]);
          return false; // END AI TURN
    }
	}
	
});