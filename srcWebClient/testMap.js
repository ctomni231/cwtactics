// SIMPLE TEST MAP
var testMap = {

  height: 70,
  width: 70,
  filler: "PLAIN",

  players:[
    { name:"Player 1", gold:1000 , team:1 },
    { name:"Player 2", gold:0    , team:2 }
  ],

  data:{
    "0":{ "4":"FOREST",
      "5":"PLAIN",
      "6":"PLAIN",
      "7":"MOUNTAIN" },
    "1":{ "4":"FOREST",
      "5":"PLAIN",
      "6":"FOREST",
      "7":"FOREST" },
    "2":{ "3":"FOREST",
      "4":"MOUNTAIN",
      "7":"FOREST" },
    "8":{ "7":"PLAIN",
      "8":"MOUNTAIN" },
    "9":{ "5":"PLAIN",
      "6":"PLAIN",
      "7":"MOUNTAIN",
      "8":"FOREST" }
  },

  properties:[
    { x:0, y:5, type:"HQ", capturePoints:20, owner:0 },
    { x:0, y:6, type:"CITY", capturePoints:20, owner:0 },
    { x:1, y:5, type:"FACTORY", capturePoints:20, owner:0 },
    { x:8, y:7, type:"HQ", capturePoints:20, owner:1 },
    { x:9, y:5, type:"FACTORY", capturePoints:20, owner:1 },
    { x:9, y:6, type:"CITY", capturePoints:20, owner:1 }
  ],

  units:[
    { x:2, y:2, type:"LTANK" , owner:0, fuel:50 },
    { x:2, y:5, type:"LTANK" , owner:0, fuel:1 },
    { x:2, y:7, type:"INFANTRY" , owner:0, fuel:50 },
    { x:2, y:9, type:"LTANK" , owner:0, fuel:50 },
    { x:6, y:10, type:"INFANTRY" , owner:1, fuel:50 },
    { x:3, y:14, type:"INFANTRY" , owner:1, fuel:50 },
    { x:12, y:7, type:"LTANK"      , owner:1, fuel:50 },
    { x:11, y:9, type:"LTANK"     , owner:1, fuel:50 },
    { x:7, y:6, type:"LTANK", owner:1, fuel:50 }
  ]
};

// populate some units
/*
for(var x= 15; x<=60; x+=2) {
  for(var y= 0; y<=30; y+=2) {
    testMap.units.push({
      x:x,
      y:y,
      type: (Math.random() > 0.5)? "LTANK": "INFANTRY",
      owner:0,
      fuel:50
    });
  }
};
*/

/*
// populate some random data
var keys = ["PLAIN","PLAIN","PLAIN","PLAIN","PLAIN","FOREST","MOUNTAIN"];
for(var y=0,ye=testMap.height; y<ye; y++){
  for(var x=0,xe=testMap.width; x<xe; x++){

    if( testMap.data[x] === undefined ||
        testMap.data[x][y] === undefined  ){

      var i = parseInt( keys.length*Math.random() , 10);

      if( testMap.data[x] === undefined ) testMap.data[x] = {};
      testMap.data[x][y] = keys[ i ];
    }
  }
};
*/