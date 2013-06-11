/**
 * Action process data memory object. It is used as data holder to transport
 * data between the single states of the state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine.data.menu = {
  
  /**
   * Menu list that contains all menu entries. This implementation is a cached list. The 
   * symantic size of the menu is marked by {@link controller.stateMachine.data.menuSize}.
   * 
   * @example
   *   data is [ entryA, entryB, entryC, null, null ]
   *   size is 3
   */
  data : util.list(20, null),
  
  /**
   * Size of the menu.
   */
  size: 0,
  
  /**
   * Adds an object to the menu.
   * 
   * @param {Object} entry
   */
  addEntry: function(entry) {
    if (this.size === this.data.length) {
      util.raiseError();
    }
    
    this.data[ this.size ] = entry;
    this.size++;
  },
  
  /**
   * Cleans the menu.
   */
  clean: function() {
    this.size = 0;
  },
  
  /**
   * Prepares the menu for a given source and target position.
   */
  generate: util.scoped(function(){
    var commandKeys;
    var data = controller.stateMachine.data;
    
    return function() {
      if( !commandKeys ) commandKeys = Object.keys(controller.actionObjects);
      
      var mapActable = false;
      
      // ----- UNIT -----
      var unitActable = true;
      var selectedUnit = data.source.unit;
      if (selectedUnit === null || selectedUnit.owner !== model.turnOwner) {
        unitActable = false;
      }
      else if (!model.canAct(data.source.unitId))
        unitActable = false;
        
        // ----- PROPERTY -----
        var propertyActable = true;
      var property = data.source.property;
      if (selectedUnit !== null)
        propertyActable = false;
      if (property === null || property.owner !== model.turnOwner) {
        propertyActable = false;
      }
      
      if( !unitActable && !propertyActable ) mapActable = true;
      
      for (var i = 0, e = commandKeys.length; i < e; i++) {
        var action = controller.actionObjects[commandKeys[i]];
        
        // IS USER CALLABLE ACTION ?
        if (!action.condition) continue;
        
        // PRE DEFINED CHECKERS
        if (action.unitAction === true && !unitActable) continue;
        if (action.propertyAction === true && !propertyActable) continue;
        if (action.mapAction === true && !mapActable ) continue;
        
        // CHECK CONDITION
        if (action.condition(data)) {
          this.addEntry(commandKeys[i]);
        }
      }
    }
  })
};