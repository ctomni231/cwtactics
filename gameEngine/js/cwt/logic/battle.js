/**
 * Battle Controller.
 * 
 * @author BlackCat
 * @since 16.12.2011
 */
define(["sys/service","cwt/database","cwt/map","sys/event"], 
		function(service,db,map,event){
	
  var API = {
		  
	  /**
	   * Weapon functions.
	   */  
	  weapon:{
		
		/**
		 * Returns a valid weapon against an unit instance or type.
		 * 
		 * @param unit {Unit|UnitSheet}
		 */
		validWeaponAgainst: function( unit )
		{
			// if unit is an unit, set unit to its unitType sheet
			if( unit.type ) unit = unit.type;
			
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
		  //				>> a tile is outside if it hasn't four tiles as neighbors in the card <<
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
		  
		  var _weaponDef = this.weapon.damageAgainst( defender, attacker );
		  
		  battleCard = {
				  
			attacker: attacker,
			defender: defender,
			
			attackerWp: weapon,
			defenderWp: _weaponDef,
			
			distance: map.distance(attacker,defender),
			
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
		  //TODO
		  
		  battleCard.defender.hp -= battleCard.attackDmg;
		  if( battleCard.defender.hp < 0 )
			  battleCard.defender.hp = 0;
		  
		  battleCard.attacker.ammo--;
		  
		  if( battleCard.defenderWp )
		  {
			  battleCard.attacker.hp -= battleCard.counterAttackDmg;
			  if( battleCard.attacker.hp < 0 )
				  battleCard.attacker.hp = 0;
			  
			  battleCard.defender.ammo--;
		  }
	  }  
	  
  };
  
  return API;
});