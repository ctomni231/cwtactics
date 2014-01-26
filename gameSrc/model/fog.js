/**
 * @class
 */
cwt.Fog = my.Class({

	constructor:function(){

		// fog map
		this.data = cwt.List.generateMatrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT );

		// player id's that will be visible
		this.pids = cwt.List.generateList( MAX_PLAYER );
	},

	/**
	 * Modifies a visioner at a given position and player id.
	 */
	modifyVision_: function( x,y, pid, range, value ){
	  if( pid === INACTIVE_ID ) return; // ignore neutral objects

	  if(cwt.Config.getValue("fogEnabled") !== 1) return;

	  assert( model.map_isValidPosition(x,y) );
	  // assert( model.player_isValidPid(pid) );
	  assert( util.isInt(range) && range >= 0 );

	  controller.prepareTags( x, y );

	  // only real visioners ( units and radar properties ) can 
	  // alter the vision value via rules
	  if( range > 0 ) range = controller.scriptedValue( pid,"vision", range );

	  var clientVisible     = model.fog_visibleClientPids[pid];
	  var turnOwnerVisible  = model.fog_visibleTurnOwnerPids[pid];

	  // no active player owns this visioner
	  if( !clientVisible && !turnOwnerVisible ) return;

	  if( range === 0 ){

	    if( clientVisible )    model.fog_clientData[x][y]     += value;
	    if( turnOwnerVisible ) model.fog_turnOwnerData[x][y]  += value;
	  }
	  else{

	    var mH = model.map_height;
	    var mW = model.map_width;
	    var lX;
	    var hX;
	    var lY = y-range;
	    var hY = y+range;

	    if( lY < 0 ) lY = 0;
	    if( hY >= mH ) hY = mH-1;
	    for( ; lY<=hY; lY++ ){

	      var disY = Math.abs( lY-y );
	      lX = x-range+disY;
	      hX = x+range-disY;
	      if( lX < 0 ) lX = 0;
	      if( hX >= mW ) hX = mW-1;
	      for( ; lX<=hX; lX++ ){

	        // if( DEBUG ) util.log( "(",lX,",",lY,") changed fog by (",value,")" );

	        if( model.map_data[lX][lY].blocksVision && 
	            model.map_getDistance(x,y,lX,lY) > 1  ) continue;

	        if( clientVisible )    model.fog_clientData[lX][lY]     += value;
	        if( turnOwnerVisible ) model.fog_turnOwnerData[lX][lY]  += value;
	      }
	    }
	  }
	},

	/**
	 * Completely recalculates the fog data.
	 */
	fullRecalculation: function(){
	  var x;
	  var y;
	  var xe = model.map_width;
	  var ye = model.map_height;
	  var fogEnabled = (cwt.Config.getValue("fogEnabled") === 1);

	  // 1. reset fog maps
	  for( x=0 ;x<xe; x++ ){
	    for( y=0 ;y<ye; y++ ){

	      if( !fogEnabled ){
	        model.fog_clientData[x][y]    = 1;
	        model.fog_turnOwnerData[x][y] = 1;
	      }
	      else{
	        model.fog_clientData[x][y]    = 0;
	        model.fog_turnOwnerData[x][y] = 0;
	      }
	    }
	  }

	  // 2. add vision objects
	  if( fogEnabled ){
	    var vision;
	    for( x=0 ;x<xe; x++ ){
	      for( y=0 ;y<ye; y++ ){

	        var unit = model.unit_posData[x][y];
	        if( unit !== null ){
	          vision = unit.type.vision;
	          if( vision < 0 ) vision = 0;

	          model.events.modifyVisionAt( x,y, unit.owner, vision,1 );
	        }

	        var property = model.property_posMap[x][y];
	        if( property !== null ){
	          vision = property.type.vision;
	          if( vision < 0 ) vision = 0;

	          model.events.modifyVisionAt( x,y, property.owner, vision,1 );
	        }
	      }
	    }
	  }
	},

	/**
	 * Removes a visioner from the fog map.
	 */
	removeVisioner: function( x,y,pid,range ){
		this.modifyVision_(x,y,pid,range,+1);
	},

	/**
	 * Adds a visioner from the fog map.
	 */
	addVisioner: function( x,y,range ){
		this.modifyVision_(x,y,pid,range,-1);
	}
});