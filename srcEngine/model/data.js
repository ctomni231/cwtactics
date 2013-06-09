util.scoped(function(){
  
  function expectArray( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "object" && typeof v.length === undefined ){ 
      util.raiseError(attr,"needs to be an array but is ",typeof v);
    }
    
    return true;
  }
  
  function expectString( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "string" ) util.raiseError(attr,"needs to be a string but is ",typeof v);
    
    return true;
  }
  
  function expectObject( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "object" ) util.raiseError(attr,"needs to be an object but is ",typeof v);
    
    return true;
  }
  
  function expectBoolean( obj, attr, mustDefined ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "boolean" ) util.raiseError(attr,"needs to be a boolean but is ",typeof v);
    
    return true;
  }
  
  function notIn( attr, obj ){
    if( obj.hasOwnProperty(attr) ) util.raiseError(attr,"is already registered");
  } 
  
  function not( attr, obj, res ){
    if( obj[attr] === res ) util.raiseError(attr,"cannot have value",res);
  } 
  
  function isIn( attr, obj ){
    if( !obj.hasOwnProperty(attr) ) util.raiseError(attr,"is not registered");
  } 
  
  function expectNumber( obj, attr, mustDefined, integer, min, max ){
    var v = obj[attr];
    
    if( v === undefined && mustDefined === true ) util.raiseError(attr,"needs to be defined");
    if( v === undefined ) return false;
    
    if( typeof v !== "number" ) util.raiseError(attr,"needs to be a number but is ",typeof v);
    if( integer === true && parseInt(v,10) !== v ) util.raiseError(attr,"needs to be an integer");
    
    if( min !== undefined && v < min ) util.raiseError(attr,"needs to be greater equal",min,"but is",v);
    if( min !== undefined && isNaN(min) ) util.raiseError("wrong minimum parameter");
    
    if( max !== undefined && v > max ) util.raiseError(attr,"needs to be greater equal",max,"but is",v);
    if( max !== undefined && isNaN(max) ) util.raiseError("wrong maximum parameter");
    
    return true;
  }
  
  // --------------------------------------------------------------- //
  
  /**
   *
   */
  model.unitTypes = {};
  
  /**
   *
   */
  model.tileTypes = {};
  
  /**
   *
   */
  model.weatherTypes = {};
  
  /**
   *
   */
  model.defaultWeatherType = null;
  
  /**
   *
   */
  model.nonDefaultWeatherType = [];
  
  /**
   *
   */
  model.moveTypes = {};
  
  /**
   *
   */
  model.factionTypes = {};
  
  /**
   *
   */
  model.coTypes = {};
  
  /**
   *
   */
  model.globalRules = [];
  
  /**
   *
   */
  model.mapRules = [];
  
  /**
   *
   */
  model.language = { en:{} };
  
  /**
   *
   */
  model.sounds = null;
  
  /**
   *
   */
  model.graphics = null;
  
  /**
   *
   */
  model.maps = null;
  
  /**
   *
   */
  model.wpKeys_ = ["main_wp","sec_wp"];
  
  var selectedLang = "en";
  
  /**
   * Returns a localized string for a given key or if not exist the key itself.
   *
   * @param {String} key
   */
  model.localized = function( key ){
    var result = model.language[selectedLang][key];
    return ( result === undefined )? key: result;
  };
  
  /**
   * Parses an unit sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseUnitType = function( sheet ){
    var keys,key,list,att,i1,i2,e1,e2,sub;
    
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing unit sheet",sheet.ID);
    
    notIn( sheet.ID, model.unitTypes );
    
    // MOVE TYPE MUST BE DEFINED
    expectString(sheet,"movetype",true);
    isIn( sheet.movetype, model.moveTypes );
    
    // VISION, MOVE CAN BE THE MAX_MOVE_RANGE IN MAXIMUM
    expectNumber(sheet,"range",true,true,0,CWT_MAX_SELECTION_RANGE);
    expectNumber(sheet,"vision",true,true,1,CWT_MAX_SELECTION_RANGE);
    
    // GENERAL STUFF
    expectNumber(sheet,"fuel",true,true,0,99);
    expectNumber(sheet,"ammo",true,true,0,9);
    expectNumber(sheet,"cost",true,true,0,99999);
    
    // OPTIONAL SPECIAL ABILITIES
    expectBoolean(sheet,"stealth",false);
    expectBoolean(sheet,"suppliesloads",false);
    expectNumber(sheet,"captures",false,true,1,10);
    
    // TRANSPORT ?
    if( expectArray(sheet,"canload",false) ){
      
      // NEED MAX LOAD
      expectNumber(sheet,"maxloads",true,true,1,5);
      
      list = sheet.canload;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    // SUPPLY ?
    if( expectArray(sheet,"supply",false) ){
      list = sheet.supply;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    // SUICIDER ?
    if( expectObject(sheet,"suicide",false) ){
      sub = sheet.suicide;
      expectNumber(sub,"damage",true,true,1,9);
      expectNumber(sub,"range",true,true,1,CWT_MAX_SELECTION_RANGE);
      
      // EXCEPTIONS?
      if( expectObject(sub,"nodamage",false ) ){
        list = sub.nodamage;
        for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
      }
    }
    
    // REPAIRS ?
    if( expectObject(sheet,"repairs",false)){
      sub = sheet.repairs;
      keys = Object.keys(sub);
      for( i2=0,e2=keys.length; i2<e2; i2++ ){
        key = keys[i2];
        
        // HARD HP REPAIR BETWEEN 1 AND 9 
        // (10 IS NOT A POSSIBLE GAME STATE FOR A REPAIR)
        expectNumber( sub, key, true, true, 1,9 );
      }
    }
    
    // ATTACKER ?
    if( expectObject(sheet,"attack",false) ){
      att = sheet.attack;
      
      // MIN RANGE < MAX_RANGE IF DEFINED
      expectNumber(att,"minrange",false,true,1);
      expectNumber(att,"maxrange",false,true,att.minrange+1);
      
      // CHECK WEAPONS
      for( i1=0,e1=model.wpKeys_.length; i1<e2; i1++ ){
        if( expectObject(att,model.wpKeys_[i1],false) ){
          list = att[model.wpKeys_[i1]];
          keys = Object.keys(list);
          for( i2=0,e2=keys.length; i2<e2; i2++ ){
            key = keys[i2];
            expectNumber( list, key, true, true, 1 );
          }
        }
      }
    }
    
    model.unitTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a tile sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseTileType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing tile sheet",sheet.ID);
    
    notIn( sheet.ID, model.tileTypes );
    
    expectNumber(sheet,"defense",true,true,0,6);
    expectNumber(sheet,"vision",false,true,0,CWT_MAX_SELECTION_RANGE);
    expectNumber(sheet,"points",false,true,1,100);
    expectNumber(sheet,"funds",false,true,10,99999);
    
    // REPAIRS ?
    if( expectObject(sheet,"repairs",false)){
      sub = sheet.repairs;
      keys = Object.keys(sub);
      for( i2=0,e2=keys.length; i2<e2; i2++ ){
        key = keys[i2];
        
        // HARD HP REPAIR BETWEEN 1 AND 9 
        // (10 IS NOT A POSSIBLE GAME STATE FOR A REPAIR)
        expectNumber( sub, key, true, true, 1,9 );
      }
    }
    
    // BUILDS ?
    if( expectArray(sheet,"builds",false) ){
      list = sheet.builds;
      for( i1=0,e1=list.length; i1<e1; i1++ ) expectString(list,i1,true);
    }
    
    model.tileTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a weather sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseWeatherType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing weather sheet",sheet.ID);
    
    notIn( sheet.ID, model.weatherTypes );
    
    // TODO AT LEAST ONE HAS TO BE DEFAULT
    expectBoolean(sheet,"defaultWeather",false);
    
    expectNumber(sheet,"vision",false,true,-5,+5);
    expectNumber(sheet,"att",false,true,-100,+100);
    expectNumber(sheet,"minRange",false,true,-5,+5);
    expectNumber(sheet,"maxRange",false,true,-5,+5);
    
    model.weatherTypes[sheet.ID] = sheet;
    if( sheet.defaultWeather ) model.defaultWeatherType = sheet;
    else model.nonDefaultWeatherType.push( sheet );
  };
  
  /**
   * Parses a movetype sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseMoveType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing movetype sheet",sheet.ID);
    
    notIn( sheet.ID, model.moveTypes );
    
    // MOVE COSTS
    expectObject(sheet,"costs",true);
    var costs = sheet.costs;
    var costsKeys = Object.keys(costs);
    for( var i1=0,e1=costsKeys.length; i1<e1; i1++ ){
      expectNumber(costs,costsKeys[i1],true,true,-1,CWT_MAX_SELECTION_RANGE);
      not(costs,costsKeys[i1],0);
    }
    
    model.moveTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a CO sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseCoType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing co sheet",sheet.ID);
    
    notIn( sheet.ID, model.coTypes );
    
    expectNumber(sheet,"coStars",true,true,-1,10);
    not(sheet,"coStars",0);
    expectNumber(sheet,"scoStars",true,true,-1,10);
    not(sheet,"scoStars",0);
    
    expectArray(sheet,"d2d",true);
    expectArray(sheet,"cop",true);
    expectArray(sheet,"scop",true);
    
    expectString(sheet,"faction",true);
    isIn( sheet.faction, model.factionTypes );
    
    expectString(sheet,"music",false);
    
    model.coTypes[sheet.ID] = sheet;
  };
  
  /**
   * Parses a Faction sheet and adds it to the sheet database. If the 
   * sheet is not correct then an error will be thrown.
   * 
   * @param {Object} sheet
   */
  model.parseFactionType = function( sheet ){
    expectString(sheet,"ID",true);
    if( DEBUG ) util.log("try parsing faction sheet",sheet.ID);
    
    notIn( sheet.ID, model.factionTypes );
    
    expectString(sheet,"music",true);
    
    model.factionTypes[sheet.ID] = sheet;
  };
  
  model.parseRule = function( rule, isMapRule ){
    if( isMapRule ){
      model.mapRules.push(rule);
    }
    else model.globalRules.push(rule);
  };
    
  model.checkMap = function( map ){
    var list;
    
    expectString(map,"name",true);
    
    expectArray(map,"players",true);
    list = map.players;
    expectNumber(list,"length",true,true,1,4);
    for( i=0,e=list.length; i<e; i++ ){ 
      expectArray(list,i,true);
      expectNumber(list[i],0,true,true,i,i);
      expectString(list[i],1,true);
      expectNumber(list[i],2,true,true,0,999999);
      expectNumber(list[i],3,true,true,1,4);   
      expectString(list[i],4,true);
      expectString(list[i],5,true);
      expectNumber(list[i],6,true,true,0,99999);
    }
    
     expectArray(map,"leftActors",true);
    list = map.leftActors;
    expectNumber(list,"length",true,true,1,50);
    for( i=0,e=list.length; i<e; i++ ){ 
      expectNumber(list,i,true,true,0,49);
    }
    
    expectArray(map,"timers",true);
    expectArray(map,"rules",true);
    
    expectNumber(map,"day",true,true,0,9999);
    expectNumber(map,"turnOwner",true,true,0,map.players.length-1);
    expectNumber(map,"mapHeight",true,true,10,100);
    expectNumber(map,"mapWidth",true,true,10,100);
    
    if( expectArray(map,"typeMap",true) ){
      list = map.typeMap;
      for( i=0,e=list.length; i<e; i++ ) expectString(list,i,true);
    }
    
    if( expectArray(map,"map",true) ){
      list = map.map;
      
      expectNumber(list,"length",true,true,10,100);
      for( i=0,e=list.length; i<e; i++ ){ 
        expectArray(list,i,true) ;
        expectNumber(list[i],"length",true,true,10,100);
      }
    }
  };
  
  
  /** @private */
  model.listOfUnitTypes_ = null;
  
  /** @private */
  model.listOfPropertyTypes_ = null;
  
  /**
   * Returns all known type game of properties.
   */
  model.getListOfPropertyTypes = function(){
    if( model.listOfTileTypes_ === null ){
      var tiles = model.tileTypes;
      var l = Object.keys( tiles );
      
      var r = [];
      for( var i=l.length-1; i>=0; i-- ){
        if( tiles[l[i]].capturePoints > 0 ){
          r.push( l[i] );
        }
      }
      
      model.listOfPropertyTypes_ = r;
    }
    
    return model.listOfPropertyTypes_;
  };
  
  /** @private */
  model.listOfTileTypes_ = null;
  
  /**
   * Returns all known type game of tiles.
   */
  model.getListOfTileTypes = function(){
    if( model.listOfTileTypes_ === null ){
      var tiles = model.tileTypes;
      var l = Object.keys( tiles );
      
      var r = [];
      for( var i=l.length-1; i>=0; i-- ){
        if( tiles[l[i]].capturePoints === undefined ){
          r.push( l[i] );
        }
      }
      
      model.listOfTileTypes_ = r;
    }
    
    return model.listOfTileTypes_;
  };
  
});