// ### StateMachineData
// Action process data memory object. It is used as data holder to transport data between the single states of the state machine of the game engine.
//
controller.stateMachine.data = {
  
  // ### StateMachineData.source
  // Position object ( instance of `controller.TaggedPosition` ) with rich information about the source position and some relations.
  // 
  source: Object.create( controller.TaggedPosition ),
  
  // ### StateMachineData.target
  // Position object ( instance of `controller.TaggedPosition` ) with rich information about the target position and some relations.
  // 
  target: Object.create( controller.TaggedPosition ),
  
  // ### StateMachineData.targetselection
  // Position object ( instance of `controller.TaggedPosition` ) with rich information about the selected position by an action and some relations.
  // 
  targetselection: Object.create( controller.TaggedPosition ),
  
  // ### StateMachineData.hereIsUnitRelationShip
  // Does a unit to unit relationcheck. Both arguments `posA` and `posB` are objects of the type `controller.TaggedPosition`. An instance of `model.relationModes` will be returned.
  //
  thereIsUnitRelationShip: function( posA, posB ){
    // TODO check for undefined
    
    if( posA.unit && posA.unit === posB.unit ) return model.relationModes.SAME_OBJECT;
    
    return model.relationShipCheck(
      (posA.unit !== null) ? posA.unit.owner : -1,
      (posB.unit !== null) ? posB.unit.owner : -1
    );
  },
  
  // ### StateMachineData.thereIsUnitToPropertyRelationShip
  // Does a unit to property relationcheck. Both arguments `posA` and `posB` are objects of the type `controller.TaggedPosition`. An instance of `model.relationModes` will be returned.
  //
  thereIsUnitToPropertyRelationShip: function( posA, posB ){
    // TODO check for undefined
    
    return model.relationShipCheck(
      (posA.unit !== null    ) ? posA.unit.owner     : -1,
      (posB.property !== null) ? posB.property.owner : null
    );
  },
  
  // ### StateMachineData.action
  // Holds some information about the current selected action with the selected sub data.
  // 
  action: {
    
    // ### StateMachineData.action.selectedEntry
    // Selected sub action object.
    selectedEntry: null,
    
    // ### StateMachineData.action.selectedSubEntry
    // Selected sub action object.
    selectedSubEntry: null,
    
    // ### StateMachineData.action.object
    // Action object that represents the selected action.
    object: null
  },
  
  // ### StateMachineData.movePath
  // Holds some information about the current selected move path.
  //
  movePath: {
    
    // ### StateMachineData.movePath.data
    // Holds all move codes in a data list. This object isn't a dynamic array. It's a pre-allocated structure. Use `getLastCode` and `getSize` to get the move information.
    //
    data: util.scoped( function(){
      var list = util.list( MAX_SELECTION_RANGE, INACTIVE_ID );
      
      // ### StateMachineData.movePath.data.getLastCode
      // create data list function
      //  :> returns the last move code from the data list
      //
      list.getLastCode = function(){
        for( var i = this.length - 1; i > 0; i-- ) if( this[i] !== INACTIVE_ID ) return this[i];
        return INACTIVE_ID;
      };
      
      // ### StateMachineData.movePath.data.getSize
      // create data list function
      //  :> returns the size of the list
      //
      list.getSize = function(){
        for( var i = this.length - 1; i > 0; i-- ) if( this[i] !== INACTIVE_ID ) return i + 1;
        return 0;
      };
      
      return list;
    }),
    
    // ### StateMachineData.movePath.clean
    // Cleans the move path. After invoke of the function the move path data transfer object will be filled with the value `INACTIVE_ID`.
    //
    clean: function(){
      this.data.resetValues();
    },
    
    // ### StateMachineData.movePath.clone
    // Clones the current selected path and returns it as plain javascript array.
    //
    clone: function(){
      var path = [];
      
      for( var i = 0, e = this.data.length; i < e; i++ ) {
        
        // code `-1` means the first empty slot of the list if we reach one of this items then the list is complete and further iteration can be prevented
        if( this.data[i] === -1 ) break;
        
        path[i] = this.data[i];
      }
      
      return path;
    },
    
    // ### StateMachineData.movePath.addCodeToPath
    // Appends a tile to the move path of a given action data memory object.
    //
    addCodeToPath: function( tx, ty, code ){
      
      // add code to path
      var wasAdded = model.addMoveCodeToPath( code, this.data );
      
      // if to much fuel would be needed then calculate a new (shortest) path to the next tile
      if( !wasAdded ) this.setPathByRecalculation( tx, ty );
    },
    
    // ### StateMachineData.movePath.setPathByRecalculation
    // Regenerates a path from the source position of an action data memory object to a given target position.
    //   
    setPathByRecalculation: function( tx, ty ){
      var data = controller.stateMachine.data;
      var source = data.source;
      var selection = data.selection;
      var movePath = data.movePath.data;
      
      this.data.resetValues();
      model.generatePath( source.x, source.y, tx, ty, selection, movePath );
    },
    
    // ### StateMachineData.movePath.fillMoveMap
    // Injects movable tiles into a action data memory object.
    //   
    fillMoveMap: function( x, y, unit ){
      var data = controller.stateMachine.data;
      model.fillMoveMap( data.source, data.selection, x, y, unit );
    }
  },
  
  // ### StateMachineData.menu
  // Holds some information about the current action menu.
  //
  menu: {
    
    // ### StateMachineData.menu.data
    // Menu list that contains all menu entries. This implementation is a cached list. The symantic size of the menu is marked by `controller.stateMachine.data.menuSize`.
    //  
    // @example
    //   data is [ entryA, entryB, entryC, null, null ]
    //   size is 3
    //   
    data: util.list( 20, null ),
    
    /* PREPARATION FOR EXTENDED MENUS - (0.3.6 - 0.4.0) */
    //
    // enabled: util.list( 20, null ),
    
    /* PREPARATION FOR EXTENDED MENUS - (0.3.6 - 0.4.0) */
    //
    //extraData: util.list( 20, null ),
    
    // ### StateMachineData.menu.size
    // Size of the menu.
    // 
    size: 0,
    
    // ### StateMachineData.menu.addEntry
    // Adds an object to the menu.
    //
    addEntry: function( entry, enabled, extraData ){
      if( DEBUG && this.size === this.data.length ) model.errorCorruptDataModel("add menu entry","menu is already full");
      
      this.data[ this.size ] = entry;
      
      /* PREPARATION FOR EXTENDED MENUS - (0.3.6 - 0.4.0) */
      //if( enabled !== false ) enabled = true;
      //this.enabled[ this.size ] = entry;
      //if( !extraData ) extraData = null;
      //this.extraData[ this.size ] = extraData;
      
      this.size++;
    },
    
    // ### StateMachineData.menu.clear
    // Cleans the menu.
    // 
    clean: function(){
      this.size = 0;
    },
    
    // ### StateMachineData.menu.generate
    // Prepares the menu for a given source and target position.
    // 
    generate: util.scoped( function(){
      var commandKeys;
      
      return function(){
        
        // lazy generate the command keys
        if( !commandKeys ) commandKeys = Object.keys( controller.actionObjects );
        
        // collect meta-data
        var checkMode;
        var result;
        var data            = controller.stateMachine.data;
        var mapActable      = false;
        var propertyActable = true;
        var property        = data.source.property;
        var unitActable     = true;
        var selectedUnit    = data.source.unit;
        var st_mode         = data.thereIsUnitRelationShip( data.source, data.target );
        var sst_mode        = data.thereIsUnitRelationShip( data.source, data.targetselection );
        var pr_st_mode      = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
        var pr_sst_mode     = data.thereIsUnitToPropertyRelationShip( data.source, data.targetselection );
        
        // check action types
        if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ) unitActable     = false;
        else if( !model.canAct( data.source.unitId )                        ) unitActable     = false;
        if( selectedUnit !== null                                           ) propertyActable = false;
        if( property === null || property.owner !== model.turnOwner         ) propertyActable = false;
        if( !unitActable && !propertyActable                                ) mapActable      = true;
        
        // check all meta-data in relation to all available game actions
        for( var i = 0, e = commandKeys.length; i < e; i++ ) {
          var action = controller.actionObjects[commandKeys[i]];
          
          // AI or remote players cannot be controlled by the a client
          if( !action.clientAction  && (
            !model.isClientPlayer( model.turnOwner ) ||
            controller.isPlayerAiControlled( model.turnOwner )
          )
            ) continue;
          
          // pre defined checkers
          if( action.unitAction ){
            if( !unitActable ) continue;
            
            // relation to unit
            if( action.relation ){
              checkMode = null;
              
              if( 	 	 action.relation[0] === "S" && action.relation[1] === "T"  ) checkMode = st_mode;
              else if( action.relation[0] === "S" && action.relation[1] === "ST" ) checkMode = sst_mode;
                else model.errorIllegalArguments("generate menu","illegal unit relation pattern in "+action.key+" action");
              
              result = false;
              for( var si=2, se=action.relation.length; si<se; si++ ){
                if( action.relation[si] === checkMode ) result = true;
              }
              
              if( !result ) continue;
            }
            
            // relation to property
            if( action.relationToProp ){
              checkMode = null;
              
              if( action.relation[0] === "S" && action.relationToProp[1] === "T"       ) checkMode = pr_st_mode;
              else if( action.relation[0] === "S" && action.relationToProp[1] === "ST" ) checkMode = pr_sst_mode;
                else model.errorIllegalArguments("generate menu","illegal property relation pattern in "+action.key+" action");
              
              result = false;
              for( var si=2, se=action.relationToProp.length; si<se; si++ ){
                if( action.relationToProp[si] === checkMode ) result = true;
              }
              
              if( !result ) continue;
            }
          }
          else if( action.propertyAction && !propertyActable      ) continue;
            else if( action.mapAction 			=== true && !mapActable ) continue;
              else if( action.clientAction		=== true && !mapActable ) continue;
          
          // if condition matches then add the entry to the menu list
          if( !(action.condition && !action.condition( data )) ){
            data.menu.addEntry( commandKeys[i] );
          }
        }
      };
    })
  },
  
  // ### StateMachineData.selection
  // Holds some informaton about the current selection map.
  //
  selection: util.scoped( function(){
    var sMap = util.selectionMap( MAX_SELECTION_RANGE * 4 + 1 );
    
    // ### StateMachineData.selection.prepare
    // Extension to the selection map. This one prepares the selection for the current data model.
    //
    sMap.prepare = function(){
      var target = controller.stateMachine.data.target;
      var x = target.x;
      var y = target.y;
      
      this.setCenter( x, y, -1 );
      
      var actObj = controller.stateMachine.data.action.object;
      actObj.prepareTargets( controller.stateMachine.data );
      
      // decide which selection mode will be used based on the given action object
      return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
    };
    
    return sMap;
  } ),
  
  // ### StateMachineData.selectionRange
  // The range of the selection cursor. Only needed in the free target selection screen.
  //
  selectionRange: -1,
  
  // ### StateMachineData.inMultiStep
  // If this value is true, then the state machine is in a multi step action that does some actions while holding the source object even after flush some sub actions.
  //
  inMultiStep: false
  
};
