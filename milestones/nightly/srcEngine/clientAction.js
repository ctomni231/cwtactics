cwt.defineLayer( CWT_LAYER_ACTION_ACCESS,
  function( userAction, action, data, util ){

    /** @constant */
    userAction.STATE_IDLE = 0;

    /** @constant */
    userAction.STATE_SELECT_MOVE_PATH = 1;

    /** @constant */
    userAction.STATE_SELECT_ACTION = 2;

    /** @constant */
    userAction.STATE_SELECT_ACTION_TARGET = 3;

    // CURRENT STATE OF THE ACTION LAYER
    var curState = userAction.STATE_IDLE;

    // MESSAGE BUFFER VARS
    var bufferReadIndex = 0;
    var bufferWriteIndex = 0;
    var bufferData = util.list( CWT_MAX_BUFFER_SIZE, null );

    // SELECTION API VARS
    var selectionTargets = util.matrix(
      CWT_MAX_SELECTION_RANGE*2+1,
      CWT_MAX_SELECTION_RANGE*2+1,
      -1
    );

    var selectionScreenY = -1;
    var selectionScreenX = -1;

    var sourceX = -1;
    var sourceY = -1;
    var targetX = -1;
    var targetY = -1;
    var path = null;
    var selectedObject = null;
    var selectedAction = null;

    // ACTION TARGET VARS
    var actionTargetX = -1;
    var actionTargetY = -1;
    var actionList = null;

    /**
     * Pushes a message into the message bugger.
     *
     * @param msg message content as js object
     * @throws error if buffer is full
     */
    var pushMsgToBuffer = function( msg ){
      if( bufferData[ bufferWriteIndex ] !== null ){
        util.logError("message buffer is full");
      }

      if( util.DEBUG ) util.logInfo(
        "adding message (",
        util.objectToJSON(msg),
        ") to buffer"
      );

      // WRITE MSG AND INCREASE COUNTER
      bufferData[ bufferWriteIndex ] = msg;
      bufferWriteIndex++;
      if( bufferWriteIndex === CWT_MAX_BUFFER_SIZE ) bufferWriteIndex = 0;
    };

    /**
     * Returns true if the buffer is not empty else false.
     */
    var isMsgInBuffer = function(){
      return ( bufferData[ bufferReadIndex ] !== null );
    };

    /**
     * Pops a message from the message buffer and returns its content.
     *
     * @return message content
     * @throws error if buffer is empty
     */
    var popMsgFromBuffer = function(){
      if( bufferData[ bufferReadIndex ] === null ){
        util.logError("message buffer is empty");
      }
      var msg = bufferData[ bufferReadIndex ];

      // INCREASE COUNTER AND FREE SPACE
      bufferData[ bufferReadIndex ] = null;
      bufferReadIndex++;
      if( bufferReadIndex === CWT_MAX_BUFFER_SIZE ) bufferReadIndex = 0;

      return msg;
    };

    var returnPath = function( tx , ty ){
      var stx = sourceX;
      var sty = sourceY;

      if( util.DEBUG ) util.logInfo(
        "searching path from (",stx,",",sty,") to (",tx,",",ty,")"
      );

      var unit = selectedObject;
      var type = data.unitSheet( unit.type );
      var mType = data.movetypeSheet( type.moveType );

      // var graph = new Graph( nodes );
      var graph = new Graph( selectionTargets );
      var start = graph.nodes[stx-selectionScreenX][sty-selectionScreenY];
      var end = graph.nodes[tx-selectionScreenX][ty-selectionScreenY];
      var path = astar.search( graph.nodes, start, end );

      if( util.DEBUG ) util.logInfo("calculated way is",path);

      var codesPath = [];
      var cx = stx-selectionScreenX;
      var cy = sty-selectionScreenY;
      var cNode;

      for( var i=0,e=path.length; i<e; i++ ){
        cNode = path[i];

        var dir;
        if( cNode.x > cx ) dir = 1;
        if( cNode.x < cx ) dir = 3;
        if( cNode.y > cy ) dir = 2;
        if( cNode.y < cy ) dir = 0;

        if( dir === undefined ) throw Error();

        codesPath.push( dir );

        cx = cNode.x;
        cy = cNode.y;
      }

      return codesPath;
    };

    /**
     * Generates the action list for the current selected tile ( or object if
     * tile is a property or occupied by an unit ).
     */
    var generateActionList = function(){
      var list = [];
      var actions = Object.keys( action );
      var rStP = data.RELATIONSHIP_NONE;
      var rStU = data.RELATIONSHIP_NONE;
      var property = data.propertyByPos( targetX, targetY );
      var unit = data.unitByPos( targetX, targetY );

      for( var i=0,e=actions.length; i<e; i++ ){
        var key = actions[i];

        // x,y,rStP,rStU,selected,property,unit
        if( action[key].condition(
          targetX,targetY,
          rStP,rStU,
          selectedObject,
          property,unit
        )){

          list.push(key);
        }
      }

      actionList = list;
      return list;
    };

    /**
     * Flushes the current saved user action data into action command objects.
     */
    var flushAction = function(){
      // TODO --> SHARE CALL

      var property = data.propertyByPos( targetX, targetY );
      var unit = data.unitByPos( targetX, targetY );

      // DO MOVE
      if( path !== null ){
        pushMsgToBuffer({
          k: "move",
          a:[
            data.extractUnitId( selectedObject ),
            sourceX, sourceY,
            path
          ]
        });
      }

      // DO ACTION
      pushMsgToBuffer({
        k: selectedAction,
        a:[
          targetX, targetY,
          ( selectedObject === null )? -1 : data.extractUnitId(selectedObject),
          ( property === null )? -1 : data.extractPropertyId(property),
              ( unit === null )? -1 : data.extractUnitId(unit),
          actionTargetX, actionTargetY
        ]
      });

      userAction.resetAction();
    };

    /**
     * Clears the selection map for a new selection process.
     *
     * @param centerX
     * @param centerY
     */
    var clearSelection = function( centerX, centerY ){
      var e = CWT_MAX_SELECTION_RANGE*2+1;
      for( var x = 0; x<e; x++ ){
        for( var y = 0; y<e; y++ ){
          selectionTargets[x][y] = -1; }}

      // right bounds are not important
      centerX = Math.max( 0, centerX - CWT_MAX_SELECTION_RANGE );
      centerY = Math.max( 0, centerY - CWT_MAX_SELECTION_RANGE );

      selectionScreenX = centerX;
      selectionScreenY = centerY;
    };

    /**
     *
     * @param x
     * @param y
     */
    var getValueOfSelectionTile = function( x,y ){
      var sx = x - selectionScreenX;
      var sy = y - selectionScreenY;
      var maxLen = 2*CWT_MAX_SELECTION_RANGE+1;

      if( sx < 0 || sy < 0 || sx >= maxLen || sy >= maxLen ){
        return -1;
      }
      else return selectionTargets[sx][sy];
    };

    /**
     * @param x
     * @param y
     * @param value (default=1)
     */
    var setValueOfSelectionTile = function( x,y, value ){
      var sx = x - selectionScreenX;
      var sy = y - selectionScreenY;
      var len = CWT_MAX_SELECTION_RANGE*2+1;
      if( value === undefined ) value = 1;

      if( sx < 0 || sx >= len || sy < 0 || sy >= len ){
        util.logError("position (",x,",",y,") is out of move map bounds");
      }
      else selectionTargets[sx][sy] = value;
    };


    // ###################### PUBLIC API ################################
    // ##################################################################

    /**
     * Returns the current state of the user action layer.
     */
    userAction.currentState = function(){
      return curState;
    };

    /**
     *
     */
    userAction.resetAction = function(){
      if( util.DEBUG ) util.logInfo("reset action API to clean state");
      curState = userAction.STATE_IDLE;
      path = null;
    };

    userAction.getValueOfSelectionTile = function(x,y){
      return getValueOfSelectionTile(x,y);
    };

    userAction.getSelectableTiles = function(){
      return selectionTargets;
    };

    /**
     * Selects a tile by a position. If the tile is a property or occupied by
     * an own unit, the move path selection state will be choosen and the
     * selected object will be set as selected data.
     *
     * @param x
     * @param y
     */
    userAction.selectTile = function( x,y ){

      var pid = data.getTurnOwner();
      switch( curState ){

        // -----------------------------------------------------
        case userAction.STATE_IDLE :
          sourceX = x;
          sourceY = y;

          var unit = data.unitByPos(x,y);
          if( unit !== null && unit.owner === pid ){

            if( data.canAct( data.extractUnitId(unit) ) ){
              selectedObject =  unit;

              curState = userAction.STATE_SELECT_MOVE_PATH;

              clearSelection(x,y);
              data.prepareMovepathSelection(
                data.extractUnitId(unit),
                getValueOfSelectionTile,
                setValueOfSelectionTile
              );
            }
            else{
              selectedObject = null;
              targetX = x;
              targetY = y;

              generateActionList();
              curState = userAction.STATE_SELECT_ACTION;
            }
          }
          else{
            var prop = data.propertyByPos(x,y);
            if( prop !== null && prop.owner === pid ){

              selectedObject = prop;
              targetX = x;
              targetY = y;

              generateActionList();
              curState = userAction.STATE_SELECT_ACTION;
            }
            else{

              selectedObject = null;
              targetX = x;
              targetY = y;

              generateActionList();
              curState = userAction.STATE_SELECT_ACTION;
            }
          }

          break;

        // -----------------------------------------------------
        case userAction.STATE_SELECT_ACTION_TARGET :
          actionTargetX = x;
          actionTargetY = y;
          flushAction();
          break;

        // -----------------------------------------------------
        case userAction.STATE_SELECT_MOVE_PATH :
          if( util.DEBUG ){
            util.logInfo("target pos selected, generating path by a star");
          }

          targetX = x;
          targetY = y;

          // MOVE BY POS MEANS A PATH MUST BE GENERATED
          if(path === null ){
            path = returnPath(x,y);
          }

          generateActionList();
          curState = userAction.STATE_SELECT_ACTION;

          if( util.DEBUG ){
            util.logInfo("got path",path,"with target pos (",x,",",y,")");
          }
          break;

        // -----------------------------------------------------
        default:
          util.logError("cannot select tile in current active state");
      }
    };

    userAction.generatePathTo = function( x,y ){
      return returnPath(x,y);
    };

    /**
     * Sets a move path.
     *
     * @param path
     */
    userAction.setPath = function( movepath ){
      if( util.DEBUG ){
        util.logInfo("path selected, calculating target position");
      }

      if( curState !== userAction.STATE_SELECT_MOVE_PATH ){
       util.logError("cannot set path because action API is not in move state");
      }

      var tx = sourceX;
      var ty = sourceY;

      for( var i=0,e=movepath.length; i<e; i++ ){
        switch( movepath[i] ){
          case data.MOVE_CODE_DOWN : ty++; break;
          case data.MOVE_CODE_RIGHT : tx++; break;
          case data.MOVE_CODE_UP : ty--; break;
          case data.MOVE_CODE_LEFT : tx--; break;
          default: util.logError("unknown move code",path[i]); throw Error();
        }
      }

      // SET TARGET BY PATH
      path = movepath;
      targetX = tx;
      targetY = ty;

      if( util.DEBUG ){
        util.logInfo("got path",path,"with target pos (",tx,",",ty,")");
      }
    };

    /**
     *
     */
    userAction.getEntryList = function(){
      switch( curState ){
        case userAction.STATE_SELECT_ACTION : return actionList;

        default : util.logError(
          "client action layer is not in a entry",
          "selection state"
        )
      }
    }

    /**
     * Selects an action key.
     *
     * @param actionKey
     */
    userAction.selectEntry = function( actionKey ){
      selectedAction = actionKey;
      if( action[actionKey].targetSelection === true ){
        userAction.STATE_SELECT_ACTION_TARGET;
        clearSelection( targetX, targetY);

        util.logError("not ready yet");
      }
      else{ flushAction(); }
    };

    userAction.getSelectedId = function(){
      return data.extractUnitId( selectedObject );
    };

    /**
     * Is a message object available?
     */
    userAction.hasNextAction = function(){
      return isMsgInBuffer();
    };

    /**
     * Pops and evaluates the next available action object from the user action
     * stack.
     *
     * @return action key if an action was in the stack, else null
     */
    userAction.evaluateNextAction = function(){

      // NO ACTION AVAILABLE --> NO ACTION EVALUATED
      if( !userAction.hasNextAction() ) return null;

      var msg = popMsgFromBuffer();

      if( msg.k === "move" ){

        // DO MOVE
        data.moveUnitFromAtoB.apply( null, msg.a );
        return msg;
      }
      else{

        // DO ACTION
        action[ msg.k ].action.apply( null, msg.a );
        return msg;
      }
    };

});
cwt.finalizeLayer( CWT_LAYER_ACTION_ACCESS );