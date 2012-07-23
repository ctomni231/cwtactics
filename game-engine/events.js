cwt.events = {

  _events: {},

  /**
   * Calls a specific listener in a event.
   * Used by the message pipe system.
   */
  _evalEventCommand: function( msg ){

    // call listener by the event name and its index
    this._events[ msg.e ][ msg.i ].apply( null, msg.a );

    // increase message index
    msg.i++;

    // if index is still valid, then tell the message pipe to save the command for the
    // next iteration
    if( msg.i < this._events[ msg.e ].length ){ return false; }
  },

  eventMessage: function( eName ){
    var args;

    // extract arguments
    if( arguments.length === 1 ){ args = [];                                          }
    else                        { args = Array.prototype.slice.call( arguments, 1 );  }

    var obj = {
      modK: "events",
      servK: "_evalEventCommand",
      e: eName,
      i: 0,
      a: args
    };

    return obj;
  },

  bind: function( eName, listener ){
    if( !this._events.hasOwnProperty(eName) ) this._events[ eName ] = [];
    this._events[eName].push( listener );
  },

  unbind: function( eName, listener ){
    if( this._events.hasOwnProperty(eName) ){

      var i = this._events[eName].indexOf( listener );
      if( i !== -1 ){
        this._events[eName].splice(i,1);
        return true;
      }
      else return false;
    }
  }
};

// general enemy loose strenght and tapsis units gain power in battles ( cost one movepoint )
var TAPSI_D2D    = "arg.attDmg -= 10; arg.defDmg += 10";
var TAPSI_D2D_2  = "arg.movepoints -= 1";

// hard defense --> never moving a step back ( cost additional one movepoint )
var TAPSI_COP    = "arg.attDmg -= 20; arg.defDmg += 10";
var TAPSI_COP_2  = "arg.movepoints -= 1";

// counter offense --> we tack back what we own ( negates movepoint costs from co ability and gives one extra )
var TAPSI_SCOP   = "arg.attDmg -= 30; arg.defDmg += 20";
var TAPSI_SCOP_2 = "arg.attDmg += 20"; // tapsi attacks
var TAPSI_SCOP_3 = "arg.movepoints += 2";

var TAPSI_SCOP_ALT = {
  duration: 2,
  effects:[
    { when:       "attack",
      condition:  "arg.def.owner === scriptOwner",
      then:       "arg.attDmg -= 30; arg.defDmg += 20" },
    { when:       "attack",
      condition:  "arg.att.owner === scriptOwner",
      then:       "arg.attDmg += 20" },
    { when:       "movecard",
      condition:  "arg.mover.owner === scriptOwner",
      then:       "arg.movepoints += 2" }
]};

var JAVIER_D2D   = "db.unit( arg.att.type ).indexOf('INDIRECT') != -1 : arg.defDmg += 20";
var JAVIER_D2D_2 = "num = count( properties( owner==pid , id=='COMTOWER') ) : arg.attDmg -= num*10";

// doubles effects
var JAVIER_COP   = "db.unit( arg.att.type ).indexOf('INDIRECT') != -1 : arg.defDmg += 20";
var JAVIER_COP_2 = "num = count( properties( owner==pid , id=='COMTOWER') ) : arg.attDmg -= num*10";

// tripples effects
var JAVIER_SCOP   = "db.unit( arg.att.type ).indexOf('INDIRECT') != -1 : arg.defDmg += 40";
var JAVIER_SCOP_2 = "num = count( properties( owner==pid , id=='COMTOWER') ) : arg.attDmg -= num*20";



var SASHA_D2D  = "#ownProperties -> arg.player.gold += cwt.db.tile(type).funds * 0.1";
var SASHA_COP  = "#enemyPlayer -> power -= 0.1*( parseInt( gold/5000, 10 ) )";
var SASHA_SCOP = "player( arg.att.owner ).gold += db.unit( arg.att.type ).cost * ( arg.attDmg/100 )";

// SYNTAX:  [SELECTOR ->] [CONDITION'S :] ACTION'S