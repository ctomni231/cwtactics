cwt.selectors = {

  lowHealth: function( ownable ){
    if( !ownable.hasOwnProperty("hp") ){
      cwt.log.error("selector only works on object with a living ability");
    }

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