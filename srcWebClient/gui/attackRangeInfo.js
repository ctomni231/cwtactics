util.scoped(function(){
  
  var tmpData = util.matrix(  
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    0 
  );
  
  controller.attackRangeVisible = false;
  
  controller.showAttackRangeInfo = function(){
    if( controller.attackRangeVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unitPosMap[x][y];
    if( unit === null ) return;
    var unitId = model.extractUnitId(unit);
    
    if( DEBUG ) util.log("show attack range information");
    
    var selection = controller.stateMachine.data.selection;
    
    selection.setCenter(x,y,CWT_INACTIVE_ID);
    
    if( model.isIndirectUnit( unitId) ){
      
      // CALCULATE ATTACKABLE TILES
      model.attackRangeMod_( unitId, x, y, selection );
    }
    else{
      
      // GET MOVE DATA
      controller.stateMachine.data.movePath.fillMoveMap( x,y, unit );
      selection.data.cloneValues( tmpData );
      selection.setCenter(x,y,CWT_INACTIVE_ID);
      
      // FOR EVERY MOVE TILE
      var e = tmpData.length;
      for (var ax = 0; ax < e; ax++) {
        for (var ay = 0; ay < e; ay++) {
          
          // IF MOVABLE
          if( tmpData[ax][ay] >= 0 ){
            
            // CALCULATE ATTACKABLE TILES
            model.attackRangeMod_( unitId, ax, ay, selection, true );
          }
        }
      }
    }
    
    controller.attackRangeVisible = true;
  };
  
  controller.hideAttackRangeInfo = function(){
    if( !controller.attackRangeVisible ) return;
    
    if( DEBUG ) util.log("hide attack range information");
    view.markSelectionMapForRedraw( controller.stateMachine.data );
    
    controller.attackRangeVisible = false;
  };
  
});