cwt.defineLayer( CWT_LAYER_DATA_ACCESS, function( data, model ){

  /** @constant */
  data.PRIMARY_WEAPON_TAG = "mainWeapon";

  /** @constant */
  data.SECONDARY_WEAPON_TAG = "subWeapon";

  /**
   * Checks if an unit has targets for a given weapon tag.
   *
   * @param unit attacking unit object
   * @param wpTag mainWeapon|subWeapon
   * @param x x coordinate (optional)
   * @param y y coordinate (optional)
   * @return true|false
   */
  data.hasTargets = function( unit, wpTag, x, y, moved ){
    if( arguments.length === 2 ){
      x = unit.x;
      y = unit.y;
    }

    var spid = unit.owner;
    var steam = data.player( unit.owner ).team;

    var usheet = data.unitSheet( unit.type );
    var wp = data.weaponSheet(
      ( wpTag === data.PRIMARY_WEAPON_TAG )?
           usheet[data.PRIMARY_WEAPON_TAG] : usheet[data.SECONDARY_WEAPON_TAG]
    );

    var minR = wp.minRange;
    var maxR = wp.maxRange;

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

        if( data.distance( x,y, lX,lY ) >= minR ){
          var tUnit = data.unitByPos( lX, lY );
          if( tUnit !== null && tUnit.owner !== spid &&
                    data.player(tUnit.owner).team !== steam ){

            var dmg = data.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              return true;
            }
          }
        }
      }
    }
  };

  /**
   * Invokes a battle between an attacker against a defender. If the defender
   * weapon is defined and the defender is alive after the attack then it will
   * start a counter attack if the weapons suits for a counter attack.
   *
   * @param attid
   * @param defid
   * @param attDmg
   * @param defDmg
   * @param attwpid
   * @param defwpid
   */
  data.unitAttack = function( attid, defid, attDmg, defDmg, attwpid, defwpid ) {

    var att = data.unitById( attid );
    var def = data.unitById( defid );
    var attWp = data.weaponSheet( attwpid );
    var defWp = ( defwpid !== null )? data.weaponSheet( defwpid ) : null;

    def.hp -= attDmg;

    // decrease ammo
    if( attWp.useAmmo !== -1 ){
      att.ammo--;
    }

    // fill co power meter
    data.increasePowerMeter( att.owner, 0.5*0 );
    data.increasePowerMeter( def.owner, 0 );

    if( def.hp < 0 ){

      // defender destroyed
      cwt.destroyUnit( defid );
    }
    else if( defWp !== null ){

      // counterattack
      att.hp -= defDmg;

      // decrease ammo
      if( defWp.useAmmo !== -1 ){
        def.ammo--;
      }

      // fill co power meter
      cwt.increasePowerMeter( att.owner, 0 );
      cwt.increasePowerMeter( def.owner, 0.5*0 );

      if( att.hp < 0 ){

        // attacker destroyed
        cwt.destroyUnit( attid );
      }
    }
  };

  /**
   * Returns the base damage from a weapon sheet against an unit type.
   *
   * @param weapon weapon sheet
   * @param uType {string} unit type
   */
  data.getBaseDamage = function( weapon, uType ){

    var dmg;

    dmg = weapon.damages[ uType ];
    if( dmg !== undefined ) return dmg;

    dmg = weapon.damages[ "*" ];
    if( dmg !== undefined ) return dmg;

    return 0;
  };

  /**
   *
   * @param pid
   * @param fsp
   */
  data.increasePowerMeter = function( pid, fsp ){
    // fsp === funds?
    // recognize number of uses
  };

  /**
   * Destroys an unit object and removes its references from the
   * game instance.
   */
  data.destroyUnit = function( uid ){
    data.eraseUnitPosition( uid );
    data.unitById( uid ).owner = CWT_INACTIVE_ID;
  };


});

// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_ACTIONS, function( action, data ){

  /**
   *
   */
  action.mainAttack = {
    targetSelection: true,
    condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
      if( selected === null ) return;

      var type = data.unitSheet( selected.type );
      if( type[data.PRIMARY_WEAPON_TAG] === undefined ) return;

      // NO MOVE AND FIRE WEAPON ?
      var wps = data.weaponSheet( type[data.PRIMARY_WEAPON_TAG] );
      if( moved === true && wps.noMoveAndFire ) return false;

      return data.hasTargets( selected, data.PRIMARY_WEAPON_TAG, x,y,moved );
    },

    action: function( x, y, suid, tuid ){

      var att = data.unitById( suid );
      var def = data.unitById( tuid );
      var attwp = att[ data.PRIMARY_WEAPON_TAG ];
      if( attwp === undefined ){
        cwt.error("attacker id",suid," does not have a main weapon");
      }

      var attDmg = data.getBaseDamage( attwp, def.type );
      var defDmg = 0;

      data.unitAttack( suid, tuid, attDmg, defDmg, attwp, null );
      action.wait.action( suid );
    }
  };

  /**
   *
   */
  action.subWpAttack = {
    targetSelection: true,
    condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
      if( selected === null ) return;

      var type = data.unitSheet( selected.type );
      if( type[ data.SECONDARY_WEAPON_TAG] === undefined ) return false;

      // NO MOVE AND FIRE WEAPON ?
      var wps = data.weaponSheet( type[ data.SECONDARY_WEAPON_TAG ] );
      if( moved === true && wps.noMoveAndFire ) return false;

      return data.hasTargets( selected, data.SECONDARY_WEAPON_TAG, x,y, moved );
    },

    action: function( x, y, suid, tuid ){

      var att = data.unitById( suid );
      var def = data.unitById( tuid );
      var attwp = att[ data.SECONDARY_WEAPON_TAG ];
      if( attwp === undefined ){
        util.logError("attacker id ",suid," does not have a sub weapon");
      }

      var attDmg = data.getBaseDamage( attwp, def.type );
      var defDmg = 0;

      data.unitAttack( suid, tuid, attDmg, defDmg, attwp, null );
      action.wait.action( suid );
    }
  };
});

/********

   D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]

   D = Actual damage expressed as a percentage

   B = Base damage (in damage chart)
   ACO = Attacking CO attack value (example:130 for Kanbei)

   R = Random number 0-9

   AHP = HP of attacker

   DCO = Defending CO defense value (example:80 for Grimm)
   DTR = Defending Terrain Stars (IE plain = 1, wood = 2)
   DHP = HP of defender

 Denoted as xxxXXXX where x = small star and X = big star..for now.
 Every star is worth 9000 fund at the start of the game. Each additional
 use of CO Power(including SCOP) increase the value of each star by 1800
 fund up to the tenth usage, when it won't increase any further.

 Stars on your Charge Meter can be charged in two ways:

 Damaging your oppoent's units. You gain meter equal to half the fund damage
 you deal. Receiving damage from your opponent. You gain meter equal to the
 fund damage you take. Keep in mind that AWBW only keeps track of real numbers
 for the purpose of Charge Meter calculation. That means taking a 57% attack
 and ending up with 5 hp only adds 0.5*full cost of unit to your Charge Meter.
 In Summary, the amount of charge added to your meter can be calculated as:

   (0.5*0.1*Damage Dealt*Cost of Unit X)+(0.1*Damage Received*Cost of Unit Y)


 It should be noted that a COs meter does not charge during the turn they activate a power.

 *****************/