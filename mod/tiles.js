CWT_MOD_DEFAULT.tiles = [

    {
      "ID"                : "PLIN",
      "defense"           : 1,
      "tags"              : []
    },

    {
      "ID"                : "FRST",
      "defense"           : 2,
      "tags"              : [ "VISION_BLOCK" ]
    },

    {
      "ID"                : "MNTN",
      "defense"           : 5,
      "tags"              : [ "" ]
    },

    {
      "ID"                : "CITY",
      "vision"            : 0,
      "defense"           : 3,
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
      "defense"           : 4,
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
      "defense"           : 4,
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
      "defense"           : 4,
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
      "defense"           : 2,
      "vision"            : 0
    },

    {
      "ID"                : "SILO_EMPTY",
      "defense"           : 2,
      "vision"            : 0
    },

    {
      "ID"                : "HQTR",
      "vision"            : 0,
      "defense"           : 5,
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
      "defense"           : 4,
      "capturePoints"     : 20,
      "tags"              : [ "PROPERTY", "SCOUT" ]
    },

    {
      "ID"                : "STREET",
      "defense"           : 0,
      "tags"              : []
    },

    {
      "ID"                : "RIVER",
      "defense"           : 0,
      "tags"              : []
    },

    {
      "ID"                : "WATER",
      "defense"           : 0,
      "tags"              : []
    },

    {
      "ID"                : "REEF",
      "defense"           : 3,
      "tags"              : [ "VISION_BLOCK" ]
    },

    {
      "ID"                : "SHOAL",
      "defense"           : 0,
      "tags"              : [ "VISION_BLOCK" ]
    }
];