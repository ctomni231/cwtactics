controller.engineAction({

  name: "loadMod",

  key: "LDMD",

  /**
   * Loads a modification.
   *
   * @methodOf controller.actions
   * @name loadMod
   */
  action: function(){

    for( var i=0,e=CWT_MOD_DEFAULT.movetypes.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.movetypes[i],
        model.sheets.MOVE_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.tiles.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.tiles[i],
        model.sheets.TILE_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.units.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.units[i],
        model.sheets.UNIT_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.weapons.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.weapons[i],
        model.sheets.WEAPON_TYPE_SHEET
      );
    }
    
    for( var i=0,e=CWT_MOD_DEFAULT.weathers.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.weathers[i],
        model.sheets.WEATHER_TYPE_SHEET
      );
    }
    
    var langs = Object.keys( CWT_MOD_DEFAULT.locale );
    for( var i=0,e=langs.length; i<e; i++ ){
      util.i18n_appendToLanguage(
        langs[i],
        CWT_MOD_DEFAULT.locale[langs[i]]
      );
    }

    model.parseSheet( CWT_MOD_DEFAULT.rules, model.sheets.RULESET );
  }
});