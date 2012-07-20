cwt.db = {

	// MODEL
	_amanda: null,
	_units: {},
	_tiles: {},
	_weapons: {},
	_weathers: {},
	_movetypes: {},

	/**
	 * A type defines the type of an sheet data object.
	 *
	 * @namespace
	 */
	types:{
		UNIT:0,
		TILE:1,
		WEAPON:2,
		WEATHER:3,
		MOVE_TYPE:4
	},
	
	init: function(){
		
		this._amanda = amanda("json");
		
		// create some selectors
	},
	
	/**
	 * Different sheet validators.
	 *
	 * @namespace
	 */
	validators:{

		/** Schema for an unit sheet. */
		unitValidator: {
			type: 'object',
			properties:{
				ID: { type:'string', except:[], required:true },
				cost: { type:'integer', minimum:0 },
				fuelConsumption: { type:'integer', minimum:0 },
				maxAmmo: { type:'integer', minimum:0, maximum:99 },
				maxFuel: { type:'integer', minimum: 0, maximum:99, required:true },
				moveRange: { type:'integer', minimum: 0, maximum:15, required:true },
				moveType: { type:'string', required:true }
			}
		},

		/** Schema for a tile sheet. */
		tileValidator: {
			type: 'object',
			properties: {
				ID: { type:'string', except:[], required:true },
				capturePoints: { format:'int', minimum: 1, maximum:99 },
				defense: { format:'int', minimum: 0, maximum:5, required:true }
			}
		},

		/** Schema for a weapon sheet. */
		weaponValidator: {
			type: 'object',
			properties:{
				ID: { type:'string', except:[], required:true }
			}
		},

		/** Schema for a weather sheet. */
		weatherValidator: {
			type: 'object',
			properties:{
				ID: { type:'string', except:[], required:true }
			}
		},

		/** Schema for a move type sheet. */
		movetypeValidator: {
			type: 'object',
			properties: {
				ID: { type:'string', except:[], required:true },
				costs: {
					type: "object",
					patternProperties: {
						'[.]*': { type:"integer", minimum:0 } }
				}
			}
		}
	},

	/**
	 * Returns a unit type by its id.
	 *
	 * @param id
	 */
	unit: function(id){
		if( !this._units.hasOwnProperty(id) ) throw Error("unknown id "+id);
		return this._units[id];
	},

	/**
	 * Returns a tile type by its id.
	 *
	 * @param id
	 */
	tile: function(id){
		if( !this._tiles.hasOwnProperty(id) ) throw Error("unknown id "+id);
		return this._tiles[id];
	},

	/**
	 * Returns a move type by its id.
	 *
	 * @param id
	 */
	movetype: function(id){
		if( !this._movetypes.hasOwnProperty(id) ) throw Error("unknown id "+id);
		return this._movetypes[id];
	},

	/**
	 * Returns a weapon type by its id.
	 *
	 * @param id
	 */
	weapon: function(id){
		if( !this._weapons.hasOwnProperty(id) ) throw Error("unknown id "+id);
		return this._weapons[id];
	},

	/**
	 * Returns a weather type by its id.
	 *
	 * @param id
	 */
	weather: function(id){
		if( !this._weathers.hasOwnProperty(id) ) throw Error("unknown id "+id);
		return this._weathers[id];
	},

	/**
	 * Parses a data object into the database.
	 */
	parse: function( data, type ){
		var schema, db, excList;
		var id = data.ID;

		// find schema and data list
		switch( type ){

			case this.types.UNIT:
				schema =  this.validators.unitValidator;
				db = this._units;
				excList = this.validators.unitValidator.properties.ID.except;
				break;

			case this.types.TILE:
				schema =  this.validators.tileValidator;
				db = this._tiles;
				excList = this.validators.tileValidator.properties.ID.except;
				break;

			case this.types.WEAPON:
				schema =  this.validators.weaponValidator;
				db = this._weapons;
				excList = this.validators.weaponValidator.properties.ID.except;
				break;

			case this.types.WEATHER:
				schema =  this.validators.weatherValidator;
				db = this._weathers;
				excList = this.validators.weatherValidator.properties.ID.except;
				break;

			case this.types.MOVE_TYPE:
				schema =  this.validators.movetypeValidator;
				db = this._movetypes;
				excList = this.validators.movetypeValidator.properties.ID.except;
				break;

			default: throw Error("unknow type "+type);
		}

		this._amanda.validate( data, schema, function(e){
			if( e ){ 
				throw Error( e ); 
			}
		});

		if( db.hasOwnProperty(id) ) throw Error(id+" is already registered");
		db[id] = data;

		// register id in exception list
		excList.push(id);
	}

};