/** 
 * Represents an inactive identical number.
 *
 * @constant
 */
var CWT_INACTIVE_ID = -1;

/** 
 * @constant 
 */
var DEBUG = true;

/** 
 * @constant 
 */
var CWT_ACTIONS_BUFFER_SIZE = 200;

/**
 * The greatest possible map width.
 *
 * @config
 */
var CWT_MAX_MAP_WIDTH = 100;

/**
 * The greatest possible map height.
 *
 * @config
 */
var CWT_MAX_MAP_HEIGHT = 100;

/**
 * Maximum amount of players in the game.
 *
 * @config
 */
var CWT_MAX_PLAYER = 5;

/**
 * The maximum amount of units a player can hold.
 *
 * @config
 */
var CWT_MAX_UNITS_PER_PLAYER = 50;

/**
 * The maximum amount of properties on a map.
 *
 * @config
 */
var CWT_MAX_PROPERTIES = 200;

/**
 * The maximum range to select a target from a selection range.
 *
 * @config
 */
var CWT_MAX_SELECTION_RANGE = 15;

/**
 * This constant can be overwritten for a custom size, but this must be done
 * before the engine will be initialized.
 *
 * @config
 */
var CWT_MAX_BUFFER_SIZE = 200;

/**
 * The engine version tag.
 *
 * @constant 
 */
var CWT_VERSION = "0.3.1";

/**
 * The model layer holds all necessary data for a game round. This layer can be
 * extended to store additional data for game rounds.
 * 
 * If you extend this layer you should follow two rules. At first remember that
 * every property of this layer will be saved in a save game. The current
 * persistence layer implementation uses a json algorithm to serialize all model
 * data. This means you cannot store cyclic data structures in the model layer.
 * Furthermore you should not place functions in this layer because this would
 * not follow the specification of this layer.
 *
 * @namespace
 */
var model      = {};

/**
 * This is the main access layer for the custom wars tactics game client. All
 * data changing actions will be invoked from this layer.
 *
 * The layer itself is build as state machine which represents a player action.
 * Every action starts by a selection of a tile. Which the selected object will
 * be choosen by the state of the tile. An empty tile leads to a map action. An
 * empty (owned) property leads to a property actions like buying an unit. The
 * last option will be choosen if the tile is occupied by an own unit.
 *
 * @namespace
 */
var controller  = {};

/**
 * Some useful utility functions are stored in this layer. This layer contains
 * the logging functions of custom wars tactics. These functions are
 * overwritable to have a custom log behaviour for the game client. As example
 * if you use a graphical logging solution like BlackbirdJs.
 *
 * @namespace
 */
var util        = {};
/**
 *
 * @param {Function} cb call back function that will be invoked in the created scope
 */
util.scoped = function( cb ){
  return cb();
};

/**
 * Raises an error in the active Javascript environment.
 *
 * @param {...Object} reason A number of arguments that will be used as error message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 */
util.raiseError = function( reason ){
  if( arguments.length === 0 ){
    reason = "CustomWars Debug:: An error was raised";
  }
  else if( arguments.length > 1 ){
    reason = Array.prototype.join.call( arguments, " " );
  }
  
  util.log("ERROR:",reason);
  throw Error( reason );
};

/**
 * Logging function.
 *
 * @param {...Object} reason A number of arguments that will be used as message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 * @config
 */
util.log = function( msg ){
  if( arguments.length > 1 ){
    msg = Array.prototype.join.call( arguments, " " );
  }

  console.log( msg );
};
/** @private */
util.fillList_ = function(){
  var defValue = this.__defValue__;
  var len = this.__length__;
  var isFN = typeof defValue === 'function';
  
  // SIMPLE ARRAY OBJECT
  for(var i = 0, e = len; i < e; i++){
    if( isFN ) this[i] = defValue( i );
    else       this[i] = defValue;
  }
};

/** @private */
util.fillMatrix_ = function(){
  var defValue = this.__defValue__;
  var w = this.__width__;
  var h = this.__height__;
  var isFN = typeof defValue === 'function';
  
  // COMPLEX ARRAY (MATRIX) OBJECT
  for(var i = 0, e = w; i < e; i++){
    for(var j = 0, ej = h; j < ej; j++){
      if( isFN ) this[i][j] = defValue( i,j );
      else       this[i][j] = defValue;
    }
  }
};

/** @private */
util.cloneList_ = function( list ){
  var len = this.__length__;
  if( list.__length__ !== len ) throw Error();
  for(var i = 0, e = len; i < e; i++){
    list[i] = this[i];
  }
};

/** @private */
util.cloneMatrix_ = function( matrix ){
  var w = this.__width__;
  var h = this.__height__;
  if( matrix.length !== this.length ) throw Error();
  
  // COMPLEX ARRAY (MATRIX) OBJECT
  for(var i = 0, e = w; i < e; i++){
    for(var j = 0, ej = h; j < ej; j++){
      matrix[i][j] = this[i][j];
    }
  }
};

/**
 * Creates a list and fills it with default values.
 *
 * @param {Number} len the length of the created list
 * @param defaultValue the default value that will be inserted into the list slots 
 */
util.list = function( len, defaultValue ){
  if( defaultValue === undefined ){ defaultValue = null; }
  
  var warr = [];
  warr.__defValue__ = defaultValue;
  warr.__length__ = len;
  warr.resetValues = util.fillList_;
  warr.cloneValues = util.cloneList_;
  
  warr.resetValues();
  
  return warr;
};

/**
 * Creates a matrix (table) and fills it with default values.
 *
 * @param {Number} w width of the matrix
 * @param {Number} h height of the matrix
 * @param defaultValue the default value that will be inserted into the cells 
 */
util.matrix = function( w, h, defaultValue ){
  
  if( defaultValue === undefined ){ defaultValue = null; }
  
  var warr = [];
  warr.__defValue__ = defaultValue;
  warr.__width__ = w;
  warr.__height__ = h;
  warr.resetValues = util.fillMatrix_;
  warr.cloneValues = util.cloneMatrix_;
  
  // CREATE SUB ARRAYS
  for (var i = 0; i < w; i++){ warr[i] = []; }
  
  warr.resetValues();
  
  return warr;
};
/** 
 * Creates a ring buffer with a fixed size.
 */
util.createRingBuffer = function( size ){

  var buffer = /** @lends util.RingBuffer */ {

    /**
     * Pushes an element into the buffer
     * 
     * @param msg object that will be pushed into the buffer
     */
    push: function (msg){
      if ( this._data[ this._wInd ] !== null) {
        throw Error("message buffer is full");
      }

      // WRITE MSG AND INCREASE COUNTER
      this._data[ this._wInd ] = msg;
      this._wInd++;
      if ( this._wInd === this._size ) {
        this._wInd = 0;
      }
    },

    /**
     * Returns true if the ring buffer is empty else false.
     */
    isEmpty: function () {
      return ( this._data[ this._rInd ] === null );
    },

    /**
     * Returns the next available entry from the buffer (FIFO).
     */
    pop: function () {
      if( this._data[ this._rInd ] === null) {
        throw Error("message buffer is empty");
      }
      var msg = this._data[ this._rInd ];

      // INCREASE COUNTER AND FREE SPACE
      this._data[ this._rInd ] = null;
      this._rInd++;
      if (this._rInd === this._size ) {
        this._rInd = 0;
      }

      return msg;
    },

    /**
     * Clears the buffer.
     */
    clear: function(){
      this._rInd = 0;
      this._wInd = 0;
      for( var i=0; i<size; i++ ){
        this._data[i] = null;
      }
    }
  };

  buffer._rInd = 0;
  buffer._wInd = 0;
  buffer._data = util.list( size, null );
  buffer._size = size;

  return buffer;
};
/**

  This is a small but state machine for JavaScript. It's originally designed
  for Custom Wars Tactics (Link:) but can be used in other turn based games as well. 
  
  Target of this library is to provide a complex configurate able state machine in a very
  small library (03.2013 => 1KB minified and 0.5KB gzipped). 
  
  This is why the complexity of this state machine is low overall. This engine
  may suits for you if you only need to have a flow between states with basic on enter events 
  and a small history.  
  
  ToDo:
    - convert DEBUG statements to a more generic solution
    - better constant for the last state transition
    - may add onLeave event
    - debug reset functionality
    - error event for illegal transitions
  
  License (MIT):
    
    Copyright (c) 2013 BlackCat [blackcat.myako@googlemail.com]

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
    copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
    following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  */

if( simpleStateMachine !== undefined ) throw Error("simpleStateMachine is already defined in the global scope");

/**
 * The central finite state machine of the game engine. 
 */
var simpleStateMachine = function(){
  
  return /** @lends simpleStateMachine */ {
    
    /**
     * Represents a breaking transition event. To break a transition it should
     * be used in an event function of a state implementation.
     * 
     * @constant
     * @example 
     *    action: function(){
     *        return this.BREAK_TRANSITION;
     *    }
     */
    BREAK_TRANSITION: "__BREAK_TRS__",
    
    /**
     * Current active state.
     */
    state:     "NONE",
    
    /**
     * State history that contains a queue of the state flow.
     * 
     * @type Array
     */
    history:[],
            
    name:"UNNAMED STATEMACHINE",
    
    /**
     * Represents a return to last state event. To return to the last state it 
     * should be used in an event function of a state implementation. 
     * 
     * @constant
     * @example 
     *    cancel: function(){
     *        return this.lastState;
     *    }
     */
    lastState: "__LAST_STATE_TRS__",
    
    /**
     * State machine construction diagram object. Every state and transition will 
     * be defined in this descriptor object.
     * 
     * @namespace
     */
    structure: {},
    
    /**
     * Invokes an event in the current active state.
     * 
     * @param {String} ev event name
     * @param {...Object} arguments for the event
     */
    event: function( ev ){
      if( DEBUG ) util.log(this.name+": got event",ev);
      
      var stateEvent = this.structure[ this.state ][ ev ];
      if( stateEvent === undefined ){
        util.raiseError("missing event",ev,"in state",this.state);
      }
      
      var nextState = stateEvent.apply( this, arguments );
      if( nextState !== undefined ){
        if( nextState !== this.BREAK_TRANSITION ){
          
          var goBack = nextState === this.lastState;
          if( goBack ){
            if( this.history.length === 1 ) nextState = "IDLE";
            else nextState = this.history.pop();
          }
          
          var nextStateImpl = this.structure[ nextState ];
          if( nextStateImpl === undefined ){
            util.raiseError("state",nextState,"is not defined");
          }
          
          if( nextStateImpl.onenter !== undefined ){
            
            var breaker = nextStateImpl.onenter.apply( this, arguments );
            if( breaker === this.BREAK_TRANSITION ){
              
              // BREAK TRANSITION
              return;
            }
            else if( breaker !== undefined ){
              
              
            }
          }
          
          if( !goBack ){
            this.history.push( this.state );
          }
          
          this.state = nextState;
          if( DEBUG ) util.log(this.name+": changed state to",nextState);
          
          if( nextStateImpl.actionState !== undefined ){
            this.event.call( this, "actionState" );
          }
          
        }
        else if( ev === "actionState" ){
          util.raiseError("an action state cannot return a break transition"); 
        }
      }
      else {
        util.raiseError("an event must return a transition command"); 
      }
    }
  };
};
/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link model.markUnitNonActable}.
 */
model.leftActors = util.list( 
  CWT_MAX_UNITS_PER_PLAYER, 
  false 
);

/**
 * Returns true if the selected uid can act in the current active turn,
 * else false.
 *
 * @param uid selected unit identical number
 */
model.canAct = function( uid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
    return false;
  }
  else return model.leftActors[ uid - startIndex ] === true;
};

/**
 *
 * @param {Number} uid selected unit identical number
 * @param {Boolean} canAct the target status 
 */
model.setActableStatus = function( uid, canAct ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
    util.raiseError("unit with id",uid,"does not belongs to the turn owner");
  }
  else model.leftActors[ uid - startIndex ] = canAct;
};

/**
 *
 * @param {Number} pid
 */
model.resetActableStatus = function( pid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  for( var i=startIndex,e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    model.leftActors[ i - startIndex ] = true;
  }
};

/**
 * @param {Number} uid
 */
model.markUnitActable = function( uid ){
  model.setActableStatus( uid, true );
};

/**
 * Called when an unit is trapped. Does not invoke any logic, useful for client listeners.
 * 
 * @param {Number} uid
 */
model.trapWait = function( uid ){};

/**
 * @param {Number} uid
 */
model.markUnitNonActable = function( uid ){
  model.setActableStatus( uid, false );
};
/**
 * Returns true if a given unit is an indirect firing unit (e.g. artillery) else false
. * 
 * @param {type} uid id of the unit
 * @returns {Boolean}
 */
model.isIndirectUnit = function( uid ){
  return typeof model.units[uid].type.minrange === "number"; 
};

/**
 * Returns the base damage of an attacker against a defender. If the attacker cannot attack
 * the defender then -1 will be returned. This function recognizes the ammo usage of main weapons.
 * If the attacker cannot attack with his main weapon due low ammo then only the secondary weapon 
 * will be checked.
 * 
 * @returns {Boolean}
 */
model.baseDamageAgainst = function( attacker, defender, withMainWp ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  if( typeof withMainWp === "undefined" ) withMainWp = true;
  
  // MAIN WEAPON
  if( withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  // SECONDARY WEAPON
  if( attack.sec_wp !== undefined ){ 
    v = attack.sec_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  return -1;
};

model.canUseMainWeapon = function( attacker, defender ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  // MAIN WEAPON
  if( attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return true;
  }
  
  return false;
};

/**
 * Returns true if the unit type has a main weapon else false.
 * 
 * @param {UnitSheet} type
 * @returns {Boolean}
 */
model.hasMainWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.main_wp !== "undefined";
};

/**
 * Returns true if the unit type has a secondary weapon else false.
 * 
 * @param {UnitSheet} type
 * @returns {Boolean}
 */
model.hasSecondaryWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.sec_wp !== "undefined";
};

/**
 * 
 * @param {Number} uid
 * @param {Number} x
 * @param {Number} y
 * @param {SelectionData} data
 * @returns {Boolean}
 */
