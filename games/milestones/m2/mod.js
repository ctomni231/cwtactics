var CWT_MOD_DEFAULT = {};
// LOAD IMAGES BY THIS FILE IN FUTURE
CWT_MOD_DEFAULT.graphic = {

  baseSize: 16,

  units:[
    ["INFT","units/AWDS_INFT.png"],
    ["AAIR","units/AWDS_AAIR.png"],
    ["ACAR","units/AWDS_ACAR.png"],
    ["APCR","units/AWDS_APCR.png"],
    ["ARTY","units/AWDS_ARTY.png"],
    ["ATNK","units/AWDR_ATNK.png"],
    ["TANK","units/AWDS_TANK.png"],
    ["BCTR","units/AWDS_BCTR.png"],
    ["BKBM","units/AWDS_BKBM.png"],
    ["BMBR","units/AWDS_BMBR.png"],
    ["BIKE","units/AWDR_BIKE.png"],
    ["BSHP","units/AWDS_BSHP.png"],
    ["CRUS","units/AWDS_CRUS.png"],
    ["FGTR","units/AWDS_FGTR.png"],
    ["LNDR","units/AWDS_LNDR.png"],
    ["MDTK","units/AWDS_MDTK.png"],
    ["MECH","units/AWDS_MECH.png"],
    ["MISS","units/AWDS_MISS.png"],
    ["NTKN","units/AWDS_NTNK.png"],
    ["WRTK","units/AWDS_WRTK.png"],
    ["RECN","units/AWDS_RECN.png"],
    ["PRNR","units/AWDS_PRNR.png"],
    ["RCKT","units/AWDS_RCKT.png"],
    ["STLH","units/AWDS_STLH.png"],
    ["SUBM","units/AWDS_SUBM.png"],
    ["TCTR","units/AWDS_TCTR.png"],
    ["OOZM","units/AWDS_OOZM.png"]
  ],

  tiles:[
    ["PLIN","terrain/AWDS_PLIN.png"],
    ["FRST","terrain/AWDS_FRST.png"],
    ["MNTN","terrain/AWDS_MNTN.png"],
    ["REEF","terrain/AWDS_REEF.png"]
  ],

  properties:[
    ["HQTR","properties/AWDS_HQTR.png"],
    ["BASE","properties/AWDS_BASE.png"],
    ["APRT","properties/AWDS_APRT.png"],
    ["CITY","properties/AWDS_CITY.png"],
    ["CMTR","properties/AWDS_CMTR.png"],
    ["PORT","properties/AW1_PORT.png"],
    ["RADR","properties/AWDR_RADR.png"]
  ],

  misc:[
    ["HP_0","symbol/0.png"],
    ["HP_1","symbol/1.png"],
    ["HP_2","symbol/2.png"],
    ["HP_3","symbol/3.png"],
    ["HP_4","symbol/4.png"],
    ["HP_5","symbol/5.png"],
    ["HP_6","symbol/6.png"],
    ["HP_7","symbol/7.png"],
    ["HP_8","symbol/8.png"],
    ["HP_9","symbol/9.png"],

    ["SYM_AMMO","symbol/ammo.png"],
    ["SYM_FUEL","symbol/fuel.png"],

    ["MOVE_FOC","unitmove.png"],
    ["ATK_FOC","unitatk.png"],

    ["IMG_MAP_PROPERTY","BuildingBaseColors.png"],
    ["IMG_MAP_UNIT"    ,"UnitBaseColors.png"],

    ["SMOKE","smoked.png"],

    ["ARROW_N","arrow.png",0,0,16,16],
    ["ARROW_E","arrow.png",0,0,16,16,90],
    ["ARROW_S","arrow.png",0,0,16,16,180],
    ["ARROW_W","arrow.png",0,0,16,16,270],

    ["ARROW_NS","arrow.png",16,0,16,16],
    ["ARROW_WE","arrow.png",16,0,16,16,90],

    ["ARROW_ES","arrow.png",32,0,16,16],
    ["ARROW_SW","arrow.png",32,0,16,16,90],
    ["ARROW_WN","arrow.png",32,0,16,16,180],
    ["ARROW_NE","arrow.png",32,0,16,16,270]
  ]
};
CWT_MOD_DEFAULT.locale ={

  // GERMAN
  de:{

    "INFT":"Infanterie",
    "MECH":"Mechanisierte Infanterie",
    "TANK":"Leichter Panzer",
    "MDTK":"Kampfpanzer",
    "WRTK":"Schw. Panzer",
    "ARTY":"Artillerie",
    "RCKT":"Raketenwerfer",
    "RECN":"Aufklärer",
    "BIKE":"Mot. Aufklärer",
    "AAIR":"Luftabwehr-Panzer",
    "APCR":"Versorgunsfahrz.",
    "MISS":"Luftabwehr-Raketenw.",

    "PLIN":"Wiese",
    "MNTN":"Berg",
    "FRST":"Wald",

    "captureProperty":"Besetze Geb&auml;ude",
    "unloadUnitFromTransporter":"Einheit ausladen",
    "loadUnitIntoTransporter":"Einheit einladen",
    "nextTurn":"Beende Zug",
    "wait":"Warten",
    "join":"Einheiten Vereinen",
    "subWeapon":"Zweitwaffe",
    "mainWeapon":"Hauptwaffe",
    "silofire":"Rakete abfeuern",

    "captureProperty.desc":"Besetzt das angegebene Geb&auml;ude. Wenn die Einheit die Eroberungspunkte dess Geb&auml;udes auf 0 senkt geht der Besitz auf den Eroberer &uuml;ber.",
    "unloadUnitFromTransporter.desc":"Die Einheit wird in den Transporter ausgeladen. Nach dem Ausladen k&ouml;nnen beide Einheitein keine Aktionen innerhalb des aktiven Zuges ausf&uuml;hren.",
    "loadUnitIntoTransporter.desc":"Die Einheit wird in den Transporter eingeladen.",
    "nextTurn.desc":"Beende Zug",
    "wait.desc":"Die Einheit beendet ihren Zug und kann danach innerhalb des aktiven Zuges nicht mehr benutzt werden.",
    "join.desc":"Zwei Einheiten werden zu einer vereint und f&uuml;gen ihre vorhandenen Lebenspunkte und Ressourcen zusammen.",
    "subWeapon.desc":"Angriff mit der Zweitwaffe der Einheit.",
    "mainWeapon.desc":"Angriff mit der Hauptwaffe der Einheit.",
    "silofire.desc":"Feuert eine Rakete auf ein Ziel ab welches mit einer Reichweite von 2 alle feindlichen Einheiten 2 HP Schaden zuf&uuml;gt.",

    "yes":"Ja",
    "no":"Nein",
    "ok":"Ok",
    "cancel": "Abbrechen",

    "done":"Fertig",
    "day":"Tag",
    "propertyCaptured":"Das Gebäude wurde erobert",
    "propertyPointsLeft":"Das Gebäude wird erobert... Punkte übrig:",

    "gameHasEnded":"Das Spiel ist vorbei, es existiert nur noch ein Team"
  },

  // ENGLISH
  en:{

    "INFT":"Infantry",
    "MECH":"Mechanized Infantry",
    "TANK":"Light Tank",
    "MDTK":"Battle Tank",
    "WRTK":"Heavy Tank",
    "ARTY":"Artillery",
    "RCKT":"Rocket Launcher",
    "RECN":"Reckon",
    "BIKE":"Bike",
    "AAIR":"Anti Air Tank",
    "APCR":"Support Tank",
    "MISS":"Missile",

    "PLIN":"Plain",
    "MNTN":"Mountain",
    "FRST":"Forrest",

    "captureProperty":"Capture Property",
    "unloadUnitFromTransporter":"Unload Unit",
    "loadUnitIntoTransporter":"Load Unit",
    "nextTurn":"End Turn",
    "wait":"Wait",
    "join":"Join Units",
    "subWeapon":"Sub Weapon",
    "mainWeapon":"Main Weapon",
    "silofire":"Launch Rocket",

    "yes":"Yes",
    "no":"No",
    "ok":"Ok",
    "cancel": "Cancel",

    "done":"Done",
    "day":"Day",
    "propertyCaptured":"The property was captured",
    "propertyPointsLeft":"Property capturing... Left points:",

    "gameHasEnded":"The game has ended because only one team is left"
  }
};
// TODO THIS DATA IS THE DEFAULT MOD DATA
// 

