util.scoped(function(){
  
  function dropInputCommand(){ 
    return this.BREAK_TRANSITION;
  };
  
  controller.stateParent = {
    
		onenter: function(){
			controller.openSection( this.structure[this.state].section );
			if( this.structure[this.state].enterState ){
				this.structure[this.state].enterState.apply( this, arguments );
			}
		},
		
    // MOVEMENT
    UP:        dropInputCommand,
    LEFT:      dropInputCommand,
    RIGHT:     dropInputCommand,
    DOWN:      dropInputCommand,
    
    // SPECIAL KEYS
    SPECIAL_1: dropInputCommand,
    SPECIAL_2: dropInputCommand,
    SPECIAL_3: dropInputCommand,
    SPECIAL_4: dropInputCommand,
    SPECIAL_5: dropInputCommand,
    SPECIAL_6: dropInputCommand,
    
    // BASIC ACTIONS
    ACTION:   dropInputCommand,
    CANCEL:   dropInputCommand,
    HOVER:    dropInputCommand,
		
		onerror: controller.haltEngine
  };
});