model.attackRangeMod_ = function( uid, x, y, data, markAttackableTiles ){
  var markInData = (typeof data !== "undefined");
  if(!markAttackableTiles) markAttackableTiles = false;
  
  var unit = model.units[uid];
  var teamId = model.players[unit.owner].team;
  var attackSheet = unit.type.attack;
  if( arguments.length === 1 ){
    x = unit.x;
    y = unit.y; 
  }
  
  // NO BATTLE UNIT ?
  if( typeof attackSheet === "undefined" ) return false;
  
  // ONLY MAIN WEAPON WITHOUT AMMO ? 
  if( model.hasMainWeapon(unit.type) && !model.hasSecondaryWeapon(unit.type) &&
     unit.type.ammo > 0 && unit.ammo === 0    ) return false;
  
  var minR = 1;
  var maxR = 1;
  
  if( unit.type.attack.minrange ){
    
    controller.prepareTags( x,y, uid );
    minR = controller.scriptedValue( unit.owner, "minRange", unit.type.attack.minrange );
    maxR = controller.scriptedValue( unit.owner, "maxRange", unit.type.attack.maxrange );
  }
  
  var lX;
  var hX;
  var lY = y-maxR;
  var hY = y+maxR;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-maxR+disY;
    hX = x+maxR-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){
      
      if( markAttackableTiles ){
        if( model.distance( x,y, lX,lY ) >= minR ){
          
          // SYMBOLIC YES YOU CAN ATTACK THIS TILE
          data.setValueAt(lX,lY, 1 ); 
        }
      }
      else{
        
        // IN FOG ?
        if( model.fogData[lX][lY] === 0 ) continue;
        
        if( model.distance( x,y, lX,lY ) >= minR ){
          
          // ONLY UNIT FROM OTHER TEAMS ARE ATTACKABLE
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && model.players[ tUnit.owner ].team !== teamId ){
            
            var dmg = model.baseDamageAgainst(unit,tUnit);
            if( dmg > 0 ){
              
              // IF DATA MODE IS ON, THEN MARK THE POSITION 
              // ELSE RETURN TRUE
              if( markInData ) data.setValueAt(lX,lY, dmg );
              else return true;
            }
          }
        }
      }
    }
  }
  
  return false;
};

/**
 * Returns true if an unit has targets in sight, else false.
 * 
 * @param {type} uid id of the unit
 * @param {Number} x (default: unit position)
 * @param {Number} y (default: unit position)
 * @returns {Boolean}
 */
model.hasTargets = function( uid,x,y ){
  return model.attackRangeMod_(uid,x,y);
};

/**
 *
 */
model.getBattleDamage = function( attacker, defender, luck, withMainWp, isCounter ){
  var BASE = model.baseDamageAgainst(attacker,defender,withMainWp);
  
  var AHP  = model.unitHpPt( attacker );
  var DHP = model.unitHpPt( defender );
  
  // ATTACKER VALUES
  controller.prepareTags( attacker.x, attacker.y );
  var LUCK = parseInt( (luck/100)*controller.scriptedValue(attacker.owner,"luck",10), 10 );
  var ACO  = controller.scriptedValue( attacker.owner, "att", 100 );
  if( isCounter ) ACO += controller.scriptedValue( unit.owner, "counterAtt", 0 );
  
  // DEFENDER VALUES
  controller.prepareTags( defender.x, defender.y );
  var DCO  = controller.scriptedValue( defender.owner, "def", 100 );
  var DTR = controller.scriptedValue( defender.owner, "terraindefense", model.map[defender.x][defender.y].defense );
  
  // D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]
  var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );
  damage = parseInt( damage, 10 );
  
  if( DEBUG ){
    util.log(
      "attacker:",model.extractUnitId( attacker ),
      "[",BASE,"*",ACO,"/100+",LUCK,"]*(",AHP,"/10)*[(200-(",DCO,"+",DTR,"*",DHP,"))/100]",
      "=",damage
    );
  }
  
  return damage;
};

/**
 * 
 * @param {type} attId id of the attacker
 * @param {type} defId id of the defender
 * @param {type} attLuckRatio luck of the attacker (0-100)
 * @param {type} defLuckRatio luck of the defender (0-100)
 */
model.battleBetween = function( attId, defId, attLuckRatio, defLuckRatio ){
  var attacker = model.units[attId];
  var defender = model.units[defId];
  var aSheets = attacker.type;
  var dSheets = defender.type;
  var attOwner = attacker.owner;
  var defOwner = defender.owner;
  var powerAtt        = model.unitHpPt( defender );
  var powerCounterAtt = model.unitHpPt( attacker );
  
  // ATTACK
  model.damageUnit( defId, model.getBattleDamage(attacker,defender,attLuckRatio) );
  powerAtt -= model.unitHpPt( defender );
  
  if( model.canUseMainWeapon(attacker,defender) ) attacker.ammo--;
  
  powerAtt        = ( parseInt(        powerAtt*0.1*dSheets.cost, 10 ) );
  model.modifyPowerLevel( attOwner, parseInt( 0.5*powerAtt, 10 ) );
  model.modifyPowerLevel( defOwner, powerAtt );
  
  // COUNTER ATTACK
  if( defender.hp > 0 && !model.isIndirectUnit(defId) ){
    var mainWpAttack = model.canUseMainWeapon(defender,attacker);
    
    model.damageUnit( attId, model.getBattleDamage(
      defender,attacker,defLuckRatio, mainWpAttack, true
    ));  
    
    powerCounterAtt -= model.unitHpPt( attacker );
    
    if( mainWpAttack ) defender.ammo--;
    
    powerCounterAtt = ( parseInt( powerCounterAtt*0.1*aSheets.cost, 10 ) );
    model.modifyPowerLevel( defOwner, parseInt( 0.5*powerCounterAtt, 10 ) );
    model.modifyPowerLevel( attOwner, powerCounterAtt );
  }
};
/**
 * Indicates a non active power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.INACTIVE_POWER = 0;

/**
 * Indicates an active normal power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.CO_POWER = 1;

/**
 * Indicates an active super power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.SUPER_CO_POWER = 2;

/**
 * Indicates an active tag power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.TAG_CO_POWER = 3;

util.scoped(function(){
  
  function activatePower( pid, level ){
    var player = model.players[pid];
    
    player.coPower_active = level;
    player.power = 0;
    
    // INCREASE USAGE COUNTER
    player.timesPowerUsed++;
  };

  /**
   * Deactivates the CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateCoPower = function( pid ){
    activatePower(pid,model.INACTIVE_POWER);
  };


  /**
   * Activates the CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateCoPower = function( pid ){
    activatePower(pid,model.CO_POWER);
  };

  /**
   * Activates the super CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateSuperCoPower = function( pid ){
    activatePower(pid,model.SUPER_CO_POWER);
  };
  
});

/**
 * Modifies the power level of a player.
 * 
 * @param {Number} pid
 * @param {Number} value
 */
model.modifyPowerLevel = function( pid, value ){
  model.players[pid].power += value;
  if( model.players[pid].power < 0 ) model.players[pid].power = 0;
};

/**
 * Returns the cost for one CO star for a given player.
 * 
 * @param {type} pid id of the player
 * @returns {Number}
 */
model.coStarCost = function( pid ){
  var cost = controller.configValue("coStarCost");
  var used = model.players[pid].timesPowerUsed;
  
  // IF USAGE COUNTER IS GREATER THAN MAX USAGE COUNTER THEN USE ONLY THE MAXIMUM INCREASE COUNTER FOR CALCULATION
  var maxUsed = controller.configValue("coStarCostIncreaseSteps");
  if( used > maxUsed ) used = maxUsed;
  
  cost += used*controller.configValue("coStarCostIncrease");
  
  return cost;
};
util.scoped(function(){
  
  function expectArray( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "object" && typeof v.length === undefined ){ 
      util.raiseError(attr,"needs to be an array but is ",typeof v);
    }
    
    return true;
  }
  
  function expectString( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "string" ) util.raiseError(attr,"needs to be a string but is ",typeof v);
    
    return true;
  }
  
  function expectObject( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "object" ) util.raiseError(attr,"needs to be an object but is ",typeof v);
    
    return true;
  }
  
  function expectBoolean( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "boolean" ) util.raiseError(attr,"needs to be a boolean but is ",typeof v);
    
    return true;
  }
  
  function notIn( attr, obj ){
    if( obj.hasOwnProperty(attr) ) util.raiseError(attr,"is already registered");
  } 
  
  function not( attr, obj, res ){
    if( obj[attr] === res ) util.raiseError(attr,"cannot have value",res);
  } 
  
  function isIn( attr, obj ){
    if( !obj.hasOwnProperty(attr) ) util.raiseError(attr,"is not registered");
  } 
  
  function expectNumber( obj, attr, mustDefined, integer, min, max ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "number" ) util.raiseError(attr,"needs to be a number but is ",typeof v);
    if( integer === true && parseInt(v,10) !== v ) util.raiseError(attr,"needs to be an integer");
    
    if( min !== undefined && v < min ) util.raiseError(attr,"needs to be greater equal",min,"but is",v);
    if( min !== undefined && isNaN(min) ) util.raiseError("wrong minimum parameter");
    
    if( max !== undefined && v > max ) util.raiseError(attr,"needs to be greater equal",max,"but is",v);
    if( max !== undefined && isNaN(max) ) util.raiseError("wrong maximum parameter");
    
    return true;
  }
  
  // --------------------------------------------------------------- //
  
  /**
   *
   */
  model.unitTypes = {};
  
  /**
   *
   */
  model.tileTypes = {};
  
  /**
   *
   */
  model.weatherTypes = {};
  
  /**
   *
   */
  model.defaultWeatherType = null;
  
  /**
   *
   */
  model.nonDefaultWeatherType = [];
  
  /**
   *
   */
  model.moveTypes = {};
  
  /**
   *
   */
  model.factionTypes = {};
  
  /**
   *
   */
  model.coTypes = {};
  
  /**
   *
   */
  model.globalRules = [];
  
  /**
   *
   */
  model.mapRules = [];
  
  /**
   *
   */
  model.language = { en:{} };
  
  /**
   *
   */
  model.sounds = null;
  
  /**
   *
   */
  model.graphics = null;
  
  /**
   *
   */
  model.maps = null;
  
  /**
   *
   */
  model.wpKeys_ = ["main_wp","sec_wp"];
  
  var selectedLang = "en";
  
  /**
   * Returns a localized string for a given key or if not exist the key itself.
   *
   * @param {String} key
   */
  model.localized = function( key ){
    var result = model.language[selectedLang][key];
    return ( result === undefined )? key: result;
  };
  
  /**
   * Parses an unit sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseUnitType = function( sheet ){
    var keys,key,list,att,i1,i2,e1,e2,sub;
    
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing unit sheet",sheet.ID);
    
    notIn( sheet.ID, model.unitTypes );
    
    // MOVE TYPE MUST BE DEFINED
    expectString(sheet,"movetype",true);
    isIn( sheet.movetype, model.moveTypes );
    
    // VISION, MOVE CAN BE THE MAX_MOVE_RANGE IN MAXIMUM
    expectNumber(sheet,"range",true,true,0,CWT_MAX_SELECTION_RANGE);
    expectNumber(sheet,"vision",true,true,1,CWT_MAX_SELECTION_RANGE);
    
    // GENERAL STUFF
    expectNumber(sheet,"fuel",true,true,0,99);
    expectNumber(sheet,"ammo",true,true,0,9);
    expectNumber(sheet,"cost",true,true,0,99999);
    
    // OPTIONAL SPECIAL ABILITIES
    expectBoolean(sheet,"stealth",false);
    expectBoolean(sheet,"suppliesloads",false);
    expectNumber(sheet,"captures",false,true,1,10);
    
    // TRANSPORT ?
    if( expectArray(sheet,"canload",false) ){
      
      // NEED MAX LOAD
      expectNumber(sheet,"maxloads",true,true,1,5);
      
      list = sheet.canload;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    // SUPPLY ?
    if( expectArray(sheet,"supply",false) ){
      list = sheet.supply;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    // SUICIDER ?
    if( expectObject(sheet,"suicide",false) ){
      sub = sheet.suicide;
      expectNumber(sub,"damage",true,true,1,9);
      expectNumber(sub,"range",true,true,1,CWT_MAX_SELECTION_RANGE);
      
      // EXCEPTIONS?
      if( expectObject(sub,"nodamage",false ) ){
        list = sub.nodamage;
        for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
      }
    }
    
    // REPAIRS ?
    if( expectObject(sheet,"repairs",false)){
      sub = sheet.repairs;
      keys = Object.keys(sub);
      for( i2=0,e2=keys.length; i2<e2; i2++ ){
        key = keys[i2];
        
        // HARD HP REPAIR BETWEEN 1 AND 9 
        // (10 IS NOT A POSSIBLE GAME STATE FOR A REPAIR)
        expectNumber( sub, key, true, true, 1,9 );
      }
    }
    
    // ATTACKER ?
    if( expectObject(sheet,"attack",false) ){
      att = sheet.attack;
      
      // MIN RANGE < MAX_RANGE IF DEFINED
      expectNumber(att,"minrange",false,true,1);
      expectNumber(att,"maxrange",false,true,att.minrange+1);
      
      // CHECK WEAPONS
      for( i1=0,e1=model.wpKeys_.length; i1<e2; i1++ ){
        if( expectObject(att,model.wpKeys_[i1],false) ){
          list = att[model.wpKeys_[i1]];
          keys = Object.keys(list);
          for( i2=0,e2=keys.length; i2<e2; i2++ ){
            key = keys[i2];
            expectNumber( list, key, true, true, 1 );
          }
        }
      }
    }
    
    model.listOfUnitTypes.push( sheet.ID )
    model.unitTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a tile sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseTileType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing tile sheet",sheet.ID);
    
    notIn( sheet.ID, model.tileTypes );
    
    expectNumber(sheet,"defense",true,true,0,6);
    expectNumber(sheet,"vision",false,true,0,CWT_MAX_SELECTION_RANGE);
    expectNumber(sheet,"points",false,true,1,100);
    expectNumber(sheet,"funds",false,true,10,99999);
    
    // REPAIRS ?
    if( expectObject(sheet,"repairs",false)){
      sub = sheet.repairs;
      keys = Object.keys(sub);
      for( i2=0,e2=keys.length; i2<e2; i2++ ){
        key = keys[i2];
        
        // HARD HP REPAIR BETWEEN 1 AND 9 
        // (10 IS NOT A POSSIBLE GAME STATE FOR A REPAIR)
        expectNumber( sub, key, true, true, 1,9 );
      }
    }
    
    // BUILDS ?
    if( expectArray(sheet,"builds",false) ){
      list = sheet.builds;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    model.tileTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a weather sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseWeatherType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing weather sheet",sheet.ID);
    
    notIn( sheet.ID, model.weatherTypes );
    
    // TODO AT LEAST ONE HAS TO BE DEFAULT
    expectBoolean(sheet,"defaultWeather",false);
    
    expectNumber(sheet,"vision",false,true,-5,+5);
    expectNumber(sheet,"att",false,true,-100,+100);
    expectNumber(sheet,"minRange",false,true,-5,+5);
    expectNumber(sheet,"maxRange",false,true,-5,+5);
    
    model.weatherTypes[sheet.ID] = sheet;
    if( sheet.defaultWeather ) model.defaultWeatherType = sheet;
    else model.nonDefaultWeatherType.push( sheet );
  };
  
  /**
   * Parses a movetype sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseMoveType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing movetype sheet",sheet.ID);
    
    notIn( sheet.ID, model.moveTypes );
    
    // MOVE COSTS
    expectObject(sheet,"costs",true);
    var costs = sheet.costs;
    var costsKeys = Object.keys(costs);
    for( var i1=0,e1=costsKeys.length; i1<e1; i1++ ){
      expectNumber(costs,costsKeys[i1],true,true,-1,CWT_MAX_SELECTION_RANGE);
      not(costs,costsKeys[i1],0);
    }
    
    model.moveTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a CO sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseCoType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing co sheet",sheet.ID);
    
    notIn( sheet.ID, model.coTypes );
    
    expectNumber(sheet,"coStars",true,true,-1,10);
    not(sheet,"coStars",0);
    expectNumber(sheet,"scoStars",true,true,-1,10);
    not(sheet,"scoStars",0);
    
    expectArray(sheet,"d2d",true);
    expectArray(sheet,"cop",true);
    expectArray(sheet,"scop",true);
    
    expectString(sheet,"faction",true);
    isIn( sheet.faction, model.factionTypes );
    
    expectString(sheet,"music",false);
    
    model.coTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a Faction sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseFactionType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing faction sheet",sheet.ID);
    
    notIn( sheet.ID, model.factionTypes );
    
    expectString(sheet,"music",true);
    
    model.factionTypes[sheet.ID] = sheet;
  };
  
  model.parseRule = function( rule, isMapRule ){
    if( isMapRule ){
      model.mapRules.push(rule);
    }
    else model.globalRules.push(rule);
  };
    
  model.checkMap = function( map ){
    var list;
    
    expectString(map,"name",true);
    
    expectArray(map,"players",true);
    list = map.players;
    expectNumber(list,"length",true,true,1,4);
    for( i=0,e=list.length; i<e; i++ ){ 
      expectArray(list,i,true);
      expectNumber(list[i],0,true,true,i,i);
      expectString(list[i],1,true);
      expectNumber(list[i],2,true,true,0,999999);
      expectNumber(list[i],3,true,true,1,4);   
      expectString(list[i],4,true);
      expectString(list[i],5,true);
      expectNumber(list[i],6,true,true,0,99999);
    }
    
     expectArray(map,"leftActors",true);
    list = map.leftActors;
    expectNumber(list,"length",true,true,1,50);
    for( i=0,e=list.length; i<e; i++ ){ 
      expectNumber(list,i,true,true,0,49);
    }
    
    expectArray(map,"timers",true);
    expectArray(map,"rules",true);
    
    expectNumber(map,"day",true,true,0,9999);
    expectNumber(map,"turnOwner",true,true,0,map.players.length-1);
    expectNumber(map,"mapHeight",true,true,10,100);
    expectNumber(map,"mapWidth",true,true,10,100);
    
    if( expectArray(map,"typeMap",true) ){
      list = map.typeMap;
      for( i=0,e=list.length; i<e; i++ ) expectString(list,i,true);
    }
    
    if( expectArray(map,"map",true) ){
      list = map.map;
      
      expectNumber(list,"length",true,true,10,100);
      for( i=0,e=list.length; i<e; i++ ){ 
        expectArray(list,i,true) ;
        expectNumber(list[i],"length",true,true,10,100);
      }
    }
  };
  
  // FILL LISTS DIRECTLY AT SHEET PARSING STEP :P
  
  
  model.listOfUnitTypes = [];
  
  /** @private */
  model.listOfPropertyTypes_ = null;
  
  /**
   * Returns all known type game of properties.
   */
  model.getListOfPropertyTypes = function(){
    if( model.listOfTileTypes_ === null ){
      var tiles = model.tileTypes;
      var l = Object.keys( tiles );
      
      var r = [];
      for( var i=l.length-1; i>=0; i-- ){
        if( tiles[l[i]].capturePoints > 0 ){
          r.push( l[i] );
        }
      }
      
      model.listOfPropertyTypes_ = r;
    }
    
    return model.listOfPropertyTypes_;
  };
  
  /** @private */
  model.listOfTileTypes_ = null;
  
  /**
   * Returns all known type game of tiles.
   */
  model.getListOfTileTypes = function(){
    if( model.listOfTileTypes_ === null ){
      var tiles = model.tileTypes;
      var l = Object.keys( tiles );
      
      var r = [];
      for( var i=l.length-1; i>=0; i-- ){
        if( tiles[l[i]].capturePoints === undefined ){
          r.push( l[i] );
        }
      }
      
      model.listOfTileTypes_ = r;
    }
    
    return model.listOfTileTypes_;
  };
  
});
/** @private */
model.turnTimedEvents_time_ = util.list( 50, null );

