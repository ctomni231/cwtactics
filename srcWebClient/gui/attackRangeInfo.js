util.scoped(function(){
  
  var tmpData = util.matrix(  
    MAX_SELECTION_RANGE * 4 + 1,
    MAX_SELECTION_RANGE * 4 + 1,
    0 
  );
  
  controller.attackRangeVisible = false;
  
  controller.showAttackRangeInfo = function(){
    if( controller.attackRangeVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unit_posData[x][y];
    if( unit === null ) return;
    var unitId = model.unit_extractId(unit);
    
    if( DEBUG ) util.log("show attack range information");
    
    var selection = controller.stateMachine.data.selection;
    
    selection.setCenter(x,y, INACTIVE_ID);
    
    if( model.battle_isIndirectUnit( unitId) ){
      
      // CALCULATE ATTACKABLE TILES
      model.battle_calculateTargets( unitId, x, y, selection );
    }
    else{
      
      // GET MOVE DATA
      controller.stateMachine.data.movePath.move_fillMoveMap( x,y, unit );
      selection.data.cloneValues( tmpData );
      selection.setCenter(x,y, INACTIVE_ID);
      
      // FOR EVERY MOVE TILE
      var e = tmpData.length;
      for (var ax = 0; ax < e; ax++) {
        for (var ay = 0; ay < e; ay++) {
          
          // IF MOVABLE
          if( tmpData[ax][ay] >= 0 ){
            
            // CALCULATE ATTACKABLE TILES
            model.battle_calculateTargets( unitId, ax, ay, selection, true );
          }
        }
      }
    }
    
    controller.attackRangeVisible = true;
  };
  
  controller.hideAttackRangeInfo = function(){
    if( !controller.attackRangeVisible ) return;
    
    if( DEBUG ) util.log("hide attack range information");
    view.redraw_markSelection( controller.stateMachine.data );
    
    controller.attackRangeVisible = false;
  };
  
});
