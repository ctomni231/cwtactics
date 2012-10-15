cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    /**
     * The selected language code.
     *
     * @example
     * de --> German
     * en --> English
     */
    client.language = "en";

    /**
     * Returns a localized version of the given key or the key itself if no
     * localized string exists for the given key argument.
     *
     * @param key
     */
    client.localizedString = function( key ){
      var result = client.LOCALE[client.language][key];
      if( result === undefined ) return key;
      return result;
    };

    /**
     * Contains the known languages.
     */
    client.LOCALE = {

      // GERMAN
      de:{

        "INFT_OS":"Infanterie",
        "MECH_OS":"Mechanisierte Infanterie",
        "TANK":"Leichter Panzer",
        "MDTK":"Kampfpanzer",
        "WRTK":"Schw. Panzer",
        "ARTY":"Artillerie",
        "RCKT":"Raketenwerfer",

        "unitMainWeaponAttack":"Angriff: Hauptwaffe",
        "unitSubWeaponAttack":"Angriff: Nebenwaffe",
        "captureProperty":"Besetze Gebäude",
        "unloadUnitFromTransporter":"Einheit ausladen",
        "loadUnitIntoTransporter":"Einheit einladen",
        "nextTurn":"Beende Zug",
        "wait":"Warten",

        "yes":"Ja",
        "no":"Nein",
        "ok":"Ok",
        "cancel": "Abbrechen"
      },

      // ENGLISH
      en:{

        "INFT_OS":"Infantry",
        "MECH_OS":"Mechanized Infantry",
        "TANK":"Light Tank",
        "MDTK":"Battle Tank",
        "WRTK":"Heavy Tank",
        "ARTY":"Artillery",
        "RCKT":"Rocket Launcher",

        "unitMainWeaponAttack":"Attack: Mainweapon",
        "unitSubWeaponAttack":"Attack: Subweapon",
        "captureProperty":"Capture Property",
        "unloadUnitFromTransporter":"Unload Unit",
        "loadUnitIntoTransporter":"Load Unit",
        "nextTurn":"End Turn",
        "wait":"Wait",

        "yes":"Yes",
        "no":"No",
        "ok":"Ok",
        "cancel": "Cancel"
      }
    };
  });