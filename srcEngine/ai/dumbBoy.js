util.scoped(function(){
    
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
        return "CAPTURE";
      }
    },    
    
    // ---
    
    ITERATE_UNITS: {
      tick:function(){
      
      }
    },
    
    // ---
    
    BUILD: {
      tick:function(){
      
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
    version: "0.2",
    desc:    "Very simple minded AI",
        
    init: function( memory ){
      stm.reset();
      stm.memory = memory;
    },
    
    tick: function(){
      stm.tick();
    }
    
  });
  
});