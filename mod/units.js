CWT_MOD_DEFAULT.units = [

    {
      "ID"            : "INFT",

      "cost"          : 1000,

      "moveRange"     : 3,
      "moveType"      : "MV_INFANTRY",
      "vision"        : 2,
      "maxFuel"       : 99,

      "canHide"       : true,
      
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

      "mainWeapon"    : "WP_MG3"
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

      "canHide"       : true,
      
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