/** @private */
model.turnTimedEvents_data_ = util.list( 50, null );

/**
 * 
 * @param {Number} turn time in turns when the action will be fired
 * @param {String} action data
 */
model.pushTimedEvent = function( turn, action, args ){
  var list = model.turnTimedEvents_time_;
  for( var i=0,e=list.length; i<e; i++ ){
    if( model.turnTimedEvents_time_[i] === null ){
      model.turnTimedEvents_time_[i] = turn;
      model.turnTimedEvents_data_[i] = action;
      return;
    }
  }
  
  util.reaiseError("no free slot");
};

/**
 * Ticks a turn.
 *
 * @TODO: should be in the controller
 */
model.tickTimedEvents = function(){
  
  // CHECK ALL
  var list = model.turnTimedEvents_time_;
  for( var i=0,e=list.length; i<e; i++ ){
    if( list[i] === null ) continue;
    
    list[i]--;
    
    // ACTIVATE IF DAY IS ZERO
    if( list[i] === 0 ){
      
      list[i] = null;
      var args = model.turnTimedEvents_data_[i];
      model.turnTimedEvents_data_[i] = null;
      
      // SEND COMMAND
      if( controller.isNetworkGame() ) controller.sendNetworkMessage( JSON.stringify(args) );
      
      // REGISTER COMMAND
      controller.actionBuffer_.push( args );
    }
  }
};
/**
 * Contains the fog data map. A value 0 means a tile is not visible. A value
 * greater than 0 means it is visible for n units ( n = fog value of the tile ). 
 */
model.fogData = util.matrix( 
  CWT_MAX_MAP_WIDTH, 
  CWT_MAX_MAP_HEIGHT, 
  0 
);

util.scoped(function(){
  
  function modifyVisionAt( x,y, pid, range, value ){
    if( !controller.configValue("fogEnabled") ) return;
    
    controller.prepareTags( x, y );
    range = controller.scriptedValue( pid,"vision", range );
    
    var mH = model.mapHeight;
    var mW = model.mapWidth;
    
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
        
        model.fogData[lX][lY] += value;
      }
    }
  };
  
  /**
   * @param {Number} x x coordinate on the map
   * @param {Number} y y coordinate on the map
   * @param {Number} range
   * @param {Number} value value that will be added to the position
   */
  model.modifyVisionAt = modifyVisionAt;
  
  /**
   * 
   * 
   * @param {Number} pid id number of the target player
   */
  model.recalculateFogMap = function( pid ){ 
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var tid = model.players[pid].team;
    var fogEnabled = (controller.configValue("fogEnabled") === 1);
    
    /*
    if( weather === undefined ) weather = model.weather.ID;

    var visionMod = model.sheets.weatherSheets[weather].visionChange;
    if( visionMod === undefined ){
      visionMod = 0;
    }
    */
    
    // RESET FOG MAP
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        if( !fogEnabled ){
          model.fogData[x][y] = 1;
        }
        else{
          model.fogData[x][y] = 0;
        }
      }
    }
    
    // ADD VISIONERS
    if( fogEnabled ){
      for( x=0 ;x<xe; x++ ){
        for( y=0 ;y<ye; y++ ){
          
          var unit = model.unitPosMap[x][y];
          if( unit !== null ){
            var sid = unit.owner;
            if( pid === sid || model.players[sid].team === tid ){
              var vision = unit.type.vision;
              if( vision < 0 ) vision = 0;
              
              modifyVisionAt( x,y, sid, vision,1 );
            }
          }
          
          var property = model.propertyPosMap[x][y];
          if( property !== null ){
            var sid = property.owner;
            if( sid !== -1 && ( pid === sid || model.players[sid].team === tid ) ){
              var vision = property.type.vision;
              if( vision < 0 ) vision = 0;
              
              modifyVisionAt( x,y, sid, vision,1 );
            }
          }
        }
      }
    }
  };
  
});
/**
 * Map table that holds all known tiles.
 */
model.map = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Returns the current active map height.
 * 
 * @type {Number}
 */
model.mapHeight = -1;

/**
 * Returns the current active map width.
 * 
 * @type {Number}
 */
model.mapWidth = -1;

/**
 * Returns the distance of two positions.
 *
 * @param {Number} sx x coordinate of the source position
 * @param {Number} sy y coordinate of the source position
 * @param {Number} tx x coordinate of the target position
 * @param {Number} ty y coordinate of the target position
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 * Returns the move code from a tile (ax,ay) to (bx,by).
 * 
 * @param {Number} ax x coordinate of the position A
 * @param {Number} ay y coordinate of the position A
 * @param {Number} bx x coordinate of the position B
 * @param {Number} by y coordinate of the position B
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.raiseError("both positions haven't a distance of 1");
  }

  if( bx < ax ){ return model.MOVE_CODE_LEFT;  }
  if( bx > ax ){ return model.MOVE_CODE_RIGHT; }
  if( by < ay ){ return model.MOVE_CODE_UP;    }
  if( by > ay ){ return model.MOVE_CODE_DOWN;  }

  util.raiseError("fatal error while getting move code from (",ax,",",ay,") to (",bx,",",by,")");
};

/**
 * Returns true if the given position (x,y) is valid on the current active map, else false.
 * 
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
model.isValidPosition = function( x,y ){
  return ( 
    x >= 0 && 
    y >= 0 && 
    x < model.mapWidth && 
    y < model.mapHeight 
  );
};

/**
 *
 */
model.doInRange = function( x,y, range, cb, arg ){
  
  var lX;
  var hX;
  var lY = y-range;
  var hY = y+range;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-range+disY;
    hX = x+range-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){
      
      cb( lX,lY, arg, Math.abs(lX-x)+disY );
      
    }
  }
};
/**
 * Code of the move up command
 * 
 * @constant
 */
model.MOVE_CODE_UP    = 0;

/**
 * Code of the move right command
 * 
 * @constant
 */
model.MOVE_CODE_RIGHT = 1;

/**
 * Code of the move down command
 * 
 * @constant
 */
model.MOVE_CODE_DOWN  = 2;

/**
 * Code of the move left command
 * 
 * @constant
 */
model.MOVE_CODE_LEFT  = 3;

/**
 * Moves an unit from one position to another position.
 * 
 * @param {Array} way move way
 * @param {Number} uid id of the moving unit
 * @param {Number} x x coordinate of the source
 * @param {Number} y y coordinate of the source
*/
model.moveUnit = function( way, uid, x,y ){
  var cX = x;
  var cY = y;
  var unit = model.units[ uid ];
  var uType = unit.type;
  var mType = model.moveTypes[ uType.movetype ];

  // CHECK MOVE WAY END
  var lastIndex = way.length-1;
  var fuelUsed = 0;
  for( var i=0,e=way.length; i<e; i++ ){

    // GET NEW CURRENT POSITION
    switch( way[i] ){

      case model.MOVE_CODE_UP:
        if( cY === 0 ) util.logError(
          "cannot do move command UP because",
          "current position is at the border"
        );
        cY--;
        break;

      case model.MOVE_CODE_RIGHT:
        if( cX === model.mapWidth-1 ) util.logError(
          "cannot do move command RIGHT because",
          "current position is at the border"
        );
        cX++;
        break;

      case model.MOVE_CODE_DOWN:
        if( cY === model.mapHeight-1 )util.logError(
          "cannot do move command DOWN because",
          "current position is at the border"
        );
        cY++;
        break;

      case model.MOVE_CODE_LEFT:
        if( cX === 0 ) util.logError(
          "cannot do move command LEFT because",
          "current position is at the border"
        );
        cX--;
        break;

      default: util.logError("unknown command ",way[i]);
    }

    // IS WAY BLOCKED ? TODO
    if( false && model.isWayBlocked( cX, cY, unit.owner, i == e-1 ) ){

      lastIndex = i-1;

      // GP BACK
      switch( way[i] ){

        case model.MOVE_CODE_UP:
          cY++;
          break;

        case model.MOVE_CODE_RIGHT:
          cX--;
          break;

        case model.MOVE_CODE_DOWN:
          cY--;
          break;

        case model.MOVE_CODE_LEFT:
          cX++;
          break;
      }

      // THAT IS A FAULT
      if( lastIndex === -1 ){  
        util.raiseError(
          "unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!" 
        );
      }

      break;
    }

    // INCREASE FUEL USAGE
    fuelUsed += model.moveCosts( mType, model.map[cX][cY] );
  }

  unit.fuel -= fuelUsed;
  if( unit.fuel < 0 ) util.raiseError("illegal game state");

  // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN) SOMEWHERE
  if( unit.x >= 0 && unit.y >= 0 ) model.clearUnitPosition(uid);

  // DO NOT SET NEW POSITION IF THE POSITION IS OCCUPIED THE SET POSITION LOGIC MUST BE DONE BY THE ACTION
  if( model.unitPosMap[cX][cY] === null ) model.setUnitPosition( uid,cX,cY );

  if( DEBUG ){
    util.log( "moved unit",uid,"from (",x,",",y,") to (",cX,",",cY,")" );
  }
};

/**
 * Removes an unit from a position.
 * 
 * @param {Number} uid id number of the target unit
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.clearUnitPosition = function( uid ){
  var unit = model.units[uid];
  
  var x = unit.x;
  var y = unit.y;
  
  // TODO clientInstance must be used
  if( unit.owner === model.turnOwner ) model.modifyVisionAt(x,y,unit.owner,unit.type.vision,-1);
  
  model.unitPosMap[x][y] = null;
  unit.x = -unit.x;
  unit.y = -unit.y;
};

/**
 * Sets the position of an unit.
 * 
 * @param {Number} uid id number of the target unit
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.setUnitPosition = function( uid, x,y ){
  var unit = model.units[uid];
  
  unit.x = x;
  unit.y = y;
  model.unitPosMap[x][y] = unit;
  
  // TODO clientInstance must be used
  if( unit.owner === model.turnOwner ) model.modifyVisionAt(x,y,unit.owner,unit.type.vision,1);
};

/**
 * Returns the movecosts to move with a given move type on a given tile type.
 * 
 * @param {model.moveType} movetype
 * @param {String} tile
 * @returns {Number} move costs or -1 if unmovable
 */
model.moveCosts = function( movetype, tile ){
  var map = movetype.costs;
  var v;
  
  v = map[tile.ID];
  if( typeof v === "number" ) return v;
  
  v = map["*"];
  if( typeof v === "number" ) return v;
  
  return -1;
};

/**
 * @param {type} sx source x coordinate
 * @param {type} sy source y coordinate
 * @param {type} tx target x coordinate
 * @param {type} ty target y coordinate
 * @returns {model.MOVE_CODE_UP|model.MOVE_CODE_RIGHT|model.MOVE_CODE_LEFT|model.MOVE_CODE_DOWN}
 */
