util.scoped(function(){

  var states = [
    "MOVE_NEAR_PROPERTY",
    "CAPTURE"
  ];

  var stm = util.stateMachine({
    
    // ---
    
    IDLE: {
      start:function(){
        return "START_TURN";
      }
    },
    
    // ---
    
    START_TURN: {
      actionState:function(){
        this.memory.pid = model.turnOwner;
        this.memory.itState = states.length;
        return "ITERATE_UNITS";
      }
    },    
    
    // ---
    
    ITERATE_UNITS: {
        
      onenter:function(){
        this.memory.itState--;
        this.memory.cIndex = model.getFirstUnitSlotId( this.memory.pid );
        this.memory.endIndex = model.getLastUnitSlotId( this.memory.pid );
      },
        
      tick:function(){
        var unit;
        
        // start iteration
        for( ; this.memory.cIndex <= this.memory.endIndex; this.memory.cIndex+=1 ){
            unit = model.units[this.memory.cIndex];
            
            // check next index when unit is inactive
            if( unit.owner === constants.INACTIVE_ID ) continue;
             
            switch( states[this.memory.itState] ){
                
                // ---
                
                // In capture step dumbBoy will try to capture properties 
                // with all capture capable units in range
                case "CAPTURE":
                    
                    // unit is not able to capture
                    if( !unit.type.captures ) continue;
                    else{
                        
                        
                    }
                    
                    break;
                
                // ---
                
                case "MOVE_NEAR_PROPERTY":
                    
                    break;
                
                // ---
                
                // ---
                
                // ---
                
            }
        }
        
        // if you reach this point then the iteration for the current search
        // state is completed. when itState is zero then break out of the 
        // iteration because all steps has been done.
        return (this.memory.itState)? "ITERATE_UNITS": "BUILD";
      }
    },
    
    // ---
    
    BUILD: {
      tick:function(){ 
        var prop;
        
        for( var i=0,e=model.properties.length; i<e; i++ ){
            prop = model.properties[i];
            if( prop.owner === this.memory.pid ){
                
                // buy something here
                
                // if not enough money then try to build a soldier
            }
        }
      }
    },
    
    // ---
    
    END_TURN: {
      actionState: function(){
        return "START_TURN";
      }
    }
  
  },{ noHistory:true });
  
  controller.registerAI({
    
    name:    "DumbBoy",
    version: "0.3",
    desc:    "Very simple minded AI from MiniWars.. long time death... but he still hates YOU!",
        
    init: function( memory ){
      stm.reset();
      stm.memory = memory;
    },
    
    tick: function(){
      stm.tick();
    }
    
  });
  
});