cwt.CoSheet.registerSheet({
  "ID"       : "SAMI",
  "faction"  : "ORST",
  "music"    : cwt.MOD_PATH+"music/sami.mp3",
  "coStars"  : 3,
  "scoStars" : 5
  /*
  "d2d"      : [
    {
      "$when":[
        "ATTACK_TYPE",["DIRECT"]
      ],
      "att":-10
    },
    {
      "$when":[
        "MOVE_TYPE",["MV_INFT","MV_MECH"]
      ],
      "att":30,
      "movepoints":1,
      "captureRate":50
    }
  ],
  "cop" : {
    "turn":[
      {
        "$when":[
          "MOVE_TYPE",["MV_INFT","MV_MECH"]
        ],
        "att":40,
        "movepoints":1
      }
    ],
    "power":{}
  },
  "scop" : {
    "turn":[
      {
        "$when":[
          "MOVE_TYPE",["MV_INFT","MV_MECH"]
        ],
        "att":70,
        "movepoints":2,
        "captureRate":9999
      }
    ],
    "power":{}
  }
  */
});