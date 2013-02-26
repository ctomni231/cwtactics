/**
 * Action process data memory object. It is used as data holder to transport
 * data between the single states of the state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine.data = {

   /**
    * Sets a position in the data object. The target name of the position will
    * be determined by the tags array.
    * 
    * @private
    * @param {Array} tags list of the position property names
    * @param {Number} x x coordinate
    * @param {Number} y y coordinate
    */
  setPosition_: function( tags, x,y ){
    var refObj;

    this[tags[0]] = x;
    this[tags[1]] = y;
    var isValid = (x !== -1 && y !== -1);
    var inFog = isValid? (model.fogData[x][y] === 0) : false;

    // ----- UNIT -----
    refObj = isValid? model.unitPosMap[x][y] : null;
    if( isValid && !inFog && refObj !== null ){
      this[tags[2]] = refObj;
      this[tags[3]] = model.extractUnitId(refObj);
    }
    else{
      this[tags[2]] = null;
      this[tags[3]] = -1;
    }

    // ----- PROPERTY -----
    refObj = isValid? model.propertyPosMap[x][y] : null;
    if( isValid && !inFog && refObj !== null ){
      this[tags[4]] = refObj;
      this[tags[5]] = model.extractPropertyId(refObj);
    }
    else{
      this[tags[4]] = null;
      this[tags[5]] = -1;
    }
  },

  /** X coordinate of the source position */
  sourceX:0,
  
  /** Y coordinate of the source position */
  sourceY:0,
  
  /** Unit object at the source position */        
  sourceUnit:null,
  
  /** Unit id at the source position */
  sourceUnitId:-1,
  
  /** Property object at the source position */
  sourceProperty:null,
  
  /** Property id at the source position */
  sourcePropertyId:-1,

  /** Property names of the source position */
  sourceTags_: [ "sourceX","sourceY","sourceUnit","sourceUnitId","sourceProperty","sourcePropertyId" ],

  /**
   * Sets the source position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setSource: function( x,y ){
    this.setPosition_( this.sourceTags_, x,y );
  },

  /** X coordinate of the target position */
  targetX:0,
  
  /** Y coordinate of the target position */
  targetY:0,
  
  /** Unit object at the target position */         
  targetUnit:null,
  
  /** Unit id at the target position */ 
  targetUnitId:-1,
  
  /** Property object at the target position */         
  targetProperty:null,
          
  /** Property id at the target position */ 
  targetPropertyId:-1,
          
  /** Property names of the target position */
  targetTags_: [ "targetX","targetY","targetUnit","targetUnitId","targetProperty","targetPropertyId" ],
          
  /**
   * Sets the target position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setTarget: function( x,y ){
    this.setPosition_( this.targetTags_, x,y );
  },

  /** X coordinate of the selection position */
  selectionX:0,
          
  /** Y coordinate of the selection position */
  selectionY:0,
  
  /** Unit object at the selection position */         
  selectionUnit:null,
          
  /** Unit id at the selection position */ 
  selectionUnitId:-1,
          
  /** Property object at the selection position */
  selectionProperty:null,
          
  /** Property id at the selection position */
  selectionPropertyId:-1,

  /** Property names of the selection position */
  selectionTags_: [ "selectionX","selectionY","selectionUnit","selectionUnitId","selectionProperty","selectionPropertyId" ],
          
  /**
   * Sets the selection position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setSelectionTarget: function( x,y ){
    this.setPosition_( this.selectionTags_, x,y );
  },

  // -------------------------------------------------

  /**
   * Move path of a selected unit.
   */
  movePath: [],

  /**
   * Cleans the move path from move codes.
   */
  cleanMovepath: function(){
    this.movePath.splice(0);
  },

  /**
   * Clones the path and returns the created array.
   */
  cloneMovepath: function(){
    var path = [];
    for( var i=0,e=this.movePath.length; i<e; i++ ){
      path[i] = this.movePath[i];
    }

    return path;
  },

  // -------------------------------------------------

  /**
   * Selection action key.
   */
  action: null,
          
  /**
   * Selected sub action object.
   */
  subaction: null,
          
  /**
   * Action object that represents the selected action.
   */
  actionObject: null,

  // -------------------------------------------------

  /**
   * X coordinate of the selection data.
   */
  selectionCX:0,
  
  /**
   * Y coordinate of the selection data.
   */        
  selectionCY:0,
          
  /**
   * Data matrix of the selection data.
   */
  selectionData: util.matrix(
    CWT_MAX_SELECTION_RANGE*4+1,
    CWT_MAX_SELECTION_RANGE*4+1,
    0
  ),
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} defValue value that will be set into every cell of the matrix
   */
  setSelectionCenter: function( x,y, defValue ){
    var data = this.selectionData;
    var e = data.length;
    var cx = x;
    var cy = y;
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        data[x][y] = defValue;
      }
    }

    // right bounds are not important
    this.selectionCX = Math.max(0, cx - CWT_MAX_SELECTION_RANGE*2);
    this.selectionCY = Math.max(0, cy - CWT_MAX_SELECTION_RANGE*2);
  },

  /**
   * Returns the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  getSelectionValueAt: function( x,y ){
    var data = this.selectionData;
    var cy = this.selectionCY;
    var cx = this.selectionCX;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;

    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
      return -1;
    }
    else return data[x][y];
  },
 
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} value value that will be set
   */
  setSelectionValueAt: function( x,y, value ){
    var data = this.selectionData;
    var cy = this.selectionCY;
    var cx = this.selectionCX;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;

    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
      util.raiseError();
    }
    else data[x][y] = value;
  },

  /**
   * Prepares the selection for a the saved action key and returns the correct selection state key.
   */
  prepareSelection: function(){
    var x = this.targetX;
    var y = this.targetY;

    this.setSelectionCenter( x,y, -1 );
    this.actionObject.prepareTargets( this );

    return ( this.actionObject.targetSelectionType === "A" )? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
  },

  // -------------------------------------------------

  /**
   * Menu list that contains all menu entries. This implementation is a cached list. The 
   * symantic size of the menu is marked by {@link controller.stateMachine.data.menuSize}.
   * 
   * @example
   *   data is [ entryA, entryB, entryC, null, null ]
   *   size is 3
   */
  menu: util.list( 20, null ),
          
  /**
   * Size of the menu.
   */
  menuSize:0,

  /**
   * Adds an object to the menu.
   * 
   * @param {Object} entry
   */
  addEntry: function( entry ){
    if( this.menuSize === this.menu.length ){
      util.raiseError();
    }

    this.menu[ this.menuSize ] = entry;
    this.menuSize++;
  },

  /**
   * Cleans the menu.
   */
  cleanMenu: function(){
    this.menuSize = 0;
  },

  /**
   * Prepares the menu for a given source and target position.
   */
  prepareMenu: function(){
    var commandKeys = Object.keys( controller.actionObjects_ );

    // ----- UNIT -----
    var unitActable = true;
    var selectedUnit = this.sourceUnit;
    if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ){
      unitActable = false;
    }
    else if( !model.canAct( this.sourceUnitId ) ) unitActable = false;

    // ----- PROPERTY -----
    var propertyActable = true;
    var property = this.sourceProperty;
    if( selectedUnit !== null ) propertyActable = false;
    if( property === null || property.owner !== model.turnOwner ){
      propertyActable = false;
    }

    for( var i=0,e=commandKeys.length; i<e; i++ ){
      var action = controller.getActionObject( commandKeys[i] );

      // IS USER CALLABLE ACTION ?
      if( !action.condition ) continue;

      // PRE DEFINED CHECKERS
      if( action.unitAction === true && !unitActable ) continue;
      if( action.propertyAction === true && !propertyActable ) continue;

      // CHECK CONDITION
      if( action.condition( this ) ){
        this.addEntry( commandKeys[i] );
      }
    }
  }

};