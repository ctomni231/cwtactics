require('../../sheets').commanders.registerSheet({

  "ID": "ANDY",
  "faction": "ORST",
  "music": "music/Andy.mp3",
  "coStars": 3,
  "scoStars": 3,
  
  "effects": {
    "COP":{
      "POWER": "forEach(unitList(player),repair(20))"
    },
    "SCOP":{
      "POWER": "forEach(unitList(player),repair(50))",
      "att": 				"+(30,value)",
      "def": 				"+(10,value)",
      "movepoints":	"+(1,value)"
    }
  }
});