model.moveCodeFromAtoB = function( sx,sy,tx,ty ){
  if( model.distance(sx,sy,tx,ty) > 1 ) util.raiseError("positions aren't neighbours");
  
  if( sx < tx ) return model.MOVE_CODE_RIGHT;
  if( sx > tx ) return model.MOVE_CODE_LEFT;
  if( sy < ty ) return model.MOVE_CODE_DOWN;
  if( sy > ty ) return model.MOVE_CODE_UP;
  util.raiseError("fatal error");
};
/**
 * Invokes the next step for multistep actions.
 * 
 * @private
 */
model.invokeNextStep_ = function(){
  controller.stateMachine.event("nextStep");
};
/**
 * @constant
 * @type Number
 */
model.MODE_SAME_OBJECT = -1;

/**
 * @constant
 * @type Number
 */
model.MODE_NONE = 0;

/**
 * @constant
 * @type Number
 */
model.MODE_OWN = 1;

/**
 * @constant
 * @type Number
 */
model.MODE_ALLIED = 2;

/**
 * @constant
 * @type Number
 */
model.MODE_TEAM = 3;

/**
 * @constant
 * @type Number
 */
model.MODE_ENEMY = 4;

/**
 * List that contains all player instances. An inactive player is marked 
 * with {@link CWT_INACTIVE_ID} as team number.
 */
model.players = util.list( CWT_MAX_PLAYER, function( index ){
  return {
    
    // BASE DATA
    gold: 0,
    team: CWT_INACTIVE_ID,
    name: null,
    
    // CO DATA
    mainCo: null,
    sideCo: null,
    power: model.INACTIVE_POWER,
    timesPowerUsed: 0
  };
});

/**
 * Extracts the identical number from an player object.
 *
 * @param player
 */
model.extractPlayerId = function( player ){
  if( player === null ){
    util.raiseError("player argument cannot be null");
  }

  var players = model.players;
  for( var i=0,e=players.length; i<e; i++ ){
    if( players[i] === player ) return i;
  }

  util.raiseError( "cannot find player", players );
};

/**
 * A player has loosed the game round due a specific reason. This function removes all of his units and properties. 
 * Furthermore the left teams will be checked. If only one team is left then the end game event will be invoked.
 * 
 * @param {Number} pid id of the player
 */
model.playerLooses = function( pid ){
  if( DEBUG ) util.logInfo( "player",pid,"looses this game round");

  // REMOVE ALL UNITS
  for( var i = pid*CWT_MAX_UNITS_PER_PLAYER, e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ) model.destroyUnit(i);
  }

  // REMOVE ALL PROPERTIES
  for( var i = 0, e = model.properties.length; i<e; i++ ){
    if( model.properties[i].owner === pid ) model.properties[i].owner = -1;
  }
  
  oldPlayer.team = -1;
  
  // CHECK LEFT TEAMS
  var _teamFound = -1;
  for( var i=0,e=model.players.length; i<e; i++ ){
    var player = model.players[i];
    if( player.team !== -1 ){

      // FOUND AN ALIVE PLAYER
      if( _teamFound === -1 ) _teamFound = player.team;
      else if( _teamFound !== player.team ){
        _teamFound = -1;
        break;
      }
    }
  }

  // NO OPPOSITE TEAMS LEFT ?
  if( _teamFound !== -1 ) controller.endGameRound();
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 */
model.thereIsUnitCheck = function( x,y,pid,mode ){
  if( !model.isValidPosition(x,y) ) return false;
  var unit = model.unitPosMap[x][y];
  return unit !== null && model.relationShipCheck(pid,unit.owner,mode);
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 */
model.thereIsPropertyCheck = function( x,y,pid,mode ){
  if( !model.isValidPosition(x,y) ) return false;
  var property = model.propertyPosMap[x][y];
  return property !== null && model.relationShipCheck(pid,property.owner,mode);
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} pidA
 * @param {Number} pidB
 * @param {model.MODE_NONE|model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY} mode check mode
 */
model.relationShipCheck = function( pidA, pidB ){
  
  // NONE
  if( pidA === null || pidB === null ) return model.MODE_NONE;
  if( pidA === -1   || pidB === -1   ) return model.MODE_NONE;
  if( model.players[pidA].team === -1 || model.players[pidB].team === -1 ) return model.MODE_NONE;
 
  // OWN
  if( pidA === pidB ) return model.MODE_OWN;
   
  var teamA = model.players[pidA].team;
  var teamB = model.players[pidB].team;
  if( teamA === -1 || teamB === -1 ) return model.MODE_NONE;
  
  // ALLIED
  if( teamA === teamB ) return model.MODE_ALLIED;
  
  // ENEMY
  if( teamA !== teamB ) return model.MODE_ENEMY;
  
  return model.MODE_NONE;
};

/**
 * Returns true if there is an unit with a given relationship in one of the neighbour tiles at a given position (x,y).
 * 
 * @param {Number} pid
 * @param {Number} x
 * @param {Number} y
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 * 
 * @example
 *       x
 *     x o x
 *       x
 */
model.relationShipCheckUnitNeighbours = function( pid, x,y , mode ){
  var check = model.relationShipCheck;
  
  // LEFT
  if( x > 0 && model.unitPosMap[x-1][y] !== null && 
          check( pid, model.unitPosMap[x-1][y].owner ) === mode ) return true; 
  
  // UP
  if( y > 0 && model.unitPosMap[x][y-1] !== null && 
          check( pid, model.unitPosMap[x][y-1].owner ) === mode ) return true; 
  
  // RIGHT
  if( x < model.mapWidth-1 && model.unitPosMap[x+1][y] !== null && 
          check( pid, model.unitPosMap[x+1][y].owner ) === mode ) return true; 
  
  // DOWN
  if( y < model.mapHeight-1 && model.unitPosMap[x][y+1] !== null && 
          check( pid, model.unitPosMap[x][y+1].owner ) === mode ) return true; 
  
  return false;
};
/**
 * List of all available properties of a game round. If a property is not 
 * used it will be marked with an owner value {@link CWT_INACTIVE_ID}.
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    x:0,
    y:0,
    type: null
  };
});

/**
 * Matrix that has the same metrics as the game map. Every property will be 
 * placed in the cell that represents its position. A property will be 
 * accessed by model.propertyPosMap[x][y].
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 * Returns true if the tile at position x,y is a property, else false.
 * 
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileIsProperty = function( x,y ){
  return model.propertyPosMap[x][y] !== null;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param property
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    util.raiseError("property argument cannot be null");
  }
  
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }
  
  util.raiseError("cannot find property",property );
};

/**
 * Counts all properties owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countProperties = function( pid ){
  var n = 0;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i].owner === pid ) n++;
  }
  
  return n;
};


/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {String} type
 */
model.buildUnit = function( x,y, type ){  
  model.createUnit( model.turnOwner, x,y, type );
  
  var cost = model.unitTypes[ type ].cost;
  var pl = model.players[ model.turnOwner ];
  if( pl.gold < cost ) util.raiseError("buyer hasn't enough money");
  
  pl.gold -= cost;
};

/**
 * Returns true if a unit type is buildable by a property type.
 * 
 * @param {String} propertyType
 * @param {String} unitType
 * @returns {Boolean}
 */
model.isBuildableByFactory = function( property, unitType ){
  var bList = property.type.builds;
  if( bList === undefined ) return false;
  
  // TODO FIND BETTER SOLUTION
  // if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;
  
  if( bList.indexOf("*") !== -1 ) return true;
  if( bList.indexOf( unitType ) !== -1 ) return true;
  if( bList.indexOf( model.unitTypes[ unitType ].movetype ) !== -1 ) return true;
  
  return false;
};

/**
 * Player gets funds from all properties.
 * 
 * @param {Number} pid id of the player
 */
model.propertyFunds = function( pid ){
  var player = model.players[pid];
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid ){
      
      controller.prepareTags( prop.x, prop.y );
      var funds = controller.scriptedValue( prop.owner,"funds", prop.type.funds );
      if( typeof funds === "number" ) player.gold += funds;
    }
  }
};

/**
 * Player gets resupply from all properties.
 * 
 * @param {Number} pid id of the player
 */
model.propertySupply = function( pid ){
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid && prop.type.supply !== undefined ){
      var x = prop.x;
      var y = prop.y;
      
      // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
      var check = model.thereIsUnitCheck;
      var mode = model.MODE_OWN;
      if( controller.configValue("supplyAlliedUnits") === 1 ) mode = model.MODE_TEAM;
      
      if( check(x,y,pid,mode) ) model.refillResources( model.unitPosMap[x][y] );
    }
  }
};

/**
 * Player properties repairs if possible.
 * 
 * @param {Number} pid id of the player
 */
model.propertyRepairs = function( pid ){
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid ){
      
      var x = prop.x;
      var y = prop.y;
      
      // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
      var check = model.thereIsUnitCheck;
      var mode = model.MODE_OWN;
      if( controller.configValue("repairAlliedUnits") === 1 ) mode = model.MODE_TEAM;
      
      if( check(x,y,pid,mode) ) model.healUnit( model.extractUnitId(model.unitPosMap[x][y]),20,true);
    }
  }
};

/**
 * Lets an unit captures a property. If the capture points of the property falls to zero then the owner of the 
 * property will be changed to the owner of the capturer.
 * 
 * @param {Number} cid id of the capturer
 * @param {Number} prid id of the property
 */
model.captureProperty = function( cid, prid ){
  var selectedUnit = model.units[cid];
  var property = model.properties[prid];
  var points = parseInt( selectedUnit.hp/10, 10 ) +1;
  
  property.capturePoints -= points;
  if( property.capturePoints <= 0 ){
    var x = property.x;
    var y = property.y;
    
    if( DEBUG ) util.logInfo( "property",prid,"captured by",cid);
    
    model.modifyVisionAt( x,y, property.type.vision, 1 );
    
    // TYPE CHANGE ?
    var changeType = property.type.changeAfterCaptured;
    if( typeof changeType !== "undefined" ){
      
      if( DEBUG ) util.logInfo( "property",prid,"changes type to",changeType);
      property.type = changeType;
    }
    
    // CRITICAL PROPERTY
    if( property.type.looseAfterCaptured === true ){
      var pid = property.owner;      
      model.playerLooses(pid);
    }
    
    // SET NEW META DATA
    property.capturePoints = 20;
    property.owner = selectedUnit.owner;
    
    // CAPTURE LIMIT REACHED ?
    var capLimit = controller.configValue("captureLimit");
    if( capLimit !== 0 && model.countProperties() >= capLimit ){
      controller.endGameRound();
    }
  }
};

model.changePropertyType = function( pid, type ){
  model.properties[pid] = type;
};

util.scoped(function(){
  
  function doDamage( x,y,invokerPid ){
    // var team = model.players[invokerPid].team;
    var unit = model.unitPosMap[x][y];
    
    // DO DAMAGE 
    if( unit !== null /* && model.players[ unit.owner ].team !== team */ ){
      model.damageUnit( model.extractUnitId(unit),20,9);
    }
  }
  
  model.fireSilo = function( siloId, tx,ty, range, owner ){  
    model.doInRange( tx,ty,range, doDamage, owner );
                        
    // SET EMPTY TYPE
    var type = model.properties[siloId].type;
    model.changePropertyType(siloId, type.changeTo );
    
    // TIMER
    model.pushTimedEvent( model.daysToTurns(5), model.changePropertyType.callToList( siloId, type.ID ) );
  };
});
/**
 * Represents the current action day in the game. The day attribute increases
 * everytime if the first player starts its turn.
 * 
 * @type {Number}
 */
model.day = 0;

/**
 * Holds the identical number of the current turn owner.
 * 
 * @type {Number} 
 */
model.turnOwner = -1;

/**
 * 
 */
model.configRule = {};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param pid player id
 */
model.isTurnOwner = function( pid ){
  return model.turnOwner === pid;
};

/**
 * Converts a number of days into turns.
 *
 * @param {Number} v number in days
 */
model.daysToTurns = function( v ){
  return model.players.length*v;
};

/**
 * Ends the turn for the current active turn owner.
 */
model.nextTurn = function(){
  var pid = model.turnOwner;
  var oid = pid;
  
  if( DEBUG ) util.log("player",pid,"ends it's turn");
  
  // FIND NEXT PLAYER
  pid++;
  while( pid !== oid ){

    if( pid === CWT_MAX_PLAYER ){
      pid = 0;
      
      // NEXT DAY
      model.day++;
      model.tickTimedEvents();

      var dayLimit = controller.configValue("dayLimit");
      if( dayLimit > 0 && model.day === dayLimit ){
        controller.endGameRound();
      }
    }

    if( model.players[pid].team !== CWT_INACTIVE_ID ){

      // FOUND NEXT PLAYER
      break;
    }

    // INCREASE ID
    pid++;
  }
  
  // SAME PLAYER ? -> CORRUPT GAME STATE
  if( pid === oid ) util.raiseError("could not find next player");
  
  // MISC ACTIONS
  model.drainFuel(pid);
  model.propertyFunds(pid);
  model.propertyRepairs(pid);
  model.propertySupply(pid);
  model.resetActableStatus(pid);
  if( controller.configValue("autoSupplyAtTurnStart") === 1 ) model.supplyUnitsBySupplierUnits(pid);

  model.recalculateFogMap( pid );
  
  if( DEBUG ) util.log("player",pid,"is new turn owner");
  model.turnOwner = pid;

  model.resetTurnTimer(); 
};
/**
 * Transfers money from one player to another player.
 * 
 * @param {Number} splid id of the source player
 * @param {Number} tplid id of the target player
 * @param {Number} money amount of money
 */
model.transferMoney = function( splid, tplid, money ){
  var sPlayer = model.players[ splid ];
  var tPlayer = model.players[ tplid ];

  // CHECK MONEY
  if( money > sPlayer.gold ) util.raiseError("source player does not has",money,"units of money");

  // TRANSFER GOLD
  sPlayer.gold -= money;
  tPlayer.gold += money;
};

/**
 * Transfers an unit from one player to another player.
 * 
 * @param {Number} suid
 * @param {Number} tplid
 */
model.transferUnit = function( suid, tplid ){
  var selectedUnit = model.units[suid];
  var tx = selectedUnit.x;
  var ty = selectedUnit.y;
  var opid = selectedUnit.owner;

  selectedUnit.owner = CWT_INACTIVE_ID;

  // REMOVE VISION
  if( model.players[tplid].team !== model.players[opid].team ){
    model.modifyVisionAt(selectedUnit.x, selectedUnit.y, selectedUnit.type.vision, -1);
  }

  model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ] = null;

  model.createUnit( tplid, selectedUnit.x, selectedUnit.y, selectedUnit.type.ID );
  
  var targetUnit =  model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ];
  targetUnit.hp = selectedUnit.hp;
  targetUnit.ammo = selectedUnit.ammo;
  targetUnit.fuel = selectedUnit.fuel;
  targetUnit.exp = selectedUnit.exp;
  targetUnit.type = selectedUnit.type;
  targetUnit.x = tx;
  targetUnit.y = ty;
  targetUnit.loadedIn = selectedUnit.loadedIn;
};