CWT_MOD_DEFAULT.movetypes = [

    {
      "ID"            : "MV_INFANTRY",
      "costs"         : {
        "MNTN"      : 2,
        "WATER"         : 0,
        "REEF"          : 0,
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_BAZOOKA",
      "costs"         :{
        "WATER"         : 0,
        "REEF"          : 0,
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_TIRE_A",
      "costs"         :{
        "PLIN"          : 2,
        "FRST"          : 3,
        "MNTN"          : 0,
        "RIVER"         : 0,
        "WATER"         : 0,
        "REEF"          : 0,
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_TIRE_B",
      "costs"         :{
        "FRST"        : 3,
        "MNTN"      : 0,
        "RIVER"         : 0,
        "WATER"         : 0,
        "REEF"          : 0,
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_TANK",
      "costs"         :{
        "FRST"        : 2,
        "MNTN"      : 0,
        "RIVER"         : 0,
        "WATER"         : 0,
        "REEF"          : 0,
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_AIR",
      "costs"         :{
        "*"             : 1
      }
    },

    {
      "ID"            : "MV_SHIP",
      "costs"         :{
        "WATER"         : 1,
        "RIVER"         : 1,
        "PORT"          : 1,
        "REEF"          : 2,
        "*"             : 0
      }
    },

    {
      "ID"            : "MV_WATER_TRANSPORT",
      "costs"         :{
        "WATER"         : 1,
        "RIVER"         : 1,
        "PORT"          : 1,
        "REEF"          : 2,
        "SHOAL"         : 1,
        "*"             : 0
      }
    }
];
CWT_MOD_DEFAULT.events = {

  isHidden: function( unit, tileType, lX, lY, tX, tY, distance ){
    if( tileType === 'FOREST' && distance > 1 ){
      if( unit.type === 'RECOON' ) return true;
      return false;
    }
    return true;
  },

  moveRange: function( unit, x, y, range ){
    if( cwt.player(unit.owner).name === 'BlackCat' ){
      return range+1; // TEST IT :P
    }
  }
}
CWT_MOD_DEFAULT.tiles = [

    {
      "ID"                : "PLIN",
      "tags"              : []
    },

    {
      "ID"                : "FRST",
      "tags"              : [ "VISION_BLOCK" ]
    },

    {
      "ID"                : "MNTN",
      "tags"              : [ "" ]
    },

    {
      "ID"                : "CITY",
      "vision"            : 0,
      "capturePoints"     : 20,
      "funds"            : 1000,
      "repairs"           : {
        "*"             : 20
      },
      "tags"              : [ "PROPERTY" ]
    },

    {
      "ID"                : "BASE",
      "vision"            : 0,
      "capturePoints"     : 20,
      "funds"             : 1000,
      "repairs"           : {
        "*"               : 20
      },
      "builds"            : [
        "MV_INFANTRY",
        "MV_MECH",
        "MV_TIRE_A",
        "MV_TIRE_B",
        "MV_TANK"
      ]
    },

    {
      "ID"                : "APRT",
      "vision"            : 0,
      "capturePoints"     : 20,
      "funds"            : 1000,
      "repairs"           : {
        "*"             : 20
      },
      "builds"            : [ "AIR" ],
      "tags"              : [ "PROPERTY", "FACTORY" ]
    },

    {
      "ID"                : "PORT",
      "vision"            : 0,
      "capturePoints"     : 20,
      "funds"            : 1000,
      "repairs"           : {
        "*"             : 20
      },
      "builds"            : [ "SHIP" ],
      "tags"              : [ "PROPERTY", "FACTORY" ]
    },

    {
      "ID"                : "SILO",
      "vision"            : 0
    },

    {
      "ID"                : "SILO_EMPTY",
      "vision"            : 0
    },

    {
      "ID"                : "HQTR",
      "vision"            : 1,
      "capturePoints"     : 20,
      "funds"            : 1000,
      "repairs"           : {
        "*"             : 20
      },
      "tags"              : [ "PROPERTY", "HQ" ]
    },

    {
      "ID"                : "RADAR",
      "vision"            : 4,
      "capturePoints"     : 20,
      "tags"              : [ "PROPERTY", "SCOUT" ]
    },

    {
      "ID"                : "STREET",
      "tags"              : []
    },

    {
      "ID"                : "RIVER",
      "tags"              : []
    },

    {
      "ID"                : "WATER",
      "tags"              : []
    },

    {
      "ID"                : "REEF",
      "tags"              : [ "VISION_BLOCK" ]
    },

    {
      "ID"                : "SHOAL",
      "tags"              : [ "VISION_BLOCK" ]
    }
];
CWT_MOD_DEFAULT.units = [

    {
      "ID"            : "INFT",

      "cost"          : 1000,

      "moveRange"     : 3,
      "moveType"      : "MV_INFANTRY",
      "vision"        : 2,
      "maxFuel"       : 99,

      "captures"      : 10,
      "weight"        : 1,

      "maxAmmo"       : 0,
      "mainWeapon"    : "WP_MG"
    },

    {
      "ID"            : "MECH",

      "cost"          : 3000,

      "moveRange"     : 2,
      "moveType"      : "MV_MECH",
      "vision"        : 2,
      "maxFuel"       : 70,

      "captures"      : 10,
      "weight"        : 1,

      "maxAmmo"       : 3,
      "mainWeapon"    : "WP_BAZOOKA",
      "subWeapon"     : "WP_MG2"
    },

    {
      "ID"            : "RECN",

      "cost"          : 4000,

      "moveRange"     : 8,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 5,
      "maxFuel"       : 80,

      "weight"        : 1,

      "maxAmmo"       : 0,

      "mainWeapon"    : "WP_MG"
    },

    {
      "ID"            : "BIKE",

      "cost"          : 2500,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_B",
      "vision"        : 2,
      "maxFuel"       : 70,
      "captures"      : 10,

      "weight"        : 1,

      "maxAmmo"       : 0,

      "mainWeapon"    : "WP_MG"
    },

    {
      "ID"            : "TANK",

      "cost"          : 7000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 70,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_LT_CANNON",
      "subWeapon"     : "WP_MG"
    },

  /*
    {
      "ID"            : "ATNK",

      "cost"          : 11000,

      "moveRange"     : 4,
      "moveType"      : "MV_TIRE_B",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AT_CANNON"
    },
*/

    {
      "ID"            : "MDTK",

      "cost"          : 12000,

      "moveRange"     : 5,
      "moveType"      : "MV_TANK",
      "vision"        : 2,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 5,

      "mainWeapon"    : "WP_MD_CANNON",
      "subWeapon"     : "WP_MG"
    },

    {
      "ID"            : "WRTK",

      "cost"          : 16000,

      "moveRange"     : 4,
      "moveType"      : "MV_TANK",
      "vision"        : 1,
      "maxFuel"       : 50,

      "weight"        : 3,

      "maxAmmo"       : 3,

      "mainWeapon"    : "WP_HV_CANNON",
      "subWeapon"     : "WP_MG"
    },

    {
      "ID"            : "AAIR",

      "cost"          : 7000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 60,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AA_CANNON",
      "subWeapon"     : "WP_MG"
    },

    {
      "ID"            : "ARTY",

      "cost"          : 6000,

      "moveRange"     : 5,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_HOWITZER"
    },

    {
      "ID"            : "APCR",

      "cost"          : 5000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 0,

      "transport"     : {
        "canLoad"   : [ "MV_INFANTRY","MV_MECH" ],
        "maxWeight" : 2
      },

      "supply"        : ["*"]
    },

    {
      "ID"            : "BCTR",

      "cost"          : 9000,

      "moveRange"     : 6,
      "moveType"      : "MV_AIR",
      "vision"        : 2,
      "maxFuel"       : 99,

      "weight"        : 1,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AG_RKL",
      "subWeapon"     : "WP_MG"
    },

    {
      "ID"            : "BKBM",

      "cost"          : 20000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 3,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_BOMBS"
    },

    {
      "ID"            : "TCTR",

      "cost"          : 5000,

      "moveRange"     : 6,
      "moveType"      : "MV_AIR",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 2,

      "maxAmmo"       : 0,
      "weapons"       : [],

      "transport"     : {
        "canLoad"   : [ "MV_INFANTRY" ],
        "maxWeight" : 2
      }
    },

    {
      "ID"            : "SUBM",

      "cost"          : 20000,

      "moveRange"     : 6,
      "moveType"      : "MV_SHIP",
      "vision"        : 5,
      "maxFuel"       : 70,

      "weight"        : 1,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_TORPEDO"
    },

    {
      "ID"            : "CRUS",

      "cost"          : 16000,

      "moveRange"     : 5,
      "moveType"      : "MV_WATER_TRANSPORT",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 9,

      "mainWeapon"    : "WP_WATERBOMBS",
      "subWeapon"     : "WP_AA_GUN_CRUS",

      "transport"     : {
        "canLoad"   : [ "MV_AIR" ],
        "maxWeight" : 2
      }
    },

    {
      "ID"            : "MISS",

      "cost"          : 12000,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AA_RKL"
    },

    {
      "ID"            : "FGTR",

      "cost"          : 20000,

      "moveRange"     : 9,
      "moveType"      : "MV_AIR",
      "vision"        : 5,
      "maxFuel"       : 99,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AA_JETROCKET"
    },

/*
    {
      "ID"            : "DUST",

      "cost"          : 13000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 4,
      "maxFuel"       : 45,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_PLANE_CANNON",
      "subWeapon"     : "WP_MG"
    },*/

  /*
    {
      "ID"            : "SEAP",

      "cost"          : 15000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 4,
      "maxFuel"       : 99,

      "weight"        : 2,

      "maxAmmo"       : 4,

      "mainWeapon"    : "WP_WATERBOMBS",
      "subWeapon"     : "WP_PLANE_CANNON"

    },
    */

    {
      "ID"            : "ACAR",

      "cost"          : 28000,

      "moveRange"     : 5,
      "moveType"      : "MV_SHIP",
      "vision"        : 4,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 0,

      "mainWeapon"    : "WP_AA_SHIPCANNON",

      "transport"     : [ "MV_AIR" ],
      "canLoad"       : 2
    },

    {
      "ID"            : "LNDR",

      "cost"          : 10000,

      "moveRange"     : 6,
      "moveType"      : "MV_WATER_TRANSPORT",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 3,

      "transport"     : {
        "canLoad"   : [ "MV_INFANTRY","MV_TIRE_A","MV_TIRE_B","MV_TANK" ],
        "maxWeight" : 1
      }
    },

    {
      "ID"            : "RCKT",

      "cost"          : 15000,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 3,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 5,

      "mainWeapon"    : "WP_HV_RKL"
    },

    {
      "ID"            : "BSHP",

      "cost"          : 25000,

      "moveRange"     : 5,
      "moveType"      : "MV_SHIP",
      "vision"        : 3,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_SHIP_HOWITZER"
    }

];
CWT_MOD_DEFAULT.weapons = [

  {
    "ID"            : "WP_MG",
    "useAmmo"       : 0,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "INFT":55,
      "MECH":45,
      "AAIR":5,
      "APCR":14,
      "ARTY":15,
      "BCTR":7,
      "TANK":5,
      "MDTK":1,
      "WRTK":1,
      "NTKN":1,
      "PRNR":5,
      "RECN":12,
      "RCKT":25,
      "TCTR":30,
      "MISS":26
    }
  },

  {
    "ID"            : "WP_MG2",
    "useAmmo"       : 0,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "INFT":65,
      "MECH":55,
      "AAIR":5,
      "APCR":14,
      "ARTY":15,
      "BCTR":9,
      "TANK":5,
      "MDTK":1,
      "WRTK":1,
      "NTKN":1,
      "PRNR":5,
      "RECN":12,
      "RCKT":25,
      "TCTR":35,
      "MISS":26
    }
  },

  {
    "ID"            : "WP_BAZOOKA",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "AAIR":65,
      "APCR":75,
      "ARTY":70,
      "TANK":55,
      "MDTK":15,
      "WRTK":5,
      "NTKN":15,
      "PRNR":55,
      "RECN":85,
      "RCKT":85,
      "MISS":85
    }
  },

  {
    "ID"            : "WP_LT_CANNON",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "INFT":75,
      "MECH":70,
      "AAIR":65,
      "APCR":75,
      "ARTY":70,
      "BSHP":1,
      "ACAR":1,
      "CRUS":5,
      "LNDR":10,
      "TANK":55,
      "MDTK":15,
      "WRTK":10,
      "NTKN":15,
      "PRNR":55,
      "RECN":85,
      "RCKT":85,
      "TCTR":40,
      "SUBM":1,
      "MISS":85
    }
  },

  {
    "ID"            : "WP_HV_AT",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 3,
    "fireType"      : "DIRECT",
    "damages"       :{
      "*"           : 0
    }
  },

  {
    "ID"            : "WP_MD_CANNON",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{

      "INFT":105,
      "MECH":95,

      "AAIR":105,
      "APCR":105,
      "ARTY":105,

      "BCTR":12,
      "TCTR":45,

      "BSHP":10,
      "ACAR":10,
      "CRUS":45,
      "LNDR":35,
      "SUBM":10,

      "TANK":85,
      "MDTK":55,
      "NTKN":45,
      "WRTK":25,
      "PRNR":85,

      "RECN":105,
      "RCKT":105,
      "MISS":105
    }
  },

  {
    "ID"            : "WP_HV_CANNON",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{

      "INFT":135,
      "MECH":125,

      "AAIR":195,
      "APCR":195,
      "ARTY":195,

      "BCTR":22,
      "TCTR":55,

      "BSHP":45,
      "ACAR":45,
      "CRUS":65,
      "LNDR":75,
      "SUBM":45,

      "TANK":180,
      "MDTK":125,
      "NTKN":115,
      "WRTK":65,
      "PRNR":180,

      "RECN":195,
      "RCKT":195,
      "MISS":195
    }
  },

  {
    "ID"            : "WP_AA_CANNON",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{

      "INFT":105,
      "MECH":105,

      "AAIR":45,
      "APCR":50,
      "ARTY":50,

      "BCTR":120,
      "FGTR":65,
      "TCTR":120,
      "BMBR":75,
      "BKBM":120,
      "STHL":75,

      "TANK":25,
      "MDTK":10,
      "NTKN":5,
      "WRTK":1,
      "PRNR":25,

      "RECN":60,
      "RCKT":55,
      "MISS":55
    }
  },

  {
    "ID"            : "WP_HOWITZER",
    "useAmmo"       : 1,
    "minRange"      : 2,
    "maxRange"      : 3,
    "fireType"      : "INDIRECT",
    "damages"       :{

      "INFT":90,
      "MECH":85,

      "AAIR":75,
      "APCR":70,
      "ARTY":75,

      "BSHP":40,
      "ACAR":45,
      "CRUS":65,
      "LNDR":55,
      "SUBM":60,

      "TANK":70,
      "MDTK":45,
      "NTKN":40,
      "WRTK":15,
      "PRNR":70,

      "RECN":80,
      "RCKT":80,
      "MISS":80
    }
  },

  {
    "ID"            : "WP_AG_RKL",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{

      "INFT":75,
      "MECH":75,

      "AAIR":25,
      "APCR":60,
      "ARTY":65,

      "BCTR":65,
      "TCTR":95,

      "BSHP":25,
      "ACAR":25,
      "CRUS":55,
      "LNDR":25,
      "SUBM":25,

      "TANK":55,
      "MDTK":25,
      "NTKN":20,
      "WRTK":10,
      "PRNR":55,

      "RECN":55,
      "RCKT":65,
      "MISS":65
    }
  },

  {
    "ID"            : "WP_BOMBS",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "INFT":110,
      "MECH":110,

      "AAIR":95,
      "APCR":105,
      "ARTY":105,

      "BSHP":75,
      "ACAR":75,
      "CRUS":85,
      "LNDR":95,
      "SUBM":95,

      "TANK":105,
      "MDTK":95,
      "NTKN":35,
      "WRTK":25,
      "PRNR":105,

      "RECN":105,
      "RCKT":105,
      "MISS":105
    }
  },

  {
    "ID"            : "WP_TORPEDO",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "BSHP":55,
      "ACAR":75,
      "CRUS":25,
      "LNDR":95,
      "SUBM":55
    }
  },

  {
    "ID"            : "WP_WATERBOMBS",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "SUBM":90
    }
  },

  {
    "ID"            : "WP_AA_GUN_CRUS",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "BCTR":115,
      "TCTR":115,
      "STLH":100,
      "BKBM":120,
      "BMBR":65,
      "ACAR":5,
      "FGTR":55
    }
  },

  {
    "ID"            : "WP_AA_RKL",
    "useAmmo"       : 1,
    "minRange"      : 3,
    "maxRange"      : 6,
    "fireType"      : "INDIRECT",
    "damages"       :{
      "BCTR":120,
      "TCTR":120,
      "STLH":100,
      "BKBM":120,
      "BMBR":100,
      "FGTR":100
    }
  },

  {
    "ID"            : "WP_AA_JETROCKET",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "BCTR":100,
      "TCTR":100,
      "STLH":85,
      "BKBM":120,
      "BMBR":100,
      "FGTR":55
    }
  },

