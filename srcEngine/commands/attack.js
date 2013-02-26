controller.userAction({
  
  name:"attackUnit",
  
  key:"ATUN",
  
  unitAction: true,
  hasSubMenu: true,
  
  MOVABLE_CODE: 1,
  MOVABLE_ATTACKABLE_CODE: 2,
  ATTACKABLE_CODE: 3,

  fillAttackableTiles: function( data ){
    var sx = data.sourceX;
    var sy = data.sourceY;
    var unit = data.sourceUnit;
    
    model.fillMoveMap( data );
    
    var sdata = data.selectionData;
    var e = sdata.length;
    var cx = data.selectionCX;
    var cy = data.selectionCY;
    
    // SET MOVE DATA
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        if( sdata[x][y] >= 0 ) sdata[x][y] = this.MOVABLE_CODE;
      }
    }
    
    // GET TARGETS
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        if( sdata[x][y] === this.MOVABLE_CODE ||
            sdata[x][y] === this.MOVABLE_ATTACKABLE_CODE ){
          
          this.markTargets( data, unit, x,y, model.PRIMARY_WEAPON_TAG ); 
          this.markTargets( data, unit, x,y, model.SECONDARY_WEAPON_TAG ); 
          
          // TILE IS PROCESSED
          sdata[x][y] === this.ATTACKABLE_CODE;
        }
      }
    }
  },
  
  counterWeapon: function( xdef, ydef, xatt, yatt ){
    var dis = Math.abs(xdef-xatt) + Math.abs( ydef-yatt );
    if( dis > 1 ) return null; // INDIRECT ATTACK

    var def = model.unitPosMap[xdef][ydef];
    var att = model.unitPosMap[xatt][yatt];
    var defsheet = model.sheets.unitSheets[ def.type ];
    var mainWp = defsheet[model.PRIMARY_WEAPON_TAG];
    var sideWp = defsheet[model.SECONDARY_WEAPON_TAG];

    if( mainWp !== undefined ){
      mainWp = model.sheets.weaponSheets[ mainWp ];
      var minR = mainWp.minRange;
      var maxR = mainWp.maxRange;
      if( minR === 1 && maxR === 1 && dis === 1 ) return mainWp;
    }

    if( sideWp !== undefined ){
      sideWp = model.sheets.weaponSheets[ sideWp ];
      var minR = sideWp.minRange;
      var maxR = sideWp.maxRange;
      if( minR === 1 && maxR === 1 && dis === 1 ) return sideWp;
    }

    // NO POSSIBLE COUNTER WEAPON
    return null;
  },
  
  markTargets: function( data, unit, x, y, wpTag ){
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

    if( wp === undefined ) return;

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
          
          var value = data.getSelectionValueAt( lX,lY );
              
          var tValue = this.ATTACKABLE_CODE;
          if( value === this.MOVABLE_CODE ){
              tValue = this.MOVABLE_ATTACKABLE_CODE;
          }
                 
          data.setSelectionValueAt( lX,lY, tValue );
        }
      }
    }
  },

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

            // IN FOG ?
            if( model.fogData[lX][lY] === 0 ) continue;

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){
              return true;
            }
          }
        }
      }
    }
  },

  prepareMenu: function( data ){
    var selectedUnit = data.sourceUnit;
    var x = data.targetX;
    var y = data.targetY;

    // TODO --> MOVED <--
    if( this.hasTargets(selectedUnit,model.PRIMARY_WEAPON_TAG,x,y,true)){
      data.addEntry("mainWeapon");
    }
    if( this.hasTargets(selectedUnit,model.SECONDARY_WEAPON_TAG,x,y,true)){
      data.addEntry("subWeapon");
    }
  },

  targetSelectionType:"B",
  prepareTargets: function( data ){
    var selectedUnit = data.sourceUnit;
    var weapon = data.subAction;
    var tx = data.targetX;
    var ty = data.targetY;

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

            // IN FOG ?
            if( model.fogData[lX][lY] === 0 ) continue;

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              if( DEBUG ){
                util.logInfo("found target at (",lX,",",lY,")");
              }

              data.setSelectionValueAt( lX,lY, 1 );
            }
          }
        }
      }
    }
  },

  condition: function( data ){
    var daysOfPeace = model.rules.daysOfPeace;
    if( model.day-1 < daysOfPeace ) return false;

    if( data.targetUnitId !== CWT_INACTIVE_ID && data.targetUnitId !== data.sourceUnitId ) return false;

    var selectedUnit = data.sourceUnit;

    var x = data.targetX;
    var y = data.targetY;

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
  
  createDataSet: function( data ){
    var wp = ( data.subAction === 'mainWeapon')?
      model.primaryWeaponOfUnit( data.sourceUnit ):
      model.secondaryWeaponOfUnit( data.sourceUnit );
    
    return [ 
      data.sourceUnitId, 
      model.getBaseDamage( wp, data.selectionUnit.type ),
      data.subAction === model.PRIMARY_WEAPON_TAG,
      data.selectionUnitId, 
      0,
      false
    ];
  },
  
  /**
   * One unit attacks another unit.
   *
   * @param {Number} aid unit id of the attacker
   * @param {Number} admg damage dealt by the attacker
   * @param {Boolean} aUseAmmo if true attacker ammo will be decreased
   * @param {Number} did unit id of the defender
   * @param {Number} ddmg damage dealt by the defender
   * @param {Boolean} dUseAmmo if true defender ammo will be decreased
   * 
   * @methodOf controller.actions
   * @name attackUnit
   */
  action: function( aid, admg, aUseAmmo, did, ddmg, dUseAmmo ){
    
    // ATTACK
    controller.actions.damageUnit( did, admg );
    controller.actions.wait( aid );
    
    // COUNTER ATTACK
    if( model.units[did].owner !== CWT_INACTIVE_ID ){
      controller.actions.damageUnit( aid, ddmg );  
    }
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