/**
 * Transfers a property from one player to another player.
 * 
 * @param {Number} sprid
 * @param {Number} tplid
 */
model.transferProperty = function( sprid, tplid ){
  var prop =  model.properties[sprid];
  prop.owner = tplid;

  var x;
  var y;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      if( model.propertyPosMap[x][y] === prop ){
        // TODO 
        return;
      }
    }
  }
};
util.scoped(function(){
  
  // CONFIG
  var turnTimeLimit = 0;
  var gameTimeLimit = 0;
  
  /** @type Number */
  model.gametimeElapsed = 0;
  
  /** @type Number */
  model.turntimeElapsed = 0;
  
  /**
   * Resets the game round timer.
   */
  model.resetTurnTimer = function(){ 
    model.turntimeElapsed = 0;
  };

  /**
   * @param {Number} delta
   */
  model.updateTimer = function( delta ){
    model.turntimeElapsed += delta;
    model.gametimeElapsed += delta;
    
    // FORCE END TURN ?
    if( turnTimeLimit && model.turntimeElapsed >= turnTimeLimit ){
      model.nextTurn.callAsCommand();
    }
    
    // END GAME ?
    if( gameTimeLimit && model.gametimeElapsed >= gameTimeLimit ){
      controller.endGameRound();
    }
  };
  
  /**
   * 
   */
  model.setupTimer = function(){
    model.turntimeElapsed = 0;
    model.gametimeElapsed = 0;
    
    // CONVERT TO MILLISECONDS AND CACHE THEM
    turnTimeLimit = controller.configValue("turnTimeLimit")*60000;
    gameTimeLimit = controller.configValue("gameTimeLimit")*60000;
    
  };
});


/**
 * Has a transporter unit with id tid loaded units? Returns true if yes, else
 * false.
 *
 * @param {Number} tid transporter id
 */
model.hasLoadedIds = function( tid ){
  var pid = model.units[ tid ].owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns true if the unit with the id lid is loaded by a transporter unit
 * with id tid.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.loadUnitInto = function( loadId, transportId ){
  if( !model.canLoad( loadId, transportId ) ){
    util.raiseError("transporter unit",transportId,"cannot load unit",loadId);
  }

  model.units[ loadId ].loadedIn = transportId;
  model.units[ transportId ].loadedIn--;
};

/**
 * Unloads the unit with id lid from a tranporter with the id tid.
 *
 * @param {Number} lid
 * @param {Number} tid
 */
model.unloadUnitFrom = function( transportId, trsx, trsy, loadId, tx,ty ){
  
  // TRAPPED ?
  if( tx === -1 || ty === -1 ) return;

  // SEND LOADED UNIT INTO WAIT
  model.units[ loadId ].loadedIn = -1;
  model.units[ transportId ].loadedIn++;

  var moveCode;
  if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
  else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
  else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
  else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;

  // MOVE OUT
  model.moveUnit([moveCode], loadId, trsx, trsy);
  model.markUnitNonActable( loadId );
};

/**
 * Returns true if a tranporter with id tid can load the unit with the id
 * lid. This function also calculates the resulting weight if the transporter
 * would load the unit. If the calculated weight is greater than the maxiumum
 * loadable weight false will be returned.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.canLoad = function( lid, tid ){
  if( lid === tid ) util.raiseError("transporter cannot load itself");
  
  var transporter = model.units[ tid ];
  var load = model.units[ lid ];
    
  // LEFT SLOTS ?
  var maxLoads = transporter.type.maxloads;
  if( transporter.loadedIn + maxLoads + 1 === 0 ) return false; // LOADED IN OF TRNSP MARKS THE AMOUNT OF LOADS
                                                                // LOADS = (LOADIN + 1) + MAX_LOADS
  
  // IS UNIT TYPE LOADABLE ?
  var tpsL = transporter.type.canload;
  if(
    ( tpsL.indexOf( load.type.ID ) === -1 ) && // ID
    ( tpsL.indexOf( load.type.movetype ) === -1 ) && // MOVETYPE
    ( tpsL.indexOf("*") === -1 ) // ALL TYPE
  ) return false; 

  return true;
};

/**
 * Returns true if the unit with id tid is a traensporter, else false.
 *
 * @param {Number} tid transporter id
 */
model.isTransport = function( tid ){
  return typeof model.units[ tid ].type.maxloads === "number";
};
/**
 * Matrix with the same metrics like the map. Every unit is placed into the 
 * cell that represents its position.
 */
model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * List of all unit objects. An inactive unit is marked with 
 * {@link CWT_INACTIVE_ID} as owner.
 */
model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER, function(){
  return {
    x:0,
    y:0,
    hp: 99,
    ammo: 0,
    fuel: 0,
    type: null,
    loadedIn: -1,
    hidden: false,
    owner: CWT_INACTIVE_ID
  };
});

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
model.extractUnitId = function( unit ){
  if( unit === null ) util.raiseError("unit argument cannot be null");

  var units = model.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  util.raiseError("cannot find unit", unit );
};

/**
 * Returns true if a player with a given player id has free slots for new units.
 * 
 * @param {Number} pid player id
 * @returns {Boolean}
 */
model.hasFreeUnitSlots = function( pid ){
  
  var i=pid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for( ; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      return true;
    }
  }

  return false;
};

/**
 * Returns true if a given position is occupied by an unit, else false.
 *
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @return {Number} -1 if tile is not occupied else the id number from the unit that occupies the tile
 */
model.isTileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return -1;
  else return model.extractUnitId( unit );
};

/**
 * Counts all units that are owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countUnits = function( pid ){
  var n = 0;
  var i=pid*CWT_MAX_UNITS_PER_PLAYER; 
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  
  for(; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ) n++;
  }

  return n;
};

/**
 * Converts and returns the HP points from the health value of an unit.
 * 
 * @example
 *  health ->  HP
 *    69   ->   7
 *    05   ->   1
 *    50   ->   6
 *    99   ->  10
 * 
 * @param {object} unit
 */
model.unitHpPt = function( unit ){
  return parseInt( unit.hp/10 )+1;
};

/**
 * Gets the rest of unit health 
 * 
 * TODO CHECK THIS!
 *    
 * @param {object} unit
 */
model.unitHpPtRest = function( unit ){
  var pt = parseInt( unit.hp/10 )+1;
  return unit.hp - pt;
};

/**
 * Converts HP points to a health value.
 * 
 * @example
 *   6 HP -> 60 health
 *   3 HP -> 30 health
 * 
 * @param {Number} pt
 */
model.ptToHp = function( pt ){
  return (pt*10);
};

/**
 * Refills the resources of an unit.
 * 
 * @param {Number|Unit} uid id of the unit or the unit object itself
 */
model.refillResources = function( uid ){
  var unit = ( typeof uid.x === "number" )? uid : model.units[uid];
  var type = unit.type;
  unit.ammo = type.ammo;
  unit.fuel = type.fuel;
};

/**
 * A supplier supplies all surrounding units that can 
 * be supplied by the supplier.
 * 
 * @param {Number} sid supplier id
 * @param {Number} x
 * @param {Number} y
 * 
 * @example
 *  cross pattern
 *      x
 *    x o x
 *      x
 */
model.unitSuppliesNeighbours = function( sid ){
  var selectedUnit = model.units[ sid ];  
  if( selectedUnit.type.supply === undefined ) util.raiseError("unit is not a supplier unit");
  
  var x = selectedUnit.x;
  var y = selectedUnit.y;
  var pid = selectedUnit.owner;
  
  // TODO check supply targets
  
  // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
  var mode = ( controller.configValue("supplyAlliedUnits") === 1 )? model.MODE_TEAM : model.MODE_OWN;
  var check = model.relationShipCheck;
  
  // LEFT
  if( x > 0 && model.unitPosMap[x-1][y] !== null && 
          check( pid, model.unitPosMap[x-1][y].owner, mode ) ) model.refillResources( model.unitPosMap[x-1][y] );
  
  // UP
  if( y > 0 && model.unitPosMap[x][y-1] !== null && 
          check( pid, model.unitPosMap[x][y-1].owner, mode ) ) model.refillResources( model.unitPosMap[x][y-1] );
  
  // RIGHT
  if( x < model.mapWidth-1 && model.unitPosMap[x+1][y] !== null && 
          check( pid, model.unitPosMap[x+1][y].owner, mode ) ) model.refillResources( model.unitPosMap[x+1][y] );
  
  // DOWN
  if( y < model.mapHeight-1 && model.unitPosMap[x][y+1] !== null && 
          check( pid, model.unitPosMap[x][y+1].owner, mode ) ) model.refillResources( model.unitPosMap[x][y+1] );
};

/**
 * Inflicts damage to an unit.
 * 
 * @param {Number|x of model.units} uid
 * @param {Number} damage
 */
model.damageUnit = function( uid, damage, minRest ){
  if( typeof uid !== "number" ) util.raiseError("id expected");
  
  var unit = model.units[uid];
  unit.hp -= damage;
  
  if( minRest && unit.hp <= minRest ){ 
    unit.hp = minRest;
  }
  else{
    // DESTROY UNIT IF HEALTH FALLS TO ZERO
    if( unit.hp <= 0 ){ 
      model.destroyUnit(uid);
    }
  }
};

/**
 * Heals an unit. If the unit health will be greater than the maximum health value then the difference will 
 * be added as gold to the owners gold depot.
 * 
 * @param {Number} uid
 * @param {Number} health
 * @param {Boolean} diffAsGold if false then the difference won't be added as gold to the owners resource depot
 *                  ( default = false )
 */
model.healUnit = function( uid, health, diffAsGold ){
  if( typeof uid !== "number" ) util.raiseError("id expected");
  
  var unit = model.units[uid];
    
  unit.hp += health;
  if( unit.hp > 99 ){

    // PAY DIFFERENCE TO OWNERS GOLD DEPOT
    if( diffAsGold === true ){
      var diff = unit.hp - 99;
      model.players[ unit.owner ].gold += parseInt( (unit.type.cost*diff)/100, 10 );
    }

    unit.hp = 99;
  }
};

/**
 * Hides an unit.
 * 
 * @param {Number} uid
 */
model.hideUnit = function( uid ){
  model.units[uid].hidden = true;
};

/**
 * Unhides an unit.
 * 
 * @param {Number} uid
 */
model.unhideUnit = function( uid ){
  model.units[uid].hidden = false;
};

/**
 * Joins two units together. If the combined health is greater than the maximum health then the difference will be
 * payed to the owners resource depot.
 * 
 * @param {Number} juid id of the joining unit
 * @param {Number} jtuid id of the join target unit
 */
model.joinUnits = function( juid, jtuid ){
  var joinSource = model.units[juid];
  var joinTarget = model.units[jtuid];
  if( joinTarget.type !== joinSource.type ) util.raiseError("both units has to be the same type of unit");

  // HP
  model.healUnit(jtuid, model.ptToHp(model.unitHpPt( joinSource )),true);

  // AMMO
  joinTarget.ammo += joinSource.ammo;
  if( joinTarget.ammo > joinTarget.type.ammo ) joinTarget.ammo = joinTarget.type.ammo;

  // FUEL
  joinTarget.fuel += joinSource.fuel;
  if( joinTarget.fuel > joinTarget.type.fuel ) joinTarget.fuel = joinTarget.type.fuel;

  // TODO EXP

  // DISBAND JOINER
  joinSource.owner = CWT_INACTIVE_ID;
};

/**
 * The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units of a player will 
 * be checked 
 *  
 * @param {Number} plid
 */
model.drainFuel = function( plid ){
  
  var unit;
  var i=plid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for(; i<e; i++ ){
    unit = model.units[i];
    if( unit.owner === CWT_INACTIVE_ID ) continue;
    
    var v = unit.type.dailyFuelDrain;
    if( typeof v === "number" ){
      
      // HIDDEN UNITS MAY DRAIN MORE FUEL
      if( unit.hidden && unit.type.dailyFuelDrainHidden ){
        v = unit.type.dailyFuelUseHidden;
      }
      
      unit.fuel -= v;
      
      // IF FUEL IS EMPTRY THEN DESTROY IT
      if( unit.fuel <= 0 ) model.destroyUnit(i);
    }
  }
};

/**
 * The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units of a player will 
 * be checked 
 * 
 * @param {Number} plid
 */
model.supplyUnitsBySupplierUnits = function( plid ){
  var i=plid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for(; i<e; i++ ){
    unit = model.units[i];
    if( unit.owner === CWT_INACTIVE_ID ) continue;
    
    if( unit.type.supply !== undefined ) model.unitSuppliesNeighbours(i);
  }
};

/**
 * Registers a new unit object in the stock of a player. The unit 
 * will be created and placed into the tile at position (x,y).
 * 
 * @param {Number} pid id number of the player
 * @param {Number} x x coordinate of the target
 * @param {Number} y y coordinate of the target
 * @param {String} type type of the new unit
 */
model.createUnit = function( pid, x, y, type ){
  
  var i = pid*CWT_MAX_UNITS_PER_PLAYER;
  var e = i+CWT_MAX_UNITS_PER_PLAYER;
  for( ; i<e; i++ ){

    // FILL SLOT IF FREE
    if( model.units[i].owner === CWT_INACTIVE_ID ){
      var typeSheet = model.unitTypes[type];
      var unit = model.units[i];
      
      unit.hp = 99;
      unit.owner = pid;
      unit.type = typeSheet;
      unit.ammo = typeSheet.ammo; 
      unit.fuel = typeSheet.fuel;
      unit.loadedIn = -1;
      model.setUnitPosition(i,x,y);

      if( DEBUG ) util.log("build unit for player",pid,"in slot",i);
      return;
    }
  }

  util.raiseError("cannot build unit for player",pid,"because no slot is free");
};

/**
 * Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, will be
 * freed from any position information.
 * 
 * @param {Number} uid id number of the unit
 */
model.destroyUnit = function( uid ){
  model.clearUnitPosition(uid);
  var unit = model.units[uid];
  
  // MARK UNIT AS UNUSED
  unit.owner = CWT_INACTIVE_ID; 

  // END GAME IF NO UNIT LEFT LOOSE CONDITION IS TRUE
  if( controller.configValue("noUnitsLeftLoose") === 1 && model.countUnits( unit.owner ) === 0 ){
    controller.endGameRound();
  } 
};
/**
 * The type of the active weather.
 */
model.weather = null;

/**
 * 
 */
