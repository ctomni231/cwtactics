require('../../sheets').commanders.registerSheet({
  "ID"       : "SAMI",
  "faction"  : "ORST",
  "music"    : "music/sami.mp3",
  
  "coStars"  : 3,
  "scoStars" : 5,
  
  "effects": {
    "D2D":{
      "att": [
        "if( infantry(unit), +(30,value),",
          "if( direct(unit), -(10,value),",
            "value )",
          "value )"
      ],
      "movepoints":	"if( transport(unit), +(1,value), value )",
      "captureRate": "+(50,value)"
    },
    "COP":{
      "movepoints": "if( infantry(unit), +(1,value), value )",
      "att": "if( infantry(unit), +(20,value), value )",
      "def": "+(10,value)"
    },
    "SCOP":{
      "movepoints": "if( infantry(unit), +(2,value), value )",
      "att": "if( infantry(unit), +(50,value), value )",
      "def": "+(10,value)",
      "captureRate": "+(999,value)"
    }
  }
});
