require('../../sheets').commanders.registerSheet({

  "ID"       : "MAX",
  "faction"  : "BLMN",
  "music"    : "music/Max.mp3",
  "coStars"  : 3,
  "scoStars" : 3,
  
  "effects": {
    
    "D2D":{
      "att": [
        "if( direct(unit),",
          "if(not(infantry(unit)),",
            "if(gameMode(AW2),",
              "+(50,value),",
              "+(20,value))),",
          "-(10,value))"
      ],
      "maxrange": "if( indirect(unit), -(1,value), value)"
    },
	  
    "COP":{
      "att": [
        "if( direct(unit),",
          "if(not(infantry(unit)),",
            "+(40,value), ",
            "value),",
          "value)"
      ],
      "def":				"+(10,value)"
      "movepoints":	"if( gameMode(AW2), +(1,value), value)"
    },
    
    "SCOP":{
      "att": [
        "if( direct(unit),",
          "if(not(infantry(unit)),",
            "+(70,value), ",
            "value),",
          "value)"
      ],
      "def":				"+(10,value)"
      "movepoints":	"if( gameMode(AW2), +(2,value), value)"
    }
  }
});