model.calculateNextWeather = function(){  
  var newTp;
  var duration;
  
  // SEARCH RANDOM WEATHER
  if( model.weather !== null && model.weather === model.defaultWeatherType ){
    var list = model.nonDefaultWeatherType;
    newTp = list[ parseInt(Math.random()*list.length,10) ].ID;
    duration = 1;
  }
  // TAKE DEFAULT WEATHER
  else{
    newTp = model.defaultWeatherType.ID;
    duration = controller.configValue("weatherMinDays") + parseInt( controller.configValue("weatherRandomDays")*Math.random(), 10);
  }
  
  model.changeWeather.callAsCommand(newTp);
  
  if( DEBUG ) util.log( "Weather will change in",duration,"days" );
  
  model.pushTimedEvent( 
    model.daysToTurns(duration), 
    model.calculateNextWeather.callToList() 
  );
};

/**
 * 
 * @param {String} wth
 * @param {Number} duration
 */
model.changeWeather = function( wth ){
  if( !model.weatherTypes.hasOwnProperty(wth)){
    util.raiseError("unknown weather type");
  }
  
  if( DEBUG ) util.log( "changing weather to",wth);
   
  model.weather = model.weatherTypes[wth];
};

/**
 * 
 */
controller.actionMap = {};

/** 
 * Contains all known action objects.
 *  
 * @private 
 */
controller.actionObjects = {};

/** 
 * Action buffer object that holds all actions that aren't invoked yet.
 * 
 * @private 
 */
controller.actionBuffer_ = util.createRingBuffer(CWT_ACTIONS_BUFFER_SIZE);

/**
 * Registers an user callable action.
 *
 * @param impl action implementation
 */
controller.defineAction_ = function(impl) {

  // CHECKS
  if (!impl.hasOwnProperty("condition")) util.raiseError("condition needed");
  if (!impl.hasOwnProperty("key")) util.raiseError("action key isn't defined");
  if (!impl.hasOwnProperty("invoke")) util.raiseError("action implementation isn't defined");
  
  if (controller.actionObjects.hasOwnProperty(impl.key)) util.raiseError("action key is already registered");
  
  if (!impl.hasOwnProperty("prepareMenu")) impl.prepareMenu = null;
  if (!impl.hasOwnProperty("prepareTargets")) impl.prepareTargets = null;
  if (!impl.hasOwnProperty("isTargetValid")) impl.isTargetValid = null;
  if (!impl.hasOwnProperty("multiStepAction")) impl.multiStepAction = false;
  if (impl.prepareTargets !== null && !impl.hasOwnProperty("targetSelectionType")) impl.targetSelectionType = "A";
  if (impl.prepareTargets !== null && impl.isTargetValid !== null) {
    util.raiseError("only one selection type can be used in an action");
  } 

  // REGISTER PROGRAMATIC LINK
  controller.actionObjects[ impl.key ] = impl;
};

controller.unitAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = true;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

controller.propertyAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = false;
  impl.propertyAction = true;
  controller.defineAction_(impl);
};

controller.mapAction = function( impl ){
  impl.mapAction = true;
  impl.unitAction = false;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

/** @private */
controller.callToList_ = function(){
  
  // ADD KEY
  var args = [];
  for( var i=0,e=arguments.length; i<e; i++ ) args[i] = arguments[i];
  args[ args.length ] = this.__actionId__;
    
  return args;
};

/** @private */
controller.callAsCommand_ = function(){
  
  // ADD KEY
  var args = [];
  for( var i=0,e=arguments.length; i<e; i++ ) args[i] = arguments[i];
  args[ args.length ] = this.__actionId__;
  
  if( DEBUG ){
    util.log(
      "adding",JSON.stringify(args),
      "to the command stack as",controller.actionMap[this.__actionId__],
      "command")
  }
  
  // SEND COMMAND
  if( controller.isNetworkGame() ) controller.sendNetworkMessage( JSON.stringify(args) );
  
  // REGISTER COMMAND
  controller.actionBuffer_.push( args );
};

/** @private */
controller.listenCommand_ = function(cb){
  controller.listenCommand( controller.actionMap[this.__actionId__], cb );
};

util.scoped(function(){
  var id = 0;
  var keys = Object.keys(model);
  for( var i=0,e=keys.length; i<e; i++ ){
    
    var actName = keys[i];
    var propValue = model[actName];
    if( typeof propValue === "function" ){
      propValue.__actionId__ = id.toString();
      propValue.callAsCommand = controller.callAsCommand_;
      propValue.callToList = controller.callToList_;
      propValue.listenCommand = controller.listenCommand_;
      controller.actionMap[id.toString()] =  keys[i];
      id++;
    }
  }
});
util.scoped(function(){
  
  var scope = null;
    
  /**
   * Builds several commands from collected action data.
   */
  controller.buildAction = function(){
    if( !scope ) scope = controller.stateMachine.data;
    
    var targetDto = scope.target;
    var sourceDto = scope.source;
    var moveDto = scope.movePath;
    var actionDto = scope.action;
    var actionObject = controller.actionObjects[actionDto.selectedEntry];
    var trapped = false;

    // ADD MOVE PATH
    if( moveDto.data.length > 0 ){

      // TRAPPED ?
      if( moveDto.data !== null ){
        var way = moveDto.data;

        var cx = sourceDto.x;
        var cy = sourceDto.y;
        for( var i=0,e=way.length; i<e; i++ ){

          switch( way[i] ){
            case model.MOVE_CODE_DOWN  : cy++; break;
            case model.MOVE_CODE_UP    : cy--; break;
            case model.MOVE_CODE_LEFT  : cx--; break;
            case model.MOVE_CODE_RIGHT : cx++; break;
          }

          var unit = model.unitPosMap[cx][cy];
          if( unit !== null ){

            if( model.players[model.turnOwner].team !==
              model.players[unit.owner].team ){

              // CONVERT TO TRAP WAIT
              targetDto.set(cx,cy);
              way.splice( i );
              trapped = true;
            }
          }
        }
      }

      // MOVE COMMAND
      model.moveUnit.callAsCommand( moveDto.clone(), sourceDto.unitId, sourceDto.x, sourceDto.y );
    }

    // ACTION COMMAND
    if( !trapped ) actionObject.invoke( scope );
    else model.trapWait.callAsCommand( sourceDto.unitId );

    // UNIT ACTIONS LEADS INTO A WAIT COMMAND 
    if( actionObject.unitAction && actionDto.selectedEntry !== "wait" ){
      model.markUnitNonActable.callAsCommand( sourceDto.unitId );
    }

    return trapped;
  };
});
(function(){
  
  var listeners = {};
  
  /**
   * @param {String} action name
   * @param {Function} cb callback
   */
  controller.listenCommand = function( name, cb ){
    if( typeof model[name].__actionId__ === "undefined" ){
      util.raiseError(name+" isn't a valid command able action");
    }
    
    // IF NO LISTENER IS REGISTERD
    if( listeners[name] ){
      util.raiseError("listener for",name,"is already registered");
    }
    
    var propValue = model[name];
    
    // REGISTER NEW FUNCTION THAT INVOKES THE LISTENER AUTOMATICALLY
    model[name] = function(){
        
      // INVOKE ACTION
      var res = propValue.apply(model,arguments);
        
      // INVOKE LISTENER
      cb.apply(null,arguments);
      
      return res;
    };
    
    // SHORTCUTS
    model[name].callAsCommand = function(){
      propValue.callAsCommand.apply(propValue,arguments);
    };
    model[name].callToList = function(){
      propValue.callToList.apply(propValue,arguments);
    };
        
    listeners[name] = true;
  };
  
})();
util.scoped(function(){

  function clientNeedsToImplementMe( name ){
    var msg = "client has to implement interface "+name;
    return function(){
      util.raiseError(msg);
    };
  }
  
  /**
   * Returns true if the current session a network session, else false.
   */
  controller.isNetworkGame = clientNeedsToImplementMe(
    "controller.isNetworkGame"
  );
  
  /**
   * Parses a network message and invokes the action stack with the 
   * decoded message as argument.
   * 
   * @config
   */
  controller.parseNetworkMessage = clientNeedsToImplementMe(
    "controller.parseNetworkMessage"
  );
  
  /**
   * Encodes an argument array and sends it to the server instance.
   *
   * @config
   */
  controller.sendNetworkMessage = clientNeedsToImplementMe(
    "controller.sendNetworkMessage"
  );

});
/**
 * Loads a modification into the game engine.
 * 
 * @param {Object} data
 */
model.loadModification = function( data ){
  var i,e;
  
  // WEATHERS
  for( i=0,e=data.weathers.length; i<e; i++ ) model.parseWeatherType( data.weathers[i] );
  
  // TILES
  for( i=0,e=data.tiles.length; i<e; i++ ) model.parseTileType( data.tiles[i] );
  
  // MOVETYPES
  for( i=0,e=data.movetypes.length; i<e; i++ ) model.parseMoveType( data.movetypes[i] );
  
  // UNITS
  for( i=0,e=data.units.length; i<e; i++ ) model.parseUnitType( data.units[i] );
  
  // FACTIONS
  for( i=0,e=data.factions.length; i<e; i++ ) model.parseFactionType( data.factions[i] );
  
  // COMMANDERS (CO)
  for( i=0,e=data.commanders.length; i<e; i++ ) model.parseCoType( data.commanders[i] );
  
  
  // GLOBAL RULES (TODO: NEEDED?)
  for( i=0,e=data.globalRules.length; i<e; i++ ) model.parseRule( data.globalRules[i], false );
  
  // GRAPHICS AND SOUNDS
  model.graphics = data.graphics;
  model.sounds = data.sounds;
  model.maps = data.maps;
          
  // LANG
  model.language = data.language;
};
util.scoped(function(){

  /**
   * Deserializes an unit object and prepares the model.
   *
   * @param {Array} data
   */
  function deserializeUnit( data ){
    
    // GET UNIT
    var id = data[0];
    var unit = model.units[id];
    
    // INJECT DATA
    unit.type     = model.unitTypes[data[1]];
    unit.x        = data[2];
    unit.y        = data[3];
    unit.hp       = data[4];
    unit.ammo     = data[5];
    unit.fuel     = data[6];
    unit.loadedIn = data[7];
    unit.owner    = data[8];
    
    model.unitPosMap[ data[2] ][ data[3] ] = unit;
  };  
  
  /**
   * Serializes an unit object.
   *
   * @param {object} unit
   */
  function serializeUnit( unit ){
    
    return [
      model.extractUnitId(unit),
      unit.type.ID,
      unit.x,
      unit.y,
      unit.hp,
      unit.ammo,
      unit.fuel,
      unit.loadedIn,
      unit.owner
    ];
  };
  
  /**
   * Serializes an player object.
   *
   * @param {object} player
   */
  function serializePlayer( player ){
    
    return [
      player.extractPlayerId( player ),
      player.name,
      player.gold,
      player.team,
      (player.mainCo)? player.mainCo.ID: "",
      (player.sideCo)? player.sideCo.ID: "",
      player.power,
      player.timesPowerUsed
    ];
  };
  
  /**
   * Deserializes an player object and prepares the model.
   *
   * @param {Array} data
   */
  function deserializePlayer( data ){
    
    // GET PLAYER
    var id = data[0];
    var player = model.players[id];
    
    // BASE DATA
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
    
    // CO DATA
    (data[4])? player.mainCo = model.coTypes[data[4]]: null;
    (data[5])? player.sideCo = model.coTypes[data[5]]: null;
    player.power = data[6];
    player.timesPowerUsed = data[7];
  };
  
  /**
   * Serializes a property object.
   *
   * @param {object} property
   */
  function serializeProperty( property ){
    
    // SEARCH POSITION
    var px,py;
    var found = false;
    for( var x=0; x<model.mapWidth && !found; x++ ){
      for( var y=0; y<model.mapHeight && !found; y++ ){
        if( model.propertyPosMap[x][y] === property ){
          px = x;
          py = y; // TODO GRAB FROM OBJECT LATER
          found = true;
        }
      }
    }
    
    return [
      model.extractPropertyId( property ),
      px,
      py,
      property.type.ID,
      property.capturePoints,
      property.owner
    ];
  };
  
  function deserializeProperty( data ){
    
    // GET PROPERTY
    var id = data[0];
    var property = model.properties[id];
    
    // INJECT DATA
    property.type          = model.tileTypes[data[3]];
    property.capturePoints = data[4];
    property.owner         = data[5];
    property.x = data[1];
    property.y = data[2];
    
    model.propertyPosMap[ data[1] ][ data[2] ] = property;
  };
  
  
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  
  /**
   * Generates an object model from the CWT domain model.
   * 
   * @returns {object} object model from CWT domain model
   */
  model.getCompactModel = function(){
    
    var dom = {};
    
    // META DATA
    dom.day = model.day;
    dom.turnOwner = model.turnOwner;
    dom.mapWidth = model.mapWidth;
    dom.mapHeight = model.mapHeight;
    dom.timeElapsed = model.timeElapsed;
        
    // MAP
    dom.map = [];
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      
      dom.map[x] = [];
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        
        var type = dom.map[x][y].ID;
        
        if( !mostIdsMap.hasOwnProperty(type) ){
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }
        
        dom.map[x][y] = mostIdsMap[type];
      }
    }
    
    // ADD TYPE MAP
    dom.typeMap = [];
    var typeKeys = Object.keys( mostIdsMap );
    for( var i=0,e=typeKeys.length; i<e; i++ ){
      dom.typeMap[ mostIdsMap[typeKeys[i]] ] = typeKeys[i];
    }
    
    // UNITS
    dom.units = [];
    for( var i=0,e=model.units.length; i<e; i++ ){
      if( model.units[i].owner !== CWT_INACTIVE_ID ){
        dom.units.push( serializeUnit(model.units[i]) );
      }
    }
    
    // PROPERTIES
    dom.properties = [];
    for( var i=0,e=model.properties.length; i<e; i++ ){
      if( model.properties[i].owner !== CWT_INACTIVE_ID ){
        dom.properties.push( serializeProperty(model.properties[i]) );
      }
    }
    
    // PLAYERS
    dom.players = [];
    for( var i=0,e=model.players.length; i<e; i++ ){
      if( model.players[i].team !== CWT_INACTIVE_ID ){
        dom.players.push( serializePlayer(model.players[i]) );
      }
    }
    
    // ACTORS
    dom.actors = [];
    for( var i=0,e=model.leftActors.length; i<e; i++ ){
      if( model.leftActors[i] ){
        dom.actors.push( i );
      }
    }
    
    // TURN TIMERS
    dom.timers = [];
    for( var i=0,e=model.turnTimedEvents_time_.length; i<e; i++ ){
      if( model.turnTimedEvents_time_[i] !== null ){
        dom.timers.push([
          model.turnTimedEvents_time_[i],
          model.turnTimedEvents_data_[i]
        ]);
      }
    }
        
    return dom;
    
  };
  
  /**
   * Loads a CWT domain model from a given object model.
   * 
   * @param {object} data
   */
  model.loadCompactModel = function( data ){
    
    model.day = data.day;
    model.turnOwner = data.turnOwner;
    model.mapWidth = data.mapWidth;
    model.mapHeight = data.mapHeight;
    model.timeElapsed = data.timeElapsed;
        
    // MAP
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.unitPosMap[x][y] = null;
        model.propertyPosMap[x][y] = null;
        model.map[x][y] = model.tileTypes[ data.typeMap[ data.map[x][y] ] ];
      }
    }
    
    // UNITS
    for( var i=0,e=model.units.length; i<e; i++ ){
      model.units[i].owner = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.units.length; i<e; i++ ){
      deserializeUnit( data.units[i] );
    }
    
    // PROPERTIES
    for( var i=0,e=model.properties.length; i<e; i++ ){
      model.properties[i].owner = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.properties.length; i<e; i++ ){
      deserializeProperty( data.properties[i] );
    }
    
    // PLAYERS
    for( var i=0,e=model.players.length; i<e; i++ ){
      model.players[i].team = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.players.length; i<e; i++ ){
      deserializePlayer( data.players[i] );
    }
    
    // ACTORS
    for( var i=0,e=model.leftActors.length; i<e; i++ ){
      model.leftActors[i] = false;
    }
    
    for( var i=0,e=data.leftActors.length; i<e; i++ ){
      model.leftActors[ data.leftActors[i] ] = true;
    }
    
    // TURN TIMERS
    for( var i=0,e=model.turnTimedEvents_time_.length; i<e; i++ ){
      model.turnTimedEvents_time_[i] = null;
      model.turnTimedEvents_data_[i] = null;
    }
    
    for( var i=0,e=data.timers.length; i<e; i++ ){
      model.turnTimedEvents_time_[i] = data.timers[i][0];
      model.turnTimedEvents_data_[i] = data.timers[i][1];
    }
    
    // MAP RULES
    model.mapRules.splice(0);
    for( var i=0,e=data.rules.length; i<e; i++ ){
      model.parseRule( data.rules[i], true );
    }
    
    // BUILD CONFIG
    controller.buildRoundConfig({});
  };
  
});
/**
 * @private
 TODO move into the modules
 */