/*
  {
    "ID"            : "WP_PLANE_CANNON",
    "useAmmo"       : 1,
    "minRange"      : 1,
    "maxRange"      : 1,
    "fireType"      : "DIRECT",
    "damages"       :{
      "*"           : 0
    }
  },
*/

  {
    "ID"            : "WP_AA_SHIPCANNON",
    "useAmmo"       : -1,
    "minRange"      : 1,
    "maxRange"      : 3,
    "fireType"      : "DIRECT",
    "damages"       :{
      "BCTR":115,
      "TCTR":115,
      "STLH":100,
      "BKBM":120,
      "BMBR":100,
      "FGTR":100
    }
  },

  {
    "ID"            : "WP_HV_RKL",
    "useAmmo"       : 1,
    "minRange"      : 3,
    "maxRange"      : 5,
    "fireType"      : "DIRECT",
    "damages"       :{
      "INFT":95,
      "MECH":90,

      "AAIR":85,
      "APCR":80,
      "ARTY":80,

      "BSHP":55,
      "ACAR":60,
      "CRUS":85,
      "LNDR":60,
      "SUBM":85,

      "TANK":80,
      "MDTK":55,
      "NTKN":50,
      "WRTK":25,
      "PRNR":80,

      "RECN":90,
      "RCKT":85,
      "MISS":90
    }
  },

  {
    "ID"            : "WP_SHIP_HOWITZER",
    "useAmmo"       : 1,
    "minRange"      : 3,
    "maxRange"      : 6,
    "fireType"      : "INDIRECT",
    "damages"       :{
      "INFT":95,
      "MECH":90,

      "AAIR":85,
      "APCR":80,
      "ARTY":80,

      "BSHP":50,
      "ACAR":60,
      "CRUS":95,
      "LNDR":95,
      "SUBM":95,

      "TANK":80,
      "MDTK":55,
      "NTKN":50,
      "WRTK":25,
      "PRNR":80,

      "RECN":90,
      "RCKT":85,
      "MISS":90
    }
  }
];