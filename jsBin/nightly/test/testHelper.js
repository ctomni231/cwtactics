var evalAllActions = function(){
  while( !controller.noNextActions() ){
    controller.doNextAction();
  }
};

var loadTestMap = function(){ 
  controller.actions.loadGame( testMap ); 
  controller.stateMachine.event("__reset__");
};

var simplePropertyAction = function( sx,sy, actKey, subActKey ){  
  controller.stateMachine.event( "action", sx,sy );
  
  var menuIndex;
  menuIndex = controller.stateMachine.data.menu.indexOf( actKey );  
  gt( menuIndex, -1, "action "+actKey+" must be available in the menu" );
  controller.stateMachine.event( "action", menuIndex );
  
  if( arguments.length > 3 && arguments[3] !== null ){
    
    menuIndex = controller.stateMachine.data.menu.indexOf( subActKey );
    gt( menuIndex, -1, "action "+subActKey+" must be available in the menu" );
    controller.stateMachine.event( "action", menuIndex );
  };
  
  evalAllActions();
};

var simpleUnitAction = function( sx,sy, tx,ty, actKey, subActKey, stx, sty ){
  unitByPosCanAct( sx,sy );
  
  controller.stateMachine.event( "action", sx,sy );
  controller.stateMachine.event( "action", tx,ty );
  
  // DOUBLE CLICK ON TARGET
  if( sx !== tx || sy !== ty ){
    controller.stateMachine.event( "action", tx,ty );
  }
  
  var menuIndex;
  
  menuIndex = controller.stateMachine.data.menu.indexOf( actKey );  
  gt( menuIndex, -1, "action "+actKey+" must be available in the menu" );
  controller.stateMachine.event( "action", menuIndex );
  
  if( arguments.length > 5 && arguments[5] !== null ){
    
    menuIndex = controller.stateMachine.data.menu.indexOf( subActKey );
    gt( menuIndex, -1, "action "+subActKey+" must be available in the menu" );
    controller.stateMachine.event( "action", menuIndex );
  };
  
  if( arguments.length > 6 ){
    controller.stateMachine.event( "action", stx,sty );
  }
  
  evalAllActions();
  
  if( sx !== tx || sy !== ty ){
    isNull( model.unitPosMap[sx][sy] , "start pos is not target pos, means unit should move" );
  }
  else{
    notNull( model.unitPosMap[sx][sy] , "start pos is not target pos, means unit not should move" );
  }
};

var unitByIdActableStatus = function( id, expected ){
  ok( model.canAct( id ) === expected , "unit should "+( expected? "": "not " )+"be able to act" );
};

var unitByPosCanAct = function( x,y ){
  
  var unit = model.unitPosMap[x][y];
  notNull( unit , "unit at given pos must exists" );
  
  var index = model.extractUnitId( unit );
  gt( index, -1, "unit must be extract able" );
  
  unitByIdActableStatus( index, true );
};

var unitByPosCannotAct = function( x,y ){
  
  var unit = model.unitPosMap[x][y];
  notNull( unit , "unit at given pos must exists" );
  
  var index = model.extractUnitId( unit );
  gt( index, -1, "unit must be extract able" );
  
  unitByIdActableStatus( index, false );
};