controller.scriptBoundaries_ = {
  minrange:[   1,CWT_MAX_SELECTION_RANGE-1 ],
  maxrange:[   1,CWT_MAX_SELECTION_RANGE   ],
  moverange:[   1,CWT_MAX_SELECTION_RANGE   ],
  movecost:[   1,CWT_MAX_SELECTION_RANGE   ],
  vision:[   1,10   ],
  att:[  50,400   ],
  counteratt:[  50,400   ],
  def:[  50,400   ],
  luck:[ -50,50    ],
  captureRate:[   50,9999 ],
  neutralizeWeather:[   0,1     ],
  firstcounter:[   0,1     ],
  funds:[   1,99999 ],
  fuelDrain:[   1,1     ],
  comtowerbonus:[   1,100   ],
  terraindefense:[   0,12    ],
  terraindefensemodifier:[  10,300   ]
};

/**
 * @private
 TODO move into the modules
 */
controller.configBoundaries_ = {
  daysOfPeace:{             min:0, max:50,    defaultValue:0 },      
  fogEnabled:{              min:0, max:1,     defaultValue:1 },     
  dayLimit:{                min:0, max:999,   defaultValue:0 },  
  noUnitsLeftLoose:{        min:0, max:1,     defaultValue:0 },      
  supplyAlliedUnits:{       min:0, max:1,     defaultValue:0 },
  captureLimit:{            min:0, max:CWT_MAX_PROPERTIES, defaultValue:0 },   
  unitLimit:{               min:0, max:CWT_MAX_UNITS_PER_PLAYER, defaultValue:0 },  
  weatherMinDays:{          min:1, max:5,     defaultValue:1 },  
  weatherRandomDays:{       min:0, max:5,     defaultValue:4 },  
  
  // TODO maybe as property action command        
  repairAlliedUnits:{       min:0, max:1,     defaultValue:0 }, 
  
  autoSupplyAtTurnStart:{   min:0, max:1,             defaultValue:1 },      
  coStarCost:{              min:5, max:50000, step:5, defaultValue:9000 },      
  coStarCostIncrease:{      min:0, max:50000, step:5, defaultValue:1800 },
  coStarCostIncreaseSteps:{ min:0, max:50,            defaultValue:10 },
  turnTimeLimit:{           min:0, max:60,            defaultValue:0 },
  gameTimeLimit:{           min:0, max:99999,         defaultValue:0 }
};

/**
 * 
 * @param {object} cfg
 */
controller.buildRoundConfig = function( cfg ){
  var boundaries = controller.configBoundaries_;
  
  var keys = Object.keys(boundaries);
  for( var i=0,e=keys.length; i<e; i++ ){
    var key = keys[i];
    
    var value;
    if( cfg.hasOwnProperty(key) ){
      value = cfg[key];
      
      // CHECK MIN MAX
      if( value < boundaries[key].min ) util.raiseError(key,"is greater than it's minimum value");
      if( value > boundaries[key].max ) util.raiseError(key,"is greater than it's maximum value");
      
      // CHECK STEP
      if( boundaries[key].hasOwnProperty("step") ){
        if( value % boundaries[key].step !== 0 ) util.raiseError(key,"is does not fits one of it's possible values");
      }
    }
    else value = boundaries[key].defaultValue;
    
    model.configRule[key] = value;
  }
};

/**
 * Returns the value of a game round configuration property.
 * 
 * @param {String} attr name of the attribute
 * @returns {Number}
 */
controller.configValue = function( attr ){
  return model.configRule[attr];
};

util.scoped(function(){
  
  function solve( ruleList, memory, attrName, value ){
    for( var i=0,e=ruleList.length; i<e; i++ ){    
      var rule = ruleList[i];
      var attrVal = rule[attrName];
      if( typeof attrVal === "number" ){
        var noMatch;
        var list;
        
        // HAS "AND" CONDITION
        list = rule.$all;
        if( typeof list !== "undefined" ){
          noMatch = false;
          
          // CHECK ALL
          for( var i2=0,e2=list.length; i2<e2; i2++ ){
            if( memory[list[i2]] !== true ){
              noMatch=true;
              break;
            }
          }
          
          if( noMatch ) continue;
        }
        
        
        // HAS "OR" CONDITION
        list = rule.$any;
        if( typeof list !== "undefined" ){
          noMatch = true;
          
          // CHECK ALL
          for( var i2=0,e2=list.length; i2<e2; i2++ ){
            if( memory[list[i2]] === true ){
              noMatch=false;
              break;
            }
          }
          
          if( noMatch ) continue;          
        }
        
        // ADD ATTRIBUTE VALUE
        value += attrVal;
      }
    }
    
    // CHECK BOUNDS
    bounds = controller.scriptBoundaries_[attrName];
    if( bounds !== undefined ){
      if( value < bounds[0] ) value = bounds[0];
      else if( value > bounds[1] ) value = bounds[1];
    }
    else util.raiseError("no boundaries given for "+attrName);
    
    // RETURN RESULT
    return value;
  };
  
  /**
   * Returns the value of a game attribute.
   * 
   * @param {object} tags set of tags of the invoking object
   * @param {Number} pid id number of the invoking player
   * @param {String} attr name of the attribute
   * @returns {Number}
   */
  controller.scriptedValue = function( pid, attr, value ){
    if( typeof value !== "number" ) util.raiseError("numberic value as parameter value expected");
    var tags = controller.scriptTags;
    
    // GLOBAL RULES
    value = solve( model.globalRules, tags, attr, value );
    
    // MAP RULES
    value = solve( model.mapRules, tags, attr, value );
    
    // PLAYER CO RULES
    var co = model.players[pid].mainCo;
    var weather = true;
    if( co ){
      value = solve( co.d2d, tags, attr, value );
      
      // IS NEUTRALIZED WEATHER GIVEN?
      weather = ( solve( co.d2d, tags, "neutralizeWeather", 0 ) === 0 );
    }
    
    // WEATHER
    var wth = model.weather;
    if( weather && wth ) value = solve( wth.rules, tags, attr, value );
    
    // CHECK BOUNDARIES
    var bounds = controller.scriptBoundaries_[attr];
         if( value < bounds[0] ) value = bounds[0];
    else if( value > bounds[1] ) value = bounds[1];
      
      // RETURN CALCULATED RESULT
      return value;
  };
});
/**
 * The central finite state machine of the game engine.
 */
controller.stateMachine = simpleStateMachine();

controller.stateMachine.name = "ENGINE";

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
    refObj = isValid ? model.unitPosMap[x][y] : null;
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
    refObj = isValid ? model.propertyPosMap[x][y] : null;
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

/**
 * Action process data memory object. It is used as data holder to transport
 * data between the single states of the state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine.data = {};
controller.scriptTags = {};

/**
 *
 */
controller.prepareTags = function( x,y, uid, fx,fy, fuid ){
  var tags = controller.scriptTags;
  
  if( tags.__oldUnit__ ) tags[ tags.__oldUnit__ ] = false;
  if( tags.__oldTile__ ) tags[ tags.__oldTile__ ] = false;
  
  tags.INDIRECT = false;
  tags.DIRECT = false;
  
  var unit = (uid > -1)? model.units[uid] : model.unitPosMap[x][y];
  if( unit ){
    tags.__oldUnit__ = unit.type.ID;
    tags[ tags.__oldUnit__ ] = true;
    
    if( model.isIndirectUnit( (uid > -1)? uid : model.extractUnitId(unit) ) ) tags.INDIRECT = true;
    else tags.DIRECT = true;
    
  }
  
  var tileTp = model.map[x][y].ID;
  var prop = model.propertyPosMap[x][y];
  if( prop ){
    tileTp = prop.type.ID;
  }
  
  tags.__oldTile__ = tileTp;
  tags[ tags.__oldTile__ ] = true;
  
  // FOCUS TILE GIVEN
  if( arguments.length > 3 ){
    
    tags.OTHER_INDIRECT = false;
    tags.OTHER_DIRECT = false;
    
    unit = (fuid > -1)? model.units[fuid] : model.unitPosMap[fx][fy];
    if( unit ){
      if( model.isIndirectUnit( (fuid > -1)? fuid : model.extractUnitId(unit) ) ) tags.OTHER_INDIRECT = true;
      else tags.OTHER_DIRECT = true;
    }
  }
};
controller.inGameRound = false;

(function(){
  
  var actionBuf = controller.actionBuffer_;
  
  var evaledChars_ = 0;
  
  /**
   * @param {Number} delta time since last update step
   */
  controller.updateState = function( delta ){
    if( !controller.inGameRound ) util.raiseError("no game round is active");
    
    // UPDATE INTERNAL TIMER
    model.updateTimer( delta );
    
    // ENDED BY TIMER ?
    if( !controller.inGameRound ) return;
    
    if( actionBuf.isEmpty()) return;

    // GET NEXT ACTION
    var data = actionBuf.pop();

    // GET REAL FUNCTION NAME
    var actionId = controller.actionMap[data[data.length - 1]];
    if( actionId === undefined ) util.raiseError("unknown or illegal model action");
    
    if (DEBUG) {
      var command = JSON.stringify(data);
      evaledChars_ += command.length;

      // REMEMBER CHAR USAGE ;)
      util.log(
        "evaluate action", command, "which is command",actionId,
        "all evaluated characters so far are", evaledChars_ 
      );
    }

    // INVOKE ACTION
    model[ actionId ].apply(model, data);
  };
    
  controller.startGameRound = function( map ){
    if( DEBUG ) util.log("start game round");
    controller.inGameRound = true;
    
    evaledChars_ = 0;
    actionBuf.clear();
    
    model.setupTimer();
    model.loadCompactModel(map);
    model.calculateNextWeather();
    model.recalculateFogMap(0);
  };
  
  controller.endGameRound = function(){
    if( DEBUG ) util.log("end game round");
    controller.inGameRound = false;
  };
  
})();
controller.stateMachine.data.action = {
  
  /**
   * Selected sub action object.
   */
  selectedEntry: null,
  
  /**
   * Selected sub action object.
   */
  selectedSubEntry: null,
  
  /**
   * Action object that represents the selected action.
   */
  object: null
};
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
      
      for (var i = 0, e = commandKeys.length; i < e; i++) {
        var action = controller.actionObjects[commandKeys[i]];
        
        // IS USER CALLABLE ACTION ?
        if (!action.condition) continue;
        
        // PRE DEFINED CHECKERS
        if (action.unitAction === true && !unitActable) continue;
        if (action.propertyAction === true && !propertyActable) continue;
        
        // CHECK CONDITION
        if (action.condition(data)) {
          this.addEntry(commandKeys[i]);
        }
      }
    }
  })
};
controller.stateMachine.data.movePath = {
  
  ILLEGAL_MOVE_FIELD: -1,
  
  data:[],
  
  /**
   * Cleans the move path from move codes.
   */
  clean: function() {
    this.data.splice(0);
  },
  
  /**
     * Clones the path and returns the created array.
     */
  clone: function() {
    var path = [];
    for (var i = 0, e = this.data.length; i < e; i++) {
      path[i] = this.data[i];
    }
    return path;
  },
          
                  
  /**
   * Appends a tile to the move path of a given action data memory object.
   *
   * @param tx target x coordinate
   * @param ty target y coordinate
   * @param code move code to the next tile
   */
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
          
  /**
   * Regenerates a path from the source position of an action data memory object
   * to a given target position.
   * 
   * @param tx target x coordinate
   * @param ty target y coordinate
   */
  setPathByRecalculation: function( tx,ty ){
    var source = controller.stateMachine.data.source;
    var selection = controller.stateMachine.data.selection;
    var movePath = controller.stateMachine.data.movePath.data;
    var stx = source.x;
    var sty = source.y;

    if ( DEBUG ){
      util.log( "searching path from (", stx, ",", sty, ") to (", tx, ",", ty, ")" );
    }

    var graph = new Graph( selection.data );

    var dsx = stx - selection.centerX;
    var dsy = sty - selection.centerY;
    var start = graph.nodes[ dsx ][ dsy ];

    var dtx = tx - selection.centerX;
    var dty = ty - selection.centerY;
    var end = graph.nodes[ dtx ][ dty ];

    var path = astar.search(graph.nodes, start, end);

    if ( DEBUG ){
      util.log("calculated way is", path);
    }

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
          
  /**
   * Injects movable tiles into a action data memory object.
   * 
   * @param data action data memory
   */
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

        var cost = model.moveCosts( mType, model.map[ tx ][ ty ] );
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
          
          var cost = model.moveCosts( mType, model.map[x][y] );
          selection.setValueAt( x, y, cost );
        }
      }
    }
  }
};
controller.stateMachine.data.inMultiStep = false;
/** @type controller.Position */
controller.stateMachine.data.source = Object.create(controller.TaggedPosition);
  
/** @type controller.Position */
controller.stateMachine.data.target = Object.create(controller.TaggedPosition);
  
/** @type controller.Position */
controller.stateMachine.data.targetselection = Object.create(controller.TaggedPosition);

