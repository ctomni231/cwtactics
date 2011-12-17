/**
 * Battle controller module, that mostly contains service functions to controll
 * battle actions between unit objects.
 * 
 * @author BlackCat
 * @since 16.12.2011
 */
define(["sys/service","cwt/database","cwt/map","sys/event"], 
		function(service,db,map,event){
	
  return{
		  
	  /**
	   * Weapon functions.
	   */  
	  weapon:{
		
      /**
       * Returns a valid weapon against an unit instance or type.
       * 
       * @param unit {Unit|UnitSheet}
       * @param distance (default=1)
       */
      validWeaponAgainst: function( unit, enemy, distance )
      {

        if( !distance )
        {
          // if both arguments are units, then returns its distance, 
          // if no distance is given
          if( unit.type && enemy.type ) 
            distance = map.unitDistance( unit, enemy );
          else distance = 1;
        }

        // if unit is an unit, set unit to its unitType sheet
        if( unit.type ) unit = unit.type;
        if( enemy.type ) enemy = enemy.type;

        var weapons = enemy.weapons;
        for( weapon in weapons )
        {
          // weapon is in range
          if( distance >= weapon.minRange && distance <= weapon.maxRange )
            return weapon;
        }

        return null;
      },

      /**
       * Returns the damage against an unit instance or type.
       * 
       * The damage map of the weapon will look up in following order:
       * 1. damage against unit ID
       * 2. damage against one of the tags 
       * 	  (from left to right, first match will chosen)
       * 3. damage against all types (*)
       * 
       * @param weapon
       * @param unit
       */
      damageAgainst: function( weapon, unit )
      {
        var _tmp;
        // if unit is an unit, set unit to its unitType sheet
        if( unit.type ) unit = unit.type;

        // check ID
        _tmp = weapon.damages[ unit.ID ];
        if( _tmp ) return _tmp;

        // check tags
        for( tag in unit.tags )
        {
          _tmp = weapon.damages[ tag ];
          if( _tmp ) return _tmp;
        }

        // check *
        _tmp = weapon.damages["*"];
        if( _tmp ) return _tmp;

        // no match, zero damage
        return 0;
      } 
	  },
	  
	  /**
	   * Generates a range card for an unit object.
	   * 
	   * @param unit
	   */
	  generateRangeCard: function( unit )
	  {
		  
		  var _moveCard = service.lookup("move.createMoveCard")( unit );
		  var _rangeCard = {
		    tiles: []
		  };
		  
		  //TODO new way -> only test/check the outside tiles of a move card
		  //   a tile is outside if it hasn't four tiles as neighbors in the card 
	  },
	  
	  /**
	   * Generates a battle card object.
	   * 
	   * @param attacker
	   * @param weapon used weapon by the attacker
	   * @param defender
	   * @returns
	   */
	  generateBattleCard: function( attacker, weapon, defender )
	  {
		  //TODO
		  var _dis = map.unitDistance(attacker,defender);
		  var _weaponDef = 
        this.weapon.validWeaponAgainst( defender, attacker, _dis);
		  
		  var battleCard = {
				  
        attacker: attacker,
        defender: defender,

        attackerWp: weapon,
        defenderWp: _weaponDef,

        distance: _dis,

        attackDmg: 		  this.weapon.damageAgainst( weapon, defender ),
        counterAttackDmg: this.weapon.damageAgainst( _weaponDef, defender )
		  };
		  
		  // fire events
		  event.invoke("battle.generateBattleCard",battleCard);
		  
		  return battleCard;
	  },
	  
	  /**
	   * Invokes a battle from a persisted battle card.
	   * 
	   * @param battleCard
	   */
	  startBattle: function( battleCard )
    {
      var _att = battleCard.attacker;
      var _def = battleCard.defender;
		  
		  _def.hp -= battleCard.attackDmg;
		  if( _def.hp < 0 )
			  _def.hp = 0;
		  
		  _att.ammo--;
		  
      if( _def.hp == 0 )
      {
        // free unit
        _def.__reset__();
      }
      else
      {
        // only fire if defender weapon exists
        if( _defWp !== null )
        {
          _att.hp -= battleCard.counterAttackDmg;
          if( _att.hp < 0 )
            _att.hp = 0;

          _def.ammo--;
        } 
      }
	  }  
	  
  };
});