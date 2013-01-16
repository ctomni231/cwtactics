controller.registerCommand({

  key:"attack",
  unitAction: true,
  targetSelection: true,
  hasSubMenu: true,

  hasTargets: function( unit, wpTag, x, y, moved ){
    if( arguments.length === 2 ){
      x = unit.x;
      y = unit.y;
    }

    var spid = unit.owner;
    var steam = model.players[ unit.owner ].team;

    var usheet = model.sheets.unitSheets[ unit.type ];
    var wp     = model.sheets.weaponSheets[
      ( wpTag === model.PRIMARY_WEAPON_TAG )?
        usheet[model.PRIMARY_WEAPON_TAG] : usheet[model.SECONDARY_WEAPON_TAG]
    ];

    if( wp === undefined ) return false;

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

        if( model.distance( x,y, lX,lY ) >= minR ){
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && tUnit.owner !== spid &&
              model.players[ tUnit.owner ].team !== steam ){

              var dmg = model.getBaseDamage( wp, tUnit.type );
              if( dmg > 0 ){
                return true;
              }
            }
          }
        }
      }
  },

  // ------------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var selectedUnit = data.getSourceUnit();
    var x = data.getTargetX();
    var y = data.getTargetY();

    // TODO --> MOVED <--
    if( this.hasTargets(selectedUnit,model.PRIMARY_WEAPON_TAG,x,y,true)){
      addEntry("mainWeapon");
    }
    if( this.hasTargets(selectedUnit,model.SECONDARY_WEAPON_TAG,x,y,true)){
      addEntry("subWeapon");
    }
  },

  // ------------------------------------------------------------------------
  prepareTargets: function( data, selectionData ){
    var selectedUnit = data.getSourceUnit();
    var weapon = data.getSubAction();
    var tx = data.getTargetX();
    var ty = data.getTargetY();

    var wp = ( weapon === 'mainWeapon')?
      model.primaryWeaponOfUnit( selectedUnit ):
      model.secondaryWeaponOfUnit( selectedUnit );

    var spid = selectedUnit.owner;
    var steam = model.players[ selectedUnit.owner ].team;
    var minR = wp.minRange;
    var maxR = wp.maxRange;

    var lX;
    var hX;
    var lY = ty-maxR;
    var hY = ty+maxR;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-ty );
      lX = tx-maxR+disY;
      hX = tx+maxR-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){

        if( model.distance( tx,ty, lX,lY ) >= minR ){
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && tUnit.owner !== spid &&
            model.players[ tUnit.owner ].team !== steam ){

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              if( DEBUG ){
                util.logInfo("found target at (",lX,",",lY,")");
              }

              selectionData.setPositionValue( lX,lY, 1 );
            }
          }
        }
      }
    }
  },

  // ------------------------------------------------------------------------
  condition: function( data ){
    if( data.getTargetUnitId() !== CWT_INACTIVE_ID ) return false;

    var selectedUnit = data.getSourceUnit();

    var x = data.getTargetX();
    var y = data.getTargetY();

    if(
      ( model.primaryWeaponOfUnit(selectedUnit) !== null &&
        this.hasTargets( selectedUnit,model.PRIMARY_WEAPON_TAG,x,y, true )) ||
        ( model.secondaryWeaponOfUnit(selectedUnit) !== null &&
          this.hasTargets( selectedUnit,model.SECONDARY_WEAPON_TAG,x,y, true ))

      ){
      return true;
    }
    else return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var attacker = data.getSourceUnit();
    var defender = data.getTargetUnit();
    var weaponTag = data.getSubAction();

    // TODO COUNTER ATTACK
    var attwp = ( weaponTag === 'mainWeapon')?
      model.primaryWeaponOfUnit( attacker ):
      model.secondaryWeaponOfUnit( attacker );
    var defwp = null;

    var attDmg = model.getBaseDamage( attwp, defender.type );
    var defDmg = 0;

    defender.hp -= attDmg;

    // decrease ammo
    if( attwp.useAmmo !== 0 ){
      attacker.ammo--;
    }

    // fill co power meter
    //model.increasePowerMeter( att.owner, 0.5*0 );
    //model.increasePowerMeter( defender.owner, 0 );

    if( defender.hp < 0 ){

      // defender destroyed
      model.destroyUnit( model.extractUnitId(defender) );
    }
    else if( defwp !== null ){

      // counterattack
      attacker.hp -= defDmg;

      // decrease ammo
      if( defwp.useAmmo !== 0 ){
        defender.ammo--;
      }

      // fill co power meter
      //game.increasePowerMeter( att.owner, 0 );
      //game.increasePowerMeter( defender.owner, 0.5*0 );

      if( attacker.hp < 0 ){

        // attacker destroyed
        model.destroyUnit( model.extractUnitId(attacker) );
      }
    }

    controller.invokeCommand( data, "wait" );
  }
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