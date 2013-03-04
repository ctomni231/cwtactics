var testMap = {
  format:"2.6",
  day:1,
  turnOwner:0,
  mapHeight:10,
  mapWidth:10,
  rules:{},
  
  typeMap:[ "PLIN","MNTN","FRST" ],
  
  map:[
    [0,0,1,2,0,0,0,0,0,0],[0,0,2,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,2,0,0],[0,0,2,0,2,0,2,0,0,0],[0,0,0,0,0,0,0,0,0,0],
    [0,0,0,2,0,0,0,0,2,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]
  ],
  
  units:[
    [0,"TANK",2,2,99,1,20,-1,0],
    [1,"RECN",4,8,99,0,40,-1,0],
    [2,"INFT",6,3,99,0,15,-1,0],
    [3,"APCR",5,3,99,0,70,-1,0],
    [4,"INFT",4,3,99,0,15,-1,0],
    [5,"INFT",5,2,99,0,15,-1,0],
    
    [50,"INFT",8,8,20,0,20,-1,1],
    
    [101,"INFT",3,3,99,0,20,-1,2]
  ],
  leftActors:[0,1,2,3,4,5],
  
  properties:[
    [0,2,1,"HQTR",20,0],
    [1,2,4,"BASE",20,0],
    [2,1,2,"BASE",20,0],
    [8,4,2,"SILO",20,0],
    
    [3,7,7,"HQTR",20,1],
    [4,8,7,"BASE",20,1],
    [5,9,8,"BASE",20,1],
    
    [6,3,5,"HQTR",20,2],
    [7,4,5,"BASE",20,2]
  ],
  
  players:[
    [0,"Player 1"         ,10000,1],
    [1,"Player 2 (enemy)" ,10000,2],
    [2,"Player 3 (allied)",10000,1]
  ]
};

// -------------------

// DEBUG = false;

controller.actions.loadMod();
controller.stateMachine.event( "start" );

(function(){
  var resetFn = function(){ 
    return "IDLE"; 
  };
  
  var keys = Object.keys(controller.stateMachine.structure);
  for( var i=0, e=keys.length; i<e; i++ ){
    controller.stateMachine.structure[ keys[i] ].__reset__ = resetFn;
  }
})();