/**
 * 
 * @param {controller.TaggedPosition} posA
 * @param {controller.TaggedPosition} posB
 * @param expMode
 * @returns {Boolean}
 */
controller.stateMachine.data.thereIsUnitRelationShip = function( posA, posB ){
  if( posA.unit && posA.unit === posB.unit ) return model.MODE_SAME_OBJECT;
  
  return model.relationShipCheck( 
    ( posA.unit !== null )? posA.unit.owner : null, 
    ( posB.unit !== null )? posB.unit.owner : null
  );
};

/**
 * 
 * @param {controller.TaggedPosition} posA
 * @param {controller.TaggedPosition} posB
 * @param expMode
 * @returns {Boolean}
 */
controller.stateMachine.data.thereIsUnitToPropertyRelationShip = function( posA, posB ){
  return model.relationShipCheck( 
    ( posA.unit     !== null )? posA.unit.owner : null, 
    ( posB.property !== null )? posB.property.owner : null
  );
};

/** @namespace */
controller.stateMachine.data.selection = {
  
  /**
   * X coordinate of the selection data.
   */
  centerX: 0,
  
  /**
   * Y coordinate of the selection data.
   */
  centerY: 0,
  
  /**
   * Data matrix of the selection data.
   */
  data: util.matrix( 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    0 
  ),
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} defValue value that will be set into every cell of the matrix
   */
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
  
  /**
   * Returns the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
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
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} value value that will be set
   */
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
  
  /**
   * Prepares the selection for a the saved action key and returns the correct selection state key.
   */
  prepare: function() {
    var target = controller.stateMachine.data.target;
    var x = target.x;
    var y = target.y;
    
    this.setCenter(x, y, -1);
    
    var actObj = controller.stateMachine.data.action.object;
    actObj.prepareTargets(controller.stateMachine.data);
    
    return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
  },

  /**
   *
   */
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
};
/**
 * Action menu state that generates a list of possible action for a 
 * selected target tile.
 */
controller.stateMachine.structure.ACTION_MENU = {
  
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
};
/**
 * Action sub menu state that generates a list of possible sub actions for 
 * an action to modify the selected action like select an unit that should
 * be unloaded.
 */
controller.stateMachine.structure.ACTION_SUBMENU = {
  
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
};
/**
 * Action state that converts the collected action data from client
 * to sharable transactions and pushes them into the action stack.
 */
controller.stateMachine.structure.FLUSH_ACTION = {
  
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
  
};
/**
 * The base state of a game round. An action process starts here, the 
 * action data of the state machine is always empty in this state.
 */
controller.stateMachine.structure.IDLE = {
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
};
controller.stateMachine.structure.MOVEPATH_SELECTION = {
  
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
  
};
/**
 * 
 */
controller.stateMachine.structure.MULTISTEP_IDLE = {
  
  nextStep: function(){
    var actObj = this.data.action.object;

    this.data.movePath.clean();
    this.data.menu.clean();

    actObj.prepareMenu( this.data );
    this.data.menu.addEntry("done");

    this.data.inMultiStep = true;
    return ( this.data.menu.size > 1 )? "ACTION_SUBMENU": "IDLE";

  }
};
/**
 * The start state of the cwt state machine.
 */
controller.stateMachine.structure.NONE = {
  
  start: function( ev, mod ){

    // LOAD MODIFICATION
    model.loadModification( mod );
    
    return "IDLE";
  }
  
};
/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked before(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_A = {
  
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
  
};
/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked after(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_B = controller.stateMachine.structure.ACTION_SELECT_TARGET_A;
/**
 * The client selects a target tile in this step. Unlike {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_A}
 * and {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_B} this state allows a free selection
 * over the map. Normally this state will be invoked by actions with the isTargetValid attribute. 
 */
controller.stateMachine.structure.ACTION_SELECT_TILE = {
  
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
  
};
controller.mapAction({
  
  key:"activatePower",
  hasSubMenu: true,
  
  condition: function(){
    var player = model.players[ model.turnOwner ];
    
    if( player.mainCo === null ) return false;
    if( player.coPower_active !== model.INACTIVE_POWER ) return false;
    
    return ( player.power >= model.coStarCost(model.turnOwner)*player.mainCo.coStars );
  },
            
  prepareMenu: function( data ){
    data.action.addEntry("cop", (player.power >= model.coStarCost(model.turnOwner)*player.mainCo.coStars) );
    data.action.addEntry("scop", (player.power >= model.coStarCost(model.turnOwner)*player.mainCo.scoStars) );
  },
          
  invoke: function( data ){    
    switch ( data.action.selectedSubEntry ){
      
      case "cop" : 
        model.activateCoPower.callAsCommand(model.turnOwner);
        break;
        
      case "scop" : 
        model.activateSuperCoPower.callAsCommand(model.turnOwner);
        break;
    }
  }
  
});
controller.unitAction({
  
  key:"attack",
  
  unitAction: true,
  targetSelectionType:"A",
  
  prepareTargets: function( data ){
    model.attackRangeMod_( data.source.unitId, data.target.x, data.target.y, data.selection );
  },
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT && mode !== model.MODE_OWN ) return false;
    
    // CANNOT ATTACK IF PEACE PERIOD IS GIVEN
    if( model.day-1 < controller.configValue("daysOfPeace") ) return false;
    
    // CANNOT ATTACK IF INDIRECT UNIT WILL MOVE
    if( model.isIndirectUnit(data.source.unitId) && data.movePath.data.length > 0 ) return false;
    
    return model.hasTargets( data.source.unitId, data.target.x, data.target.y );
  },
          
  invoke: function( data ){
    model.battleBetween.callAsCommand( 
      data.source.unitId, 
      data.targetselection.unitId, 
      Math.round( Math.random()*100 ), 
      Math.round( Math.random()*100 ) 
    );
  }
});



controller.propertyAction({
  
  key:"buildUnit",  
  propertyAction: true,
  hasSubMenu: true,
  
  condition: function( data ){
    var uLimit = controller.configValue("unitLimit");
    if( uLimit && model.countUnits(model.turnOwner) >= uLimit ) return false;
        
    if( !model.hasFreeUnitSlots( model.turnOwner ) ) return false;
    
    var property = data.source.property;
    
    var unitTypes = model.listOfUnitTypes;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      if( model.isBuildableByFactory( property, unitTypes[i] ) ) return true;
    }
    
    return false;
  },
  
  prepareMenu: function( data ){
    var availGold = model.players[ model.turnOwner ].gold;
    var property = data.source.property;
    var unitTypes = model.listOfUnitTypes;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      var key = unitTypes[i];
      
      // ONLY ADD IF THE TYPE IS PRODUCE ABLE BY THE PROPERTY
      if( model.isBuildableByFactory( property, key ) ){
        data.menu.addEntry( key, availGold >= model.unitTypes[key].cost );
      }
    }
  },
  
  invoke: function( data ){
    model.buildUnit.callAsCommand( data.source.x, data.source.y, data.action.selectedSubEntry );
  }
  
});
controller.unitAction({
  
  key:"capture",
  
  condition: function( data ){
    if( data.target.property === null ) return null;
    
    var modeProp = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
    if( modeProp !== model.MODE_ENEMY && modeProp !== model.MODE_NONE ) return false;
    
    return data.target.property.type.points > 0 && data.source.unit.type.captures > 0;
  },
  
  invoke: function( data ){
    model.captureProperty.callAsCommand( data.source.unitId, data.target.propertyId );
  }
  
});
util.scoped(function(){
  
  var steps = [500,1000,2500,5000,10000,25000,50000];
  
  controller.mapAction({
    
    key:"transferMoney",
    hasSubMenu: true,
    
    condition: function( data ){
      var plid = model.turnOwner;
      var ref;
      
      if( model.players[ plid ].gold < steps[0] ) return false;
      
      // CHECK UNIT
      ref = data.target.unit;
      if( ref === null || ref.owner === plid ){
        
        // CHECK PROPERTY
        ref = data.target.property;
        if( ref !== null && ref.owner !== plid ) return true;
        
        return false;
      }
      
      return true;
    },
    
    prepareMenu: function( data ){
      var availGold = model.players[ model.turnOwner ].gold;
      
      for( var i=0,e=steps.length; i<e; i++ ){
        if( availGold >= steps[i] ) data.menu.addEntry( steps[i] );
      }
    },
    
    invoke: function( data ){
      var owner = (data.target.property !== null)? data.target.property.owner : data.target.unit.owner;
      model.transferMoney.callAsCommand( model.turnOwner, owner, data.action.selectedSubEntry );
    }
    
  });
  
});
controller.propertyAction({
  
  key:"transferProperty",
  propertyAction:true,
  hasSubMenu: true,
  
  condition: function( data ){
    if( data.source.property.type.noTransfer ) return false;
    return true;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ) data.menu.addEntry(i,true);
    }
  },
  
  invoke: function( data ){
    model.transferProperty.callAsCommand( data.source.propertyId, data.action.selectedSubEntry );
  }
});
controller.unitAction({
  
  key:"transferUnit",
  hasSubMenu: true,
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    // LOADED UNITS CANNOT BE TRANSFERED TO OTHER PLAYERS (@TODO: ALLOW IN FUTURE)
    if( model.hasLoadedIds( data.source.unitId ) ) return false; 
    
    return true;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ) data.menu.addEntry(i, true );
    }
  },
  
  invoke: function( data ){
    model.transferUnit.callAsCommand( data.source.unitId, data.action.selectedSubEntry );
  }
  
});
controller.unitAction({
  
  key:"hideUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    var unit = data.source.unit;
    if( !unit.type.stealth) return false;
    if( unit.hidden ) return false;
    
    return true;
  },
          
  invoke: function( data ){
    model.hideUnit.callAsCommand( data.source.unitId ); 
  }
  
});
controller.unitAction({
  
  key:"joinUnits",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_OWN ) return false;
        
    // NO LOAD MERGE
    if( model.hasLoadedIds( data.source.unitId ) || model.hasLoadedIds( data.target.unitId ) ) return false;
    
    return ( data.source.unit.type === data.target.unit.type && data.target.unit.hp < 90 ); 
  },
  
  invoke: function( data ){
    model.joinUnits.callAsCommand( data.source.unitId, data.target.unitId );
  }
  
});
controller.unitAction({
  
  key:"loadUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_OWN ) return false;
    
    var tuid = data.target.unitId;
    return model.isTransport( tuid ) && model.canLoad( data.source.unitId, tuid );
  },
  
  invoke: function( data ){
    model.loadUnitInto.callAsCommand( data.source.unitId, data.target.unitId );
  }
 
});
controller.mapAction({
  
  key:"nextTurn",
  
  condition: function( data ){
    var unit = data.source.unit;
    if( unit !== null && unit.owner === model.turnOwner && model.canAct( data.source.unitId) ) return false;
       
    var property = data.source.property;
    if( property !== null && property.type.builds ) return false;
    
    return true;
  },
  
  invoke: function(){
    model.nextTurn.callAsCommand();
  }
  
});
controller.unitAction({
  
  key:"silofire",
  
  isTargetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },
  
  selectionRange: 2,
  
  condition: function( data ){
    var unitRel = data.thereIsUnitRelationShip( data.source, data.target );
    if( unitRel !== model.MODE_SAME_OBJECT && unitRel !== model.MODE_NONE ) return false;
    
    if( !data.target.property ) return false;
    
    var propRel = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
    if( propRel !== model.MODE_NONE ) return false;
    
    var silo = data.target.property.type.rocketsilo;
    if( typeof silo === "undefined" ) return false;
    if( silo.indexOf(data.source.unit.type.ID) === -1 ) return false;
    
    return true;
  },
  
  invoke: function( data ){
    model.fireSilo.callAsCommand(
      data.target.propertyId, 
      data.targetselection.x, 
      data.targetselection.y,
      2,
      data.source.unit.owner
    );
  }
});
controller.unitAction({
  
  key:"supplyUnit",
  
  condition: function( data ){
    if( !data.source.unit.type.supply ) return false;
    
    var pid = data.source.unit.owner;
    var x = data.target.x;
    var y = data.target.y;
    
    // TODO CHECK CAN_SUPPORT IN FUTURE
    return model.relationShipCheckUnitNeighbours( pid, x, y, model.MODE_OWN );
  },
  
  invoke: function( data ){
    model.unitSuppliesNeighbours.callAsCommand( data.source.unitId );    
  }
  
});

controller.unitAction({
  
  key:"unhideUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    return data.source.unit.hidden;
  },
  
  invoke: function( data ){
    model.unhideUnit.callAsCommand( data.source.unitId ); 
  }
  
});

util.scoped(function(){
  
  function checkTile( x,y, movetype ){
    if( model.isValidPosition(x,y) ){
      
      // CAN MOVE TECHNICALLY ?
      if( model.moveCosts( movetype, model.map[x][y] ) === -1 ) return false;
      
      // IF TILE IS IN FOG THEN OCCUPYING UNITS AREN'T IMPORTANT
      if( model.fogData[x][y] === 0 ) return true;
      
      if( model.unitPosMap[x][y] !== null ) return false;
      return true;
    }
  }
  
  controller.unitAction({
    
    key:"unloadUnit",
    multiStepAction: true,
    
    condition: function( data ){
      var mode = data.thereIsUnitRelationShip( data.source, data.target );
      if( mode !== model.MODE_SAME_OBJECT && mode !== model.MODE_NONE ) return false;
      
      var uid = data.source.unitId;
      return model.isTransport( uid ) && model.hasLoadedIds( uid );
    },
    
    prepareMenu: function( data ){
      for( var i=CWT_MAX_UNITS_PER_PLAYER*model.turnOwner, e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
        var unit = model.units[i];
        if( unit.owner !== CWT_INACTIVE_ID && unit.loadedIn === data.source.unitId ){
          data.menu.addEntry( i, true );
        }
      }
    },
    
    targetSelectionType: "B",
    prepareTargets: function( data ){
      var x = data.target.x;
      var y = data.target.y;
      var movetp = model.moveTypes[model.units[ data.action.selectedSubEntry ].type.movetype];
      
      if( checkTile(x-1,y,movetp) ) data.selection.setValueAt( x-1,y, 1 );
      if( checkTile(x+1,y,movetp) ) data.selection.setValueAt( x+1,y, 1 );
      if( checkTile(x,y-1,movetp) ) data.selection.setValueAt( x,y-1, 1 );
      if( checkTile(x,y+1,movetp) ) data.selection.setValueAt( x,y+1, 1 );
    },
    
    invoke: function( data ){
      var tx = data.target.x;
      var ty = data.target.y;
      
      model.unloadUnitFrom.callAsCommand( 
        data.source.unitId, 
        data.target.x, 
        data.target.y, 
        data.action.selectedSubEntry, 
        data.targetselection.x, 
        data.targetselection.y 
      )
    }
  });
});
controller.unitAction({
  
  key:"wait",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    return true;
  },
  
  invoke: function( data ){
    model.markUnitNonActable.callAsCommand(data.source.unitId);
  }
  
});
