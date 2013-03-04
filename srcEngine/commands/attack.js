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
      if( mainWp.usesAmmo === 0 || def.ammo > 0 ){
        var minR = mainWp.minRange;
        var maxR = mainWp.maxRange;
        if( minR === 1 && maxR === 1 && dis === 1 ) return mainWp;
      }
    }

    if( sideWp !== undefined ){
      sideWp = model.sheets.weaponSheets[ sideWp ];
      if( sideWp.usesAmmo === 0 || def.ammo > 0 ){
        var minR = sideWp.minRange;
        var maxR = sideWp.maxRange;
        if( minR === 1 && maxR === 1 && dis === 1 ) return sideWp;
      }
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

    if( wp.usesAmmo === 1 && unit.ammo === 0 ) return false;
    
    if( moved && wp.fireType === "INDIRECT" ) return false;
    
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
    
    var moved = false;
    if( data.movePath.length > 0 ){
      moved = true;
    }
    
    var x = data.targetX;
    var y = data.targetY;

    if(
      ( model.primaryWeaponOfUnit(selectedUnit) !== null &&
        this.hasTargets( selectedUnit,model.PRIMARY_WEAPON_TAG,x,y, moved )) ||
        ( model.secondaryWeaponOfUnit(selectedUnit) !== null &&
          this.hasTargets( selectedUnit,model.SECONDARY_WEAPON_TAG,x,y, moved ))

      ){
      return true;
    }
    else return false;
  },
  
  getEndDamage: function( attacker, wp, defender ){
    
    var BASE = model.getBaseDamage( wp, defender.type );
    
    var AHP = model.unitHpPt( attacker );
    var ACO = 100;
    var LUCK = parseInt( Math.random()*10, 10 );
    
    var DCO = 100;
    
    var ftype;
    if( model.propertyPosMap[defender.x][defender.y] !== null ){
      ftype = model.propertyPosMap[defender.x][defender.y].type;
    }
    else ftype = model.map[defender.x][defender.y];
    
    var DTR = model.sheets.tileSheets[ ftype ].defense;
    var DHP = model.unitHpPt( defender );
    
    // D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]
    var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );
    damage = parseInt( damage, 10 );
    
    if( DEBUG ){
      util.log(
        "attacker: ",model.extractUnitId( attacker ),
        "[",BASE,"*",ACO,"/100+",LUCK,"]*(",AHP,"/10)*[(200-(",DCO,"+",DTR,"*",DHP,"))/100]",
        "=",damage
      );
    }
    
    return damage;
  },
  
  createDataSet: function( data ){
    
    var attWp = ( data.subAction === model.PRIMARY_WEAPON_TAG )? model.primaryWeaponOfUnit( data.sourceUnit ): model.secondaryWeaponOfUnit( data.sourceUnit );
    var attDmg = this.getEndDamage( data.sourceUnit, attWp, data.selectionUnit );
    
    var defDmg = 0;
    var defWp = this.counterWeapon( data.selectionX, data.selectionY, data.targetX, data.targetY );
    if( defWp !== null ){
      defDmg = this.getEndDamage( data.selectionUnit, defWp, data.sourceUnit );
    }
    
    return [ 
      
      data.sourceUnitId, 
      attDmg,
      attWp.usesAmmo !== 0,
      
      data.selectionUnitId, 
      defDmg,
      ( defWp !== null && defWp.usesAmmo !== 0 )
      
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
    
    if( aUseAmmo ) model.units[aid].ammo--;
    
    var dSheets = model.sheets.unitSheets[ model.units[did].type ];
    controller.actions.givePower( 
      model.units[aid].owner,  
      ( 0.5*parseInt( admg/10, 10 )*dSheets.cost )
    );
    
    // COUNTER ATTACK
    if( model.units[did].owner !== CWT_INACTIVE_ID ){
      controller.actions.damageUnit( aid, ddmg );  
      
      if( dUseAmmo ) model.units[did].ammo--;
      
      var aSheets = model.sheets.unitSheets[ model.units[aid].type ];
      controller.actions.givePower( 
        model.units[did].owner,  
        ( parseInt( admg/10, 10 )*dSheets.cost )
      );
    }
  }
});

/********
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