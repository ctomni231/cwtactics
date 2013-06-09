/**
 * The central finite state machine of the game engine.
 */
controller.stateMachine = simpleStateMachine();

controller.stateMachine.name = "ENGINE";

controller.TaggedPosition = {
  
  clean: function(){
    
    // POSITION DATA
    this.x = -1;
    this.y = -1;
    this.unit = null;
    this.unitId = -1;
    this.property = null;
    this.propertyId = -1;
  },
  
  set: function( x,y ){
    this.x = x;
    this.y = y;
    
    var refObj;
    var isValid = (x !== -1 && y !== -1);
    var inFog = isValid ? (model.fogData[x][y] === 0) : false;
        
    // ----- UNIT -----
    refObj = isValid ? model.unitPosMap[x][y] : null;
    if( isValid && !inFog && refObj !== null && ( !refObj.hidden || refObj.owner === model.turnOwner || 
          model.players[ refObj.owner ].team === model.players[ model.turnOwner ].team ) ){
      
      this.unit = refObj;
      this.unitId = model.extractUnitId(refObj);
    }
    else {
      this.unit = null;
      this.unitId = -1;
    }
    
    // ----- PROPERTY -----
    refObj = isValid ? model.propertyPosMap[x][y] : null;
    if( isValid /* && !inFog */ && refObj !== null ){
      
      this.property = refObj;
      this.propertyId = model.extractPropertyId(refObj);
    }
    else {
      this.property = null;
      this.propertyId = -1;
    }
  }
};

/**
 * Action process data memory object. It is used as data holder to transport
 * data between the single states of the state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine.data = {};