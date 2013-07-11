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
    refObj = isValid ? model.getUnitByPos(x,y): null;
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
    refObj = isValid ? model.getPropertyByPos(x,y) : null;
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

// The central finite state machine of the game engine.
//
controller.stateMachine = util.stateMachine({
  
  // ---
  
  NONE: {
    start: function( ev, mod ){
      
      // LOAD MODIFICATION
      model.loadModification( mod );
      
      return "IDLE";
    }
  },
  
  // ---
  
  IDLE:{
    onenter: function(){
      this.data.menu.clean();
      this.data.movePath.clean();
      
      this.data.action.selectedEntry = null;
      this.data.action.selectedSubEntry = null;
      this.data.action.object = null;
      
      this.history.splice(0);
      
      this.data.inMultiStep = false;
      this.data.makeMultistep = true;
      
      this.data.source.clean();
      this.data.target.clean();
      this.data.targetselection.clean();
    },
    
    action: function(ev, x, y){
      this.data.source.set(x,y);
      
      if ( this.data.source.unitId !== CWT_INACTIVE_ID && 
          this.data.source.unit.owner === model.turnOwner && 
          model.canAct( this.data.source.unitId ) ){
        
        this.data.target.set(x,y);
        this.data.movePath.clean();
        this.data.movePath.fillMoveMap();
        return "MOVEPATH_SELECTION";
      } 
      else{
        this.data.target.set( x,y );
        return "ACTION_MENU";
      }
    },
    
    cancel: function ( ev,x,y ) {
      return this.BREAK_TRANSITION;
    }
  },
  
  // ---
  
  MOVEPATH_SELECTION: {
    
    onenter: function( ev, x,y ){
      //this.data.target.clean();
    },
    
    action: function( ev,x,y ){
      if( this.data.selection.getValueAt(x,y) < 0){
        if( DEBUG ) util.log("break event because selection is not in the selection map");
        return this.BREAK_TRANSITION;
      }
      
      var ox = this.data.target.x;
      var oy = this.data.target.y;
      var dis = model.distance( ox,oy, x,y );
      
      this.data.target.set( x,y );
      
      if( dis === 0 ){
        return "ACTION_MENU";
      }
      else if( dis === 1 ){
        
        // ADD TILE TO PATH
        var code = model.moveCodeFromAtoB( ox,oy, x,y );
        controller.stateMachine.data.movePath.addCodeToPath( x,y, code );
        return this.BREAK_TRANSITION;
      }
        else{
          
          // GENERATE PATH
          controller.stateMachine.data.movePath.setPathByRecalculation( x,y );
          return this.BREAK_TRANSITION;
        }
    },
    
    cancel: function(){
      this.data.target.clean();
      return this.lastState;
    }
    
  },
  
  // ---
  
  ACTION_MENU:{
    onenter: function(){
      this.data.menu.clean();
      this.data.menu.generate();
      if( this.data.menu.size === 0 ){        
        this.data.target.clean();
        return this.BREAK_TRANSITION;
      }
    },
    
    action:function( ev, index ){
      var action = this.data.menu.data[ index ];
      var actObj = controller.actionObjects[action];
      
      this.data.action.selectedEntry = action;
      this.data.action.object = actObj;
      
      if( actObj.prepareMenu !== null ) return "ACTION_SUBMENU";
      else if( actObj.isTargetValid !== null ) return "ACTION_SELECT_TILE";
        else if( actObj.prepareTargets !== null && actObj.targetSelectionType === "A" ) return this.data.selection.prepare();
        else return "FLUSH_ACTION";
    },
    
    cancel:function(){
      this.data.target.clean();
      return this.lastState;
    }
  },
  
  // ---
  
  ACTION_SUBMENU:{
    onenter: function(){
      if( !this.data.inMultiStep ){
        this.data.menu.clean();
        this.data.action.object.prepareMenu( this.data );
        if( this.data.menu.size === 0 ){        
          util.raiseError("sub menu cannot be empty");
        }
      }
    },
    
    action: function( ev, index ){
      var action = this.data.menu.data[ index ];
      
      if( action === "done" ){
        return "IDLE";
      }
      
      this.data.action.selectedSubEntry = action;
      
      if( this.data.action.object.prepareTargets !== null && 
         this.data.action.object.targetSelectionType === "B" ){
        
        return this.data.selection.prepare();
      }
      else return "FLUSH_ACTION";
    },
    
    
    cancel: function(){
      if( this.data.inMultiStep ) return this.lastState;
      
      this.data.menu.clean();
      this.data.menu.generate();
      
      return this.lastState;
    }
  },
  
  // ---
  
  
  
  // ---
  
  ACTION_SELECT_TARGET_A: {
    
    onenter: function(){
      this.data.targetselection.clean();
    },
    
    action: function( ev,x,y ){
      if( this.data.selection.getValueAt(x,y) < 0){
        if( DEBUG ) util.log("break event because selection is not in the map");
        return this.BREAK_TRANSITION;
      }
      
      this.data.targetselection.set(x,y);
      
      return "FLUSH_ACTION";
    },
    
    cancel: function(){
      return this.lastState;
    }
    
  },
  
  // ---
  
  ACTION_SELECT_TARGET_B: {
    
    onenter: function(){
      this.data.targetselection.clean();
    },
    
    action: function( ev,x,y ){
      if( this.data.selection.getValueAt(x,y) < 0){
        if( DEBUG ) util.log("break event because selection is not in the map");
        return this.BREAK_TRANSITION;
      }
      
      this.data.targetselection.set(x,y);
      
      return "FLUSH_ACTION";
    },
    
    cancel: function(){
      return this.lastState;
    }
    
  },
  
  // ---
  
  ACTION_SELECT_TILE: {
    
    onenter: function(){
      this.data.targetselection.clean();
    },
    
    action: function( ev,x,y ){      
      if( this.data.action.object.isTargetValid( this.data, x,y) ){
        this.data.targetselection.set(x,y);
        
        return "FLUSH_ACTION";
      }
      else return this.BREAK_TRANSITION;
    },
    
    cancel: function(){
      this.data.targetselection.clean();
      return this.lastState;
    }
    
  },
  
  // ---
  
  FLUSH_ACTION: {
    actionState: function(){
      var trapped = controller.buildAction();
      
      // IF ACTION IS A MULTISTEP ACTION THEN PLACE A SYMBOLIC WAIT COMMAND
      if( !trapped && this.data.action.object.multiStepAction ){
        // this.data.inMultiStep = true;
        model.invokeNextStep_.callAsCommand();
        return "MULTISTEP_IDLE";
      }
      else return "IDLE";
    }  
  },
  
  // ---
  
  MULTISTEP_IDLE: {
    nextStep: function(){
      var actObj = this.data.action.object;
      
      this.data.movePath.clean();
      this.data.menu.clean();
      
      actObj.prepareMenu( this.data );
      this.data.menu.addEntry("done");
      
      this.data.inMultiStep = true;
      return ( this.data.menu.size > 1 )? "ACTION_SUBMENU": "IDLE";
      
    }
  }
  
  // ---
  
});

// Action process data memory object. It is used as data holder to transport
// data between the single states of the state machine of the game engine.
// 
controller.stateMachine.data = {
  
  
  // ---
  
  source: Object.create(controller.TaggedPosition),
  
  target: Object.create(controller.TaggedPosition),
  
  targetselection: Object.create(controller.TaggedPosition),
  
  // @param {controller.TaggedPosition} posA
  // @param {controller.TaggedPosition} posB
  // @param expMode
  // @returns {Boolean}
  // 
  thereIsUnitRelationShip: function( posA, posB ){
    if( posA.unit && posA.unit === posB.unit ) return model.MODE_SAME_OBJECT;
    
    return model.relationShipCheck( 
      ( posA.unit !== null )? posA.unit.owner : null, 
      ( posB.unit !== null )? posB.unit.owner : null
    );
  },
  
  // @param {controller.TaggedPosition} posA
  // @param {controller.TaggedPosition} posB
  // @param expMode
  // @returns {Boolean}
  // 
  thereIsUnitToPropertyRelationShip: function( posA, posB ){
    return model.relationShipCheck( 
      ( posA.unit     !== null )? posA.unit.owner : null, 
      ( posB.property !== null )? posB.property.owner : null
    );
  },
  
  // ---
  
  action: {
    
    // Selected sub action object.
    selectedEntry: null,
    
    // Selected sub action object.
    selectedSubEntry: null,
    
    // Action object that represents the selected action.
    object: null
    
  },
  
  // ---
  
  movePath: {
    
    ILLEGAL_MOVE_FIELD: -1,
    
    data:[],
    
    // Cleans the move path from move codes.
    clean: function() {
      this.data.splice(0);
    },
    
    // Clones the path and returns the created array.
    clone: function() {
      var path = [];
      for (var i = 0, e = this.data.length; i < e; i++) {
        path[i] = this.data[i];
      }
      return path;
    },
    
    // Appends a tile to the move path of a given action data memory object.
    // 
    // @param tx target x coordinate
    // @param ty target y coordinate
    // @param code move code to the next tile
    //
    addCodeToPath: function( tx, ty, code ){
      var movePath = controller.stateMachine.data.movePath.data;
      
      // GO BACK
      var lastCode = movePath[movePath.length-1];
      switch( code ){
          
        case model.MOVE_CODE_UP: 
          if( lastCode === model.MOVE_CODE_DOWN ){
            movePath.pop();
            return;
          }
          break;
          
        case model.MOVE_CODE_DOWN: 
          if( lastCode === model.MOVE_CODE_UP ){
            movePath.pop();
            return;
          }
          break;
          
        case model.MOVE_CODE_LEFT:
          if( lastCode === model.MOVE_CODE_RIGHT ){
            movePath.pop();
            return;
          }
          break;
          
        case model.MOVE_CODE_RIGHT:
          if( lastCode === model.MOVE_CODE_LEFT ){
            movePath.pop();
            return;
          }
          break;
          
        default : util.raiseError();
      }
      
      var source = controller.stateMachine.data.source;
      var unit = source.unit;
      var fuelLeft = unit.fuel;
      var fuelUsed = 0; 
      movePath.push( code );
      var points =  unit.type.range;
      
      if( fuelLeft < points ) points = fuelLeft;
      
      var cx = source.x;
      var cy = source.y;
      for( var i=0,e=movePath.length; i<e; i++ ){
        
        switch( movePath[i] ){
          case model.MOVE_CODE_UP: cy--; break;
          case model.MOVE_CODE_DOWN: cy++; break;
          case model.MOVE_CODE_LEFT: cx--; break;
          case model.MOVE_CODE_RIGHT: cx++; break;
          default : util.raiseError();
        }
        
        // FUEL CONSUMPTION
        fuelUsed += controller.stateMachine.data.selection.getValueAt(cx,cy);
      }
      
      // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
      if( fuelUsed > points ){
        this.setPathByRecalculation( tx,ty );
      }
    },
    
    // Regenerates a path from the source position of an action data memory object
    // to a given target position.
    //
    // @param tx target x coordinate
    // @param ty target y coordinate
    //   
    setPathByRecalculation: function( tx,ty ){
      var source = controller.stateMachine.data.source;
      var selection = controller.stateMachine.data.selection;
      var movePath = controller.stateMachine.data.movePath.data;
      var stx = source.x;
      var sty = source.y;
      
      var graph = new Graph( selection.data );
      
      var dsx = stx - selection.centerX;
      var dsy = sty - selection.centerY;
      var start = graph.nodes[ dsx ][ dsy ];
      
      var dtx = tx - selection.centerX;
      var dty = ty - selection.centerY;
      var end = graph.nodes[ dtx ][ dty ];
      
      var path = astar.search(graph.nodes, start, end);
      
      var codesPath = [];
      var cx = stx;
      var cy = sty;
      var cNode;
      
      for (var i = 0, e = path.length; i < e; i++) {
        cNode = path[i];
        
        var dir;
        if (cNode.x > cx) dir = model.MOVE_CODE_RIGHT;
        else if (cNode.x < cx) dir = model.MOVE_CODE_LEFT;
          else if (cNode.y > cy) dir = model.MOVE_CODE_DOWN;
          else if (cNode.y < cy) dir = model.MOVE_CODE_UP;
            else util.raiseError();
        
        codesPath.push(dir);
        
        cx = cNode.x;
        cy = cNode.y;
      }
      
      movePath.splice(0);
      for( var i=0,e=codesPath.length; i<e; i++ ){
        movePath[i] = codesPath[i];
      }
    },
    
    // Injects movable tiles into a action data memory object.
    //  
    // @param data action data memory
    //   
    fillMoveMap: function( x,y,unit ){
      var source = controller.stateMachine.data.source;
      var selection = controller.stateMachine.data.selection;    
      if( !unit ) unit = source.unit;
      var mType  = model.moveTypes[ unit.type.movetype ];
      var player = model.players[unit.owner];
      
      if( typeof x !== "number" ) x = source.x;
      if( typeof y !== "number" ) y = source.y;
      
      controller.prepareTags( x, y, model.extractUnitId(unit) );
      var range  = controller.scriptedValue(unit.owner,"moverange", unit.type.range );
      
      // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
      if( unit.fuel < range ) range = unit.fuel;
      
      // ADD START TILE TO MAP
      selection.setCenter( x,y, this.ILLEGAL_MOVE_FIELD );
      selection.setValueAt( x,y,range );
      
      // FILL MAP ( ONE STRUCT IS X;Y;LEFT_POINTS )
      var toBeChecked = [ x,y,range ];
      var checker = [
        -1,-1,
        -1,-1,
        -1,-1,
        -1,-1
      ];
      
      while( true ){
        var cHigh      = -1;
        var cHighIndex = -1;
        
        for( var i=0,e=toBeChecked.length; i<e; i+=3 ){
          var leftPoints = toBeChecked[i+2];
          
          if( leftPoints !== undefined && leftPoints !== null ){
            if( cHigh === -1 || leftPoints > cHigh ){
              cHigh = leftPoints;
              cHighIndex = i;
            }
          }
        }
        if( cHighIndex === -1 ) break;
        
        var cx = toBeChecked[cHighIndex];
        var cy = toBeChecked[cHighIndex+1];
        var cp = toBeChecked[cHighIndex+2];
        
        // CLEAR
        toBeChecked[cHighIndex  ] = null;
        toBeChecked[cHighIndex+1] = null;
        toBeChecked[cHighIndex+2] = null;
        
        // SET NEIGHTBOURS
        if(cx>0                 ){ checker[0] = cx-1; checker[1] = cy; }
        else{                      checker[0] = -1  ; checker[1] = -1; }
        if(cx<model.mapWidth-1  ){ checker[2] = cx+1; checker[3] = cy; }
        else{                      checker[2] = -1  ; checker[3] = -1; }
        if(cy>0                 ){ checker[4] = cx; checker[5] = cy-1; }
        else{                      checker[4] = -1; checker[5] = -1;   }
        if(cy<model.mapHeight-1 ){ checker[6] = cx; checker[7] = cy+1; }
        else{                      checker[6] = -1; checker[7] = -1;   }
        
        // CHECK NEIGHBOURS
        for( var n=0; n<8; n += 2 ){
          if( checker[n] === -1 ) continue;
          
          var tx = checker[n  ];
          var ty = checker[n+1];
          
          var cost = model.moveCosts( mType, tx, ty );
          if( cost !== -1 ){
            
            var cunit = model.unitPosMap[tx][ty];
            if( cunit !== null &&
               model.fogData[tx][ty] > 0 &&
               !cunit.hidden &&
               model.players[cunit.owner].team !== player.team ){
              continue;
            }
            
            var rest = cp-cost;
            if( rest >= 0 &&
               rest > selection.getValueAt(tx,ty) ){
              
              // ADD TO MOVE MAP
              selection.setValueAt( tx,ty,rest );
              
              // ADD TO CHECKER
              for( var i=0,e=toBeChecked.length; i<=e; i+=3 ){
                if( toBeChecked[i] === null ||i===e ){
                  toBeChecked[i  ] = tx;
                  toBeChecked[i+1] = ty;
                  toBeChecked[i+2] = rest;
                  break;
                }
              }
            }
          }
        }
      }
      
      // CONVERT LEFT POINTS TO MOVE COSTS
      for( var x=0,xe=model.mapWidth; x<xe; x++ ){
        for( var y=0,ye=model.mapHeight; y<ye; y++ ){
          if( selection.getValueAt(x,y) !== this.ILLEGAL_MOVE_FIELD ){
            
            var cost = model.moveCosts( mType,x,y );
            selection.setValueAt( x, y, cost );
          }
        }
      }
    }
  },
  
  // ---
  
  // ---
  
  menu: {
    
    // Menu list that contains all menu entries. This implementation is a cached list. The 
    // symantic size of the menu is marked by {@link controller.stateMachine.data.menuSize}.
    //  
    // @example
    //   data is [ entryA, entryB, entryC, null, null ]
    //   size is 3
    //   
    data : util.list(20, null),
    
    // Size of the menu.
    // 
    size: 0,
    
    // Adds an object to the menu.
    // 
    // @param {Object} entry
    // 
    addEntry: function(entry) {
      if (this.size === this.data.length) {
        util.raiseError();
      }
      
      this.data[ this.size ] = entry;
      this.size++;
    },
    
    // Cleans the menu.
    // 
    clean: function() {
      this.size = 0;
    },
    
    // Prepares the menu for a given source and target position.
    // 
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
  },
  
  // ---
  
  selection: {
    
    // X coordinate of the selection data.
    // 
    centerX: 0,
    
    // Y coordinate of the selection data.
    // 
    centerY: 0,
    
    // Data matrix of the selection data.
    // 
    data: util.matrix( 
      CWT_MAX_SELECTION_RANGE * 4 + 1, 
      CWT_MAX_SELECTION_RANGE * 4 + 1, 
      0 
    ),
    
    // Sets the value of a position x,y in the selectiond data.
    //  
    // @param {Number} x x coordinate
    // @param {Number} y y coordinate
    // @param {Number} defValue value that will be set into every cell of the matrix
    //   
    setCenter: function(x, y, defValue) {
      var data = this.data;
      var e = data.length;
      var cx = x;
      var cy = y;
      for (var x = 0; x < e; x++) {
        for (var y = 0; y < e; y++) {
          data[x][y] = defValue;
        }
      }
      
      // right bounds are not important
      this.centerX = Math.max(0, cx - CWT_MAX_SELECTION_RANGE * 2);
      this.centerY = Math.max(0, cy - CWT_MAX_SELECTION_RANGE * 2);
    },
    
    // Returns the value of a position x,y in the selectiond data.
    //  
    // @param {Number} x x coordinate
    // @param {Number} y y coordinate
    //   
    getValueAt: function(x, y) {
      var data = this.data;
      var cy = this.centerX;
      var cx = this.centerY;
      x = x - cx;
      y = y - cy;
      var maxLen = data.length;
      
      if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
        return -1;
      }
      else
        return data[x][y];
    },
    
    // Sets the value of a position x,y in the selectiond data.
    //  
    // @param {Number} x x coordinate
    // @param {Number} y y coordinate
    // @param {Number} value value that will be set
    //   
    setValueAt: function(x, y, value) {
      var data = this.data;
      var cy = this.centerX;
      var cx = this.centerY;
      x = x - cx;
      y = y - cy;
      var maxLen = data.length;
      
      if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
        util.raiseError();
      }
      else
        data[x][y] = value;
    },
    
    // Prepares the selection for a the saved action key and returns the correct selection state key.
    // 
    prepare: function() {
      var target = controller.stateMachine.data.target;
      var x = target.x;
      var y = target.y;
      
      this.setCenter(x, y, -1);
      
      var actObj = controller.stateMachine.data.action.object;
      actObj.prepareTargets(controller.stateMachine.data);
      
      return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
    },
    
    // 
    nextValidPosition: function( x,y, minValue, walkLeft, cb ){
      var data = this.data;
      var cy = this.centerX;
      var cx = this.centerY;
      x = x - cx;
      y = y - cy;
      var maxLen = data.length;
      
      // OUT OF BOUNDS ?
      if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
        
        // START BOTTOM RIGHT
        if( walkLeft ){
          x = maxLen-1;
          y = maxLen-1;
        }
        // START TOP LEFT
        else{
          x = 0;
          y = 0;
        }
      }
      
      // WALK TO THE NEXT TARGET
      var mod = (walkLeft)? -1 : +1;
      y += mod;
      for( ; (walkLeft)? x>=0 : x<maxLen ; x += mod ){
        for( ; (walkLeft)? y>=0 : y<maxLen ; y += mod ){
          
          // VALID POSITION
          if( data[x][y] >= minValue ){
            
            if( DEBUG ) util.log("found the next valid position at",x,",",y);
            cb(x,y);
            return;
          }
        }
        y = ( walkLeft )? maxLen-1 : 0;
      }
      
      if( DEBUG ) util.log("could not find the next valid position");
    }
  },
  
  // ---
  
  inMultiStep: false
  
};