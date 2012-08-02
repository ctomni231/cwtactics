cwt.selectors = {

  compile: function( content ){
    "use strict";
    var fn;

    //TODO check for set variable and function calls

    eval('fn = function( obj, pid, pt ){ return '+content+'; }');
    return fn;
  },

  createGroup: function(){
    var list = [];
    var sel;
    var e = e=arguments.length;

    // creates selector list
    for(var i=0; i<e; i++){
      sel = cwt.selectors[ arguments[i] ];
      if( sel === undefined ){
        throw Error("unknown selector "+arguments[i] );
      }

      list.push( sel );
    }

    // return selector group function
    return function( ownable, pid, pt ){
      for(var i=0,e=list.length; i<e; i++){
        if( !selector( ownable, pid, pt ) ) return false;
      }

      return true;
    }
  },

  /**
   * Registers a custom selector function and appends it to the selector object.
   */
  registerSelector: function( key, sFn ){
    if( this.hasOwnProperty( key ) ) throw Error(key+" is already registered as selector");

    this[key] = sFn;
  },

  init: function(){

    // create some grouped selectors
    this.ownWithLowHP = this.createGroup( "own", "lowHealth" );
    this.enemyWithLowHP = this.createGroup( "enemy", "lowHealth" );
  },

  queries:{
  },

  // ************************* Default Selectors ***********************
  // *******************************************************************

  lowHealth: function( ownable ){
    if( !ownable.hasOwnProperty("hp") ){
      throw Error("selector only works on object with a living ability"); }

    return (ownable.hp <= 10);
  },

  /**
   * Selector that selects only own objects.
   *
   * Works with properties and units
   */
  own: function( ownable, pid ){
    return ownable.owner === pid;
  },

  /**
   * Selector that selects only enenemy objects.
   *
   * Works with properties and units
   */
  enemy: function( ownable, pid, pt ){
    return ownable.owner !== pid && map.player(ownable.owner).team !== pt;
  },

  /**
   * Selector that selects only allied objects.
   *
   * Works with properties and units
   */
  allied: function( ownable, pid, pt ){
    return ownable.owner !== pid && map.player(ownable.owner).team !== pt;
  },

  /**
   * Selector that selects only own and allied objects.
   *
   * Works with properties and units
   */
  team: function( ownable, pid, pt ){
    return ownable.owner === pid || map.player(ownable.owner).team === pt;
  }
};