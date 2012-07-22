var _tmp_ = {
  "sheets" : [

    {
      "ID"            : "INFANTRY",

      "cost"          : 1000,

      "moveRange"     : 3,
      "moveType"      : "MV_INFANTRY",
      "vision"        : 2,
      "maxFuel"       : 99,

      "captures"      : 10,
      "weight"        : 1,

      "maxAmmo"       : 0,
      "weapons"       : [ "WP_MG" ],

      "tags"          : [ "GROUND", "FOOT", "SOFT" ]
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
      "weapons"       : [ "WP_BAZOOKA", "WP_MG" ],

      "tags"          : [ "GROUND", "FOOT", "SOFT", "ANTI_TANK" ]
    },

    {
      "ID"            : "RECKON",

      "cost"          : 4000,

      "moveRange"     : 8,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 5,
      "maxFuel"       : 80,

      "weight"        : 1,

      "maxAmmo"       : 0,
      "weapons"       : [ "WP_MG" ],

      "tags"          : [ "GROUND", "VEHICLE", "FOOT", "SOFT" ]
    },

    {
      "ID"            : "MOTORBIKE",

      "cost"          : 2500,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_B",
      "vision"        : 2,
      "maxFuel"       : 70,
      "captures"      : 10,

      "weight"        : 1,

      "maxAmmo"       : 0,
      "weapons"       : [ "WP_MG" ],

      "tags"          : [ "GROUND", "BIKE" ]
    },

    {
      "ID"            : "LTANK",

      "cost"          : 7000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 70,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_LT_CANNON", "WP_MG" ],

      "tags"          : [ "GROUND", "VEHICLE", "FOOT", "SOFT" ]
    },

    {
      "ID"            : "PAK",

      "cost"          : 11000,

      "moveRange"     : 4,
      "moveType"      : "MV_TIRE_B",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_AT_CANNON" ],

      "tags"          : []
    },

    {
      "ID"            : "MDTANK",

      "cost"          : 12000,

      "moveRange"     : 5,
      "moveType"      : "MV_TANK",
      "vision"        : 2,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 5,
      "weapons"       : [ "WP_MD_CANNON", "WP_MG" ],

      "tags"          : [ "GROUND", "TANK" ]
    },

    {
      "ID"            : "HTANK",

      "cost"          : 16000,

      "moveRange"     : 4,
      "moveType"      : "MV_TANK",
      "vision"        : 1,
      "maxFuel"       : 50,

      "weight"        : 3,

      "maxAmmo"       : 3,
      "weapons"       : [ "WP_HV_CANNON", "WP_MG" ],

      "tags"          : []
    },

    {
      "ID"            : "AATANK",

      "cost"          : 7000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 60,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_AA_CANN", "WP_MG" ],

      "tags"          : []
    },

    {
      "ID"            : "ARTILLERY",

      "cost"          : 6000,

      "moveRange"     : 5,
      "moveType"      : "MV_TANK",
      "vision"        : 3,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_HOWITZER" ],

      "tags"          : [ "INDIRECT_UNIT" ]
    },

    {
      "ID"            : "APC",

      "cost"          : 5000,

      "moveRange"     : 6,
      "moveType"      : "MV_TANK",
      "vision"        : 1,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 99,
      "weapons"       : [],

      "transport"     : {
        "canLoad"   : ["SOFT"],
        "maxWeight" : 2
      },

      "supply"        : ["SOFT","TANK","AIR","SHIP"],

      "tags"          : [ "TANK","SUPPLY","TRANSPORT" ]
    },

    {
      "ID"            : "BHELI",

      "cost"          : 9000,

      "moveRange"     : 6,
      "moveType"      : "MV_AIR",
      "vision"        : 2,
      "maxFuel"       : 99,

      "weight"        : 1,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_AG_ROCKET", "WP_MG" ],

      "tags"          : [ "AIR", "COPTER" ]
    },

    {
      "ID"            : "BOMB",

      "cost"          : 20000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 3,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_BOMBS" ],

      "tags"          : [ "AIR", "PLANE" ]
    },

    {
      "ID"            : "THELI",

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
      "ID"            : "WARPLANE",

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
      "ID"            : "SUB",

      "cost"          : 20000,

      "moveRange"     : 6,
      "moveType"      : "MV_SHIP",
      "vision"        : 5,
      "maxFuel"       : 70,

      "weight"        : 1,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_TORPEDO" ],

      "tags"          : [ "SUB", "SHIP", "STEALTH" ]
    },

    {
      "ID"            : "CRUISER",

      "cost"          : 16000,

      "moveRange"     : 5,
      "moveType"      : "MV_WATER_TRANSPORT",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 9,
      "weapons"       : [ "WP_WATERBOMBS" ],

      "transport"     : {
        "canLoad"   : ["COPTER"],
        "maxWeight" : 2
      },


      "tags"          : [ "WATRER", "SHIP", "TRANSPORT" ]
    },

    {
      "ID"            : "AAROCKET",

      "cost"          : 12000,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 2,
      "maxFuel"       : 40,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_AA_ROCKET" ],

      "tags"          : [ "VEHICLE", "ANTI_AIR", "INDIRECT" ]
    },

    {
      "ID"            : "JET",

      "cost"          : 20000,

      "moveRange"     : 9,
      "moveType"      : "MV_AIR",
      "vision"        : 5,
      "maxFuel"       : 99,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_AA_JETROCKET" ],

      "tags"          : [ "AIR", "PLANE", "ANTI_AIR" ]
    },

    {
      "ID"            : "DUSTER",

      "cost"          : 13000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 4,
      "maxFuel"       : 45,

      "weight"        : 2,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_PLANE_CANNON", "WP_MG" ],

      "tags"          : [ "AIR", "PLANE", "SCOUT" ]
    },

    {
      "ID"            : "SHIP_PLANE",

      "cost"          : 15000,

      "moveRange"     : 7,
      "moveType"      : "MV_AIR",
      "vision"        : 4,
      "maxFuel"       : 99,

      "weight"        : 2,

      "maxAmmo"       : 4,
      "weapons"       : [ "WP_WATERBOMBS", "WP_PLANE_CANNON" ],

      "tags"          : [ "AIR", "PLANE", "ANTI_AIR" ]

    },

    {
      "ID"            : "CARRIER",

      "cost"          : 28000,

      "moveRange"     : 5,
      "moveType"      : "MV_SHIP",
      "vision"        : 4,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 0,
      "weapons"       : [ "WP_AA_SHIPCANNON" ],

      "transport"     : [ "AIR" ],
      "canLoad"       : 2,

      "tags"          : [ "WATER", "SHIP", "TRANSPORT" ]
    },

    {
      "ID"            : "LANDER",

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
      "ID"            : "ROCKET",

      "cost"          : 15000,

      "moveRange"     : 5,
      "moveType"      : "MV_TIRE_A",
      "vision"        : 3,
      "maxFuel"       : 50,

      "weight"        : 2,

      "maxAmmo"       : 5,
      "weapons"       : [ "WP_HV_ROCKET" ],

      "tags"          : [ "GROUND", "VEHICLE", "AT" ]
    },

    {
      "ID"            : "BSHIP",

      "cost"          : 25000,

      "moveRange"     : 5,
      "moveType"      : "MV_SHIP",
      "vision"        : 3,
      "maxFuel"       : 99,

      "weight"        : 3,

      "maxAmmo"       : 6,
      "weapons"       : [ "WP_SHIP_HOWITZER" ],

      "tags"          : [ "WATER", "SHIP", "INDIRECT", "AT" ]
    }

  ]
};

for( var i = 0; i<_tmp_.sheets.length; i++ ){
  app.module("db").parse( _tmp_.sheets[i], app.module("db").types.UNIT );
}