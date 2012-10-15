CWT_MOD_DEFAULT.units = [

    {
      "ID"            : "INFT_OS",

      "cost"          : 1000,

      "moveRange"     : 3,
      "moveType"      : "MV_INFANTRY",
      "vision"        : 2,
      "maxFuel"       : 99,

      "captures"      : 10,
      "weight"        : 1,

      "maxAmmo"       : 0,
      "mainWeapon"    : "WP_MG",

      "tags"          : [ "GROUND", "FOOT", "SOFT" ]
    },

    {
      "ID"            : "MECH_OS",

      "cost"          : 3000,

      "moveRange"     : 2,
      "moveType"      : "MV_MECH",
      "vision"        : 2,
      "maxFuel"       : 70,

      "captures"      : 10,
      "weight"        : 1,

      "maxAmmo"       : 3,
      "mainWeapon"    : "WP_BAZOOKA",
      "subWeapon"     : "WP_MG",

      "tags"          : [ "GROUND", "FOOT", "SOFT", "ANTI_TANK" ]
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

      "mainWeapon"    : "WP_MG",

      "tags"          : [ "GROUND", "VEHICLE", "FOOT", "SOFT" ]
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

      "mainWeapon"    : "WP_MG",

      "tags"          : [ "GROUND", "BIKE" ]
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
      "subWeapon"     : "WP_MG",

      "tags"          : [ "GROUND", "VEHICLE", "FOOT", "SOFT" ]
    },

    {
      "ID"            : "ATNK",

      "cost"          : 11000,

      "moveRange"     : 4,
      "moveType"      : "MV_TIRE_B",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_AT_CANNON",

      "tags"          : []
    },

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
      "subWeapon"     : "WP_MG",

      "tags"          : [ "GROUND", "TANK" ]
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
      "subWeapon"     : "WP_MG",

      "tags"          : []
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
      "subWeapon"     : "WP_MG",

      "tags"          : []
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

      "mainWeapon"    : "WP_HOWITZER",

      "tags"          : [ "INDIRECT_UNIT" ]
    },

    {
      "ID"            : "APCR",

      "cost"          : 5000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 99,

      "transport"     : {
        "canLoad"   : ["SOFT"],
        "maxWeight" : 2
      },

      "supply"        : ["SOFT","TANK","AIR","SHIP"],

      "tags"          : [ "TANK","SUPPLY","TRANSPORT" ]
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

      "mainWeapon"    : "WP_AG_ROCKET",
      "subWeapon"     : "WP_MG",

      "tags"          : [ "AIR", "COPTER" ]
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

      "mainWeapon"    : "WP_BOMBS",

      "tags"          : [ "AIR", "PLANE" ]
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
        "canLoad"   : ["SOFT"],
        "maxWeight" : 2
      },

      "tags"          : [ "AIR", "COPTER", "TRANSPORT" ]
    },

    {
      "ID"            : "BMBR",

      "cost"          : 20000,

      "moveRange"     : 5,
      "moveType"      : "MV_AIR",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 0,
      "weapons"       : [],

      "transport"     : {
        "canLoad"   : ["VEHICLE","SOFT","TANK"],
        "maxWeight" : 4
      },

      "tags"          : [ "AIR", "PLANE", "TRANSPORT" ]
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

      "mainWeapon"    : "WP_TORPEDO",

      "tags"          : [ "SUB", "SHIP", "STEALTH" ]
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

      "transport"     : {
        "canLoad"   : ["COPTER"],
        "maxWeight" : 2
      },


      "tags"          : [ "WATRER", "SHIP", "TRANSPORT" ]
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

      "mainWeapon"    : "WP_AA_ROCKET",

      "tags"          : [ "VEHICLE", "ANTI_AIR", "INDIRECT" ]
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

      "mainWeapon"    : "WP_AA_JETROCKET",

      "tags"          : [ "AIR", "PLANE", "ANTI_AIR" ]
    },

    {
      "ID"            : "DUST",

      "cost"          : 13000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 4,
      "maxFuel"       : 45,

      "weight"        : 2,

      "maxAmmo"       : 6,

      "mainWeapon"    : "WP_PLANET_CANNON",
      "subWeapon"     : "WP_MG",

      "tags"          : [ "AIR", "PLANE", "SCOUT" ]
    },

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
      "subWeapon"     : "WP_PLANE_CANNON",

      "tags"          : [ "AIR", "PLANE", "ANTI_AIR" ]

    },

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

      "transport"     : [ "AIR" ],
      "canLoad"       : 2,

      "tags"          : [ "WATER", "SHIP", "TRANSPORT" ]
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
        "canLoad"   : ["SOFT","VEHICLE","TANK"],
        "maxWeight" : 1
      },


      "tags"          : [ "WATER", "SHIP", "TRANSPORT" ]
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

      "mainWeapon"    : "WP_HV_ROCKET",

      "tags"          : [ "GROUND", "VEHICLE", "AT" ]
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

      "mainWeapon"    : "WP_SHIP_HOWITZER",

      "tags"          : [ "WATER", "SHIP", "INDIRECT", "AT" ]
    }

];