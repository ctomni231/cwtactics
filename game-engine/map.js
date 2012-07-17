cwt.map = {

	_width: 0,
	_height: 0,

	_map: (function(){
		var a = [];
		for( var i=0; i<100; i++) a[i] = [];
		return a;
	})(),

	_units: (function(){
		var a = [];
		for( var i=0; i<800; i++) a[i] = { 
			x:0, 
			y:0, 
			type: null, 
			owner:-1 
		}
		return a;
	})(),

	_players: (function(){
		var a = [];
		for( var i=0; i<8; i++) a[i] = {
			team: -1,
			gold: 0
		};
		return a;
	})(),

	_properties: [],

	metrics: function(){
		return {
			width: this._width,
			height: this._height
		};
	},

	/**
	 * Returns an unit by its id.
	 *
	 * @param id
	 */
	unit: function(id){
		if( id < 0 || this._units.length <= id ) throw Error("invalid id");

		var o = this._units[id];
		if( o.owner === -1 ) return null; //throw Error("invalid id");

		return o;
	},

	/**
	 * Returns a player by its id.
	 *
	 * @param id
	 */
	player: function(id){
		if( id < 0 || this._players.length <= id ) throw Error("invalid id");

		var o = this._players[id];
		if( o.team === -1 ) return null; //throw Error("invalid id");

		return o;
	},

	/**
	 * Returns a property by its id.
	 *
	 * @param id
	 */
	property: function(id){
		if( id < 0 || this._properties.length <= id ) throw Error("invalid id");

		var o = this._properties[id];
		if( o.owner === -1 ) return null; //throw Error("invalid id");

		return o;
	},

	/**
	 * Calls a function on the registered properties.
	 */
	properties: function( cb, selector, pid ){
		this._select( this._properties, cb, selector, pid );
	},

	/**
	 * Calls a function on the registered units.
	 */
	units: function( cb, selector, pid ){
		this._select( this._units, cb, selector, pid );
	},

	/**
	 * Simple selection function to select a set out of a object list by a selector. A selector
	 * simply symbolizes a conditional selection.
	 *
	 * @param objs
	 * @param cb
	 * @param selector (optional)
	 * @param pid (optional)
	 */
	_select: function( objs, cb, selector, pid ){
		var obj;
		if( arguments.length === 2 ){
			// ALL OBJECTS

			for(var i = 0, e = objs.length; i < e; i++){
				obj = objs[i];

				// ignore inactive
				if( obj.owner !== -1 ) cb( obj );
			}
		}
		else{
			// WITH SELECTOR
			var pt = map.player(pid).team;

			for(var i = 0, e = objs.length; i < e; i++){
				obj = objs[i];

				// ignore inactive
				if( obj.owner !== -1 && selector( obj, pid, pt ) ) cb( obj );
			}
		}
	},

	/**
	 * Loads a map and initializes the game context.
	 */
	loadMap: function( data ){

		// meta data
		this._width = data.width;
		this._height = data.height;

		// filler
		for( var x=0, e1=this._width; x<e1; x++ ){
			for( var y=0, e2=this._height; y<e2; y++ ){
				cwt.map._map[x][y] = data.filler;
			}
		}

		// special tiles
		cwt.util.each( data.data , function( col, x ){
			cwt.util.each( col , function( tile, y ){
				cwt.map._map[x][y] = tile;
			});
		});

		// players
		for( var i = 0, e = data.players.length; i<e; i++){
			var plD = data.players[i];

			this._players[i].gold = plD.gold;
			this._players[i].team = plD.team;
		}

		// units
		for( var i = 0, e = data.units.length; i<e; i++){
			var unit = data.units[i];
			this._units[i].x = unit.x;
			this._units[i].y = unit.y;
			this._units[i].type = unit.type;
			this._units[i].owner = unit.owner;
		}

/*
		cwt.publish( "mapLoaded" ); */
	}
};