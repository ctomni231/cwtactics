// SIMPLE TEST MAP
var testMap = {

  height: 70,
  width: 70,
  filler: "PLIN",

  players:[

    { name:"Player 1", gold:1000 , team:1,
      units:[
        { x:2, y:2, type:"TANK"    , ammo:1, hp:60, owner:0, fuel:5 },
        { x:4, y:4, type:"APCR"    , ammo:5, hp:100, owner:0, fuel:25 },
        { x:5, y:2, type:"INFT_OS" , ammo:0, hp:100, owner:0, fuel:10 },
        { x:2, y:9, type:"TANK"    , ammo:5, hp:50, owner:0, fuel:50 }
      ]
    },

    { name:"Player 2", gold:0    , team:2,
      units:[
        { x:6, y:10, type:"INFT_OS" , ammo:0, hp:67, owner:1, fuel:50 },
        { x:3, y:14, type:"INFT_OS" , ammo:0, hp:29, owner:1, fuel:5 },
        { x:12, y:7, type:"TANK"    , ammo:5, hp:100, owner:1, fuel:50 },
        { x:11, y:9, type:"TANK"    , ammo:5, hp:100, owner:1, fuel:4 },
        { x:7, y:6, type:"TANK"     , ammo:5, hp:100, owner:1, fuel:15 }
      ]
    },

    { name:"Player 3 (allied)", gold:0    , team:1,
      units:[ { x:3, y:4, type:"TANK", ammo:6, hp:72, owner:2, fuel:50 } ]
    }
  ],

  data:{
    "0":{ "4":"FRST",
      "7":"MNTN" },
    "1":{ "4":"FRST",
      "6":"FRST",
      "7":"FRST" },
    "2":{ "3":"FRST",
      "4":"MNTN",
      "7":"FRST" },
    "8":{ 
      "8":"MNTN" },
    "9":{
      "7":"MNTN",
      "8":"FRST" }
  },

  properties:[
    { x:5, y:3, type:"SILO",    capturePoints:0 },
    { x:0, y:5, type:"HQ",      capturePoints:20, owner:0 },
    { x:0, y:6, type:"CITY",    capturePoints:20, owner:0 },
    { x:1, y:5, type:"FACTORY", capturePoints:20, owner:0 },
    { x:8, y:7, type:"HQ",      capturePoints:20, owner:1 },
    { x:9, y:5, type:"FACTORY", capturePoints:20, owner:1 },
    { x:9, y:6, type:"CITY",    capturePoints:20, owner:1 }
  ]
};