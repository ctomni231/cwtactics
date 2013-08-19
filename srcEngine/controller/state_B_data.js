// # StateMachine Data Module
// 
// This module holds the data model for the state machine.
// 

// Action process data memory object. It is used as data holder to transport
// data between the single states of the state machine of the game engine.
// 
controller.stateMachine.data = {
  
  // ### source
  // 
  // Position object ( instance of `controller.TaggedPosition` ) with rich information 
  // about the source position and some relations.
  // 
  source: Object.create( controller.TaggedPosition ),
    
  // ### target
  // 
  // Position object ( instance of `controller.TaggedPosition` ) with rich information 
  // about the target position and some relations.
  // 
  target: Object.create( controller.TaggedPosition ),
    
  // ### targetselection 
  //
  // Position object ( instance of `controller.TaggedPosition` ) with rich information 
  // about the selected position by an action and some relations.
  // 
  targetselection: Object.create( controller.TaggedPosition ),
    
  // ### thereIsUnitRelationShip
  // 
  // Does a unit to unit relationcheck. Both arguments `posA` and `posB` are objects of the type
  // `controller.TaggedPosition`. An instance of `model.relationModes` will be returned.
  //
  thereIsUnitRelationShip: function( posA, posB ){
    if( posA.unit && posA.unit === posB.unit ) return model.relationModes.SAME_OBJECT;

    return model.relationShipCheck(
      (posA.unit !== null) ? posA.unit.owner : null,
      (posB.unit !== null) ? posB.unit.owner : null
      );
  },
    
  // ### thereIsUnitToPropertyRelationShip
  // 
  // Does a unit to property relationcheck. Both arguments `posA` and `posB` are objects of the type
  // `controller.TaggedPosition`. An instance of `model.relationModes` will be returned.
  //
  thereIsUnitToPropertyRelationShip: function( posA, posB ){
    return model.relationShipCheck(
      (posA.unit !== null) ? posA.unit.owner : null,
      (posB.property !== null) ? posB.property.owner : null
      );
  },
    
  // #### Action Object
  // 
  // Holds some information about the current selected action with the selected sub data.
  // 
  action: {
    selectedEntry: null, // Selected sub action object.
    selectedSubEntry: null, // Selected sub action object.
    object: null                // Action object that represents the selected action.
  },
    
  // ### movePath
  //
  movePath: {
    
    data: util.list( constants.MAX_SELECTION_RANGE, constants.INACTIVE_ID ),
      
    // #### clean
    //
    // Cleans the move path. After invoke of the function the move path data transfer object will be filled
    // with the value `constants.INACTIVE_ID`.
    //
    clean: function(){
      this.data.resetValues();
    },
      
    // #### clone
    //
    // Clones the current selected path and returns it as plain javascript array.
    //
    clone: function(){
      var path = util.scoped( function(){
        var list = util.list( constants.MAX_SELECTION_RANGE, constants.INACTIVE_ID );

        list.getLastCode = function(){
          for( var i = this.data.length - 1; i > 0; i-- ) {
            if( this.data[i] !== constants.INACTIVE_ID ) return this.data[i];
          }

          return constants.INACTIVE_ID;
        };

        list.getSize = function(){
          for( var i = this.data.length - 1; i > 0; i-- ) {
            if( this.data[i] !== constants.INACTIVE_ID ) return i + 1;
          }

          return 0;
        };

        return list;
      } );

      for( var i = 0, e = this.data.length; i < e; i++ ) {

        // code `-1` means the first empty slot of the list
        // if we reach one of this items then the list is complete and further
        // iteration can be prevented
        if( this.data[i] === -1 ) break;

        path[i] = this.data[i];
      }

      return path;
    },
    
    // #### addCodeToPath
    // 
    // Appends a tile to the move path of a given action data memory object.
    //
    addCodeToPath: function( tx, ty, code ){

      // add code to path
      var wasAdded = model.addMoveCodeToPath( tx, ty, code, this.data );

      // if to much fuel would be needed then calculate a new (shortest) path to the next tile
      if( !wasAdded ) this.setPathByRecalculation( tx, ty );
    },
      
    // #### setPathByRecalculation
    //
    // Regenerates a path from the source position of an action data memory object
    // to a given target position.
    //   
    setPathByRecalculation: function( tx, ty ){
      var data = controller.stateMachine.data;
      var source = data.source;
      var selection = data.selection;
      var movePath = data.movePath.data;

      this.data.resetValues();
      model.generatePath( source.x, source.y, tx, ty, selection, movePath );
    },
      
    // #### fillMoveMap
    //
    // Injects movable tiles into a action data memory object.
    //   
    fillMoveMap: function( x, y, unit ){
      var data = controller.stateMachine.data;
      model.fillMoveMap( data.source, data.selection, x, y, unit );
    }
  },
    
  menu: {
  
    // Menu list that contains all menu entries. This implementation is a cached list. The 
    // symantic size of the menu is marked by {@link controller.stateMachine.data.menuSize}.
    //  
    // @example
    //   data is [ entryA, entryB, entryC, null, null ]
    //   size is 3
    //   
    data: util.list( 20, null ),
		
		enabled: util.list( 20, null ),
		
		extraData: util.list( 20, null ),
      
    // Size of the menu.
    // 
    size: 0,
      
    // Adds an object to the menu.
    // 
    // @param {Object} entry
    // 
    addEntry: function( entry, enabled, extraData ){
      if( this.size === this.data.length ) {
        util.raiseError();
      }

      this.data[ this.size ] = entry;
			
			if( enabled !== false ) enabled = true;
			this.enabled[ this.size ] = entry;
			
			if( !extraData ) extraData = null;
			this.extraData[ this.size ] = extraData;
			
      this.size++;
    },
      
    // Cleans the menu.
    // 
    clean: function(){
      this.size = 0;
    },
      
    // Prepares the menu for a given source and target position.
    // 
    generate: util.scoped( function(){
      var commandKeys;

      controller.generateActionList = function(){
        if( !commandKeys ) commandKeys = Object.keys( controller.actionObjects );

        var data = controller.stateMachine.data;
        var mapActable = false;

        // make preparations for unit actions
        var unitActable = true;
        var selectedUnit = data.source.unit;
        if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ) unitActable = false;
        else if( !model.canAct( data.source.unitId ) ) unitActable = false;

        // make preparations for property actions
        var propertyActable = true;
        var property = data.source.property;
        if( selectedUnit !== null ) propertyActable = false;
        if( property === null || property.owner !== model.turnOwner ) propertyActable = false;

        if( !unitActable && !propertyActable ) mapActable = true;
				
				var st_mode = data.thereIsUnitRelationShip( data.source, data.target );
				var sst_mode = data.thereIsUnitRelationShip( data.source, data.selection );
				var pr_st_mode = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
				var pr_sst_mode = data.thereIsUnitToPropertyRelationShip( data.source, data.selection );

        for( var i = 0, e = commandKeys.length; i < e; i++ ) {
          var action = controller.actionObjects[commandKeys[i]];

          // if the action is not user callable then continue with next action
          if( !action.condition ) continue;

          // pre defined checkers
					if( action.unitAction ){
						if( !unitActable ) continue;
    				
						// relation to unit
						if( action.relation ){
							var checkMode = null;
							if( 	 	 action.relation[0] === "S" && action.relation[0] === "T"  ) checkMode = st_mode;
							else if( action.relation[0] === "S" && action.relation[0] === "ST" ) checkMode = sst_mode;
							else model.criticalError( constants.error.UNKNOWN,constants.error.UNKNOWN );
							
							var result = false;
							for( var i=2, e=action.relation.length; i<e; i++ ){
								if( action.relation[i] === checkMode ) result = true;
							}
							
							if( !result ) continue;
						}
						
						// relation to property
						if( action.relationToProp ){
							var checkMode = null;
							if( action.relation[0] === "S" && action.relationToProp[0] === "T"  ){
								checkMode = pr_st_mode;
							}
							else if( action.relation[0] === "S" && action.relationToProp[0] === "ST" ){
								checkMode = pr_sst_mode;
							}
							else model.criticalError( constants.error.UNKNOWN,constants.error.UNKNOWN );
							
							var result = false;
							for( var i=2, e=action.relationToProp.length; i<e; i++ ){
								if( action.relationToProp[i] === checkMode ) result = true;
							}
							
							if( !result ) continue;
						}
					}
					
          // pre defined checkers
					if( action.propertyAction ){
						if( !propertyActable ) continue;
					}

          // pre defined checkers
          if( action.mapAction 			=== true && !mapActable ) continue;

          // if no condition is set or the condition matches 
					// then add the entry to the menu list
          if( !action.condition || action.condition( data ) ){
						data.menu.addEntry( commandKeys[i] );
					}
        }
      };
    } )
  },
  
  selection: util.scoped( function(){
    var sMap = util.selectionMap( constants.MAX_SELECTION_RANGE * 4 + 1 );

    sMap.prepare = function(){
      var target = controller.stateMachine.data.target;
      var x = target.x;
      var y = target.y;

      this.setCenter( x, y, -1 );

      var actObj = controller.stateMachine.data.action.object;
      actObj.prepareTargets( controller.stateMachine.data );

      return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
    };

    return sMap;
  } ),
  
  selectionRange: -1,
  
  inMultiStep: false

};