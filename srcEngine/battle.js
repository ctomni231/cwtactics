/** @constant */
game.PRIMARY_WEAPON_TAG = "mainWeapon";

/** @constant */
game.SECONDARY_WEAPON_TAG = "subWeapon";

/**
 * Checks if an unit has targets for a given weapon tag.
 *
 * @param unit attacking unit object
 * @param wpTag mainWeapon|subWeapon
 * @param x x coordinate (optional)
 * @param y y coordinate (optional)
 * @return true|false
 */
game.hasTargets = function( unit, wpTag, x, y, moved ){
  if( arguments.length === 2 ){
    x = unit.x;
    y = unit.y;
  }

  var spid = unit.owner;
  var steam = game.player( unit.owner ).team;

  var usheet = game.unitSheet( unit.type );
  var wp     = game.weaponSheet(
    ( wpTag === game.PRIMARY_WEAPON_TAG )?
      usheet[game.PRIMARY_WEAPON_TAG] : usheet[game.SECONDARY_WEAPON_TAG]
  );
  
  if( wp === undefined ) return false;

  var minR = wp.minRange;
  var maxR = wp.maxRange;

  var lX;
  var hX;
  var lY = y-maxR;
  var hY = y+maxR;
  if( lY < 0 ) lY = 0;
  if( hY >= domain.mapHeight ) hY = domain.mapHeight-1;
  for( ; lY<=hY; lY++ ){

    var disY = Math.abs( lY-y );
    lX = x-maxR+disY;
    hX = x+maxR-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= domain.mapWidth ) hX = domain.mapWidth-1;
    for( ; lX<=hX; lX++ ){

      if( game.distance( x,y, lX,lY ) >= minR ){
        var tUnit = game.unitByPos( lX, lY );
        if( tUnit !== null && tUnit.owner !== spid &&
          game.player(tUnit.owner).team !== steam ){

          var dmg = game.getBaseDamage( wp, tUnit.type );
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
game.unitAttack = function( attid, defid, attDmg, defDmg, attwp, defwp ) {

  var att = game.unitById( attid );
  var def = game.unitById( defid );

  def.hp -= attDmg;

  // decrease ammo
  if( attwp.useAmmo !== -1 ){
    att.ammo--;
  }

  // fill co power meter
  game.increasePowerMeter( att.owner, 0.5*0 );
  game.increasePowerMeter( def.owner, 0 );

  if( def.hp < 0 ){

    // defender destroyed
    cwt.destroyUnit( defid );
  }
  else if( defwp !== null ){

    // counterattack
    att.hp -= defDmg;

    // decrease ammo
    if( defwp.useAmmo !== -1 ){
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
game.getBaseDamage = function( weapon, uType ){

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
game.increasePowerMeter = function( pid, fsp ){
  // fsp === funds?
  // recognize number of uses
};

/**
 * Destroys an unit object and removes its references from the
 * game instance.
 */
game.destroyUnit = function( uid ){
  game.eraseUnitPosition( uid );
  game.unitById( uid ).owner = CWT_INACTIVE_ID;
};

/**
 *
 * @param unit
 */
game.primaryWeaponOfUnit = function( unit ){
  if( typeof unit === 'number' ){ unit = game.unitById( unit ); }

  var type = game.unitSheet( unit.type )[ game.PRIMARY_WEAPON_TAG ];
  return (type !== undefined )? game.weaponSheet( type ) : null;
};

/**
 *
 * @param unit
 */
game.secondaryWeaponOfUnit = function( unit ){
  if( typeof unit === 'number' ){ unit = game.unitById( unit ); }

  var type = game.unitSheet( unit.type )[ game.SECONDARY_WEAPON_TAG ];
  return (type !== undefined )? game.weaponSheet( type ) : null;
};

/**
 *
 */
actions.attack = {

  targetSelection: true,
  hasSubMenu: true,

  prepareSubMenu: function( menu, selected, tx, ty ){
    if( game.hasTargets( selected,game.PRIMARY_WEAPON_TAG,tx,ty,true ) ){
      menu.push("mainWeapon");
    }
    if( game.hasTargets( selected,game.SECONDARY_WEAPON_TAG,tx,ty,true ) ){
      menu.push("subWeapon");
    }
  },

  prepareTargets: function( selected, tx, ty, subEntry ){
    var wp = ( subEntry === 'mainWeapon')?
      game.primaryWeaponOfUnit( selected ):
      game.secondaryWeaponOfUnit( selected );

    var spid = selected.owner;
    var steam = game.player( selected.owner ).team;
    var minR = wp.minRange;
    var maxR = wp.maxRange;

    var lX;
    var hX;
    var lY = ty-maxR;
    var hY = ty+maxR;
    if( lY < 0 ) lY = 0;
    if( hY >= game.mapHeight() ) hY = game.mapHeight()-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-ty );
      lX = tx-maxR+disY;
      hX = tx+maxR-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= game.mapWidth() ) hX = game.mapWidth()-1;
      for( ; lX<=hX; lX++ ){

        if( game.distance( tx,ty, lX,lY ) >= minR ){
          var tUnit = game.unitByPos( lX, lY );
          if( tUnit !== null && tUnit.owner !== spid &&
            game.player(tUnit.owner).team !== steam ){

            var dmg = game.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              if( util.DEBUG ){
                util.logInfo("found target at (",lX,",",lY,")");
              }
              controller.setValueOfSelectionPos( lX,lY, 1 );
            }
          }
        }
      }
    }
  },

  condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
    if( selected === null || !game.isUnit(selected) ) return;

    if(
      ( game.primaryWeaponOfUnit(selected) !== null &&
        game.hasTargets( selected,game.PRIMARY_WEAPON_TAG,x,y, moved ) ) ||
        ( game.secondaryWeaponOfUnit(selected) !== null &&
          game.hasTargets( selected,game.SECONDARY_WEAPON_TAG,x,y, moved ) )

      ){
      return true;
    }
    else return false;
  },

  action: function( x, y, auid, puid, ttuid, ax, ay, subEntry ){

    var att = game.unitById( auid );
    var def = game.unitByPos( ax, ay );
    var attwp = ( subEntry === 'mainWeapon')?
      game.primaryWeaponOfUnit( att ): game.secondaryWeaponOfUnit( att );

    if( attwp === undefined ){
      util.logError("attacker id ",auid," does not have a sub weapon");
    }

    var attDmg = game.getBaseDamage( attwp, def.type );
    var defDmg = 0;

    game.unitAttack( auid, game.extractUnitId(def), attDmg, defDmg, attwp, null );
    signal.emit( signal.EVENT_INTO_WAIT, auid );
  }
};


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