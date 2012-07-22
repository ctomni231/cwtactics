/**
 * @namespace
 */
var cwt = {

	mod:{},

	loadDefaultMod: function(){

		var mod = cwt.mod.awds;
		var list;

		list = mod.movetypes;
		for( var i=0,e=list.length; i<e; i++ ){
			cwt.db.parse( list[i], cwt.db.types.MOVE_TYPE );
		}

		list = mod.weapons;
		for( var i=0,e=list.length; i<e; i++ ){
			cwt.db.parse( list[i], cwt.db.types.WEAPON );
		}

		list = mod.tiles;
		for( var i=0,e=list.length; i<e; i++ ){
			cwt.db.parse( list[i], cwt.db.types.TILE );
		}

		list = mod.units;
		for( var i=0,e=list.length; i<e; i++ ){
			cwt.db.parse( list[i], cwt.db.types.UNIT );
		}
	},

	util:{

		each: function( obj, callback ){
			var keys = Object.keys(obj);
			for(var i = 0, e = keys.length; i < e; i++){
				callback( obj[keys[i]], keys[i] );
			}
		}
	},

	/**
	 * Starts the engine and calls the initializer functions.
	 */ 
	start: function(){

		// call initializer functions on every module property
		cwt.util.each( cwt, function( module, key ){
			if( key !== 'util' ){
				if( module.hasOwnProperty("init") ){
					console.log("initializing cwt."+key);
					module.init();
				}
			}
		});

		// map listeners
		cwt.util.each( cwt, function( module ){
			cwt.util.each( module, function( servFn, servName ){

				if( servName.substring(0,4) === "on_" ){

					// bind listener function (NOTE: the namespace object will not binded to the listener)
					cwt.events.bind( servName.substring(4), servFn );
				}
			});
		});
	}
};