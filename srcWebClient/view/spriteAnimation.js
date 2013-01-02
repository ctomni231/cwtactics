view.spriteAnimation = {};

view._spriteAnimators = [];

view.registerSpriteAnimator = function( key, steps, timePerStep, updatorFn ){

  var holder = {};
  holder._stps = steps;
  holder._tps = timePerStep;
  holder._upt = updatorFn;
  holder.step = 0;
  holder.time = 0;

  view.spriteAnimation[key] = holder;
  view._spriteAnimators.push( holder );
};

view.getSpriteStep = function( key ){
  return view.spriteAnimation[key].step;
};

view.updateSpriteAnimations = function( delta ){
  var list = view._spriteAnimators;
  for( var i=0,e=list.length; i<e; i++ ){

    var anim = list[i];
    anim.time += delta;
    if( anim.time >= anim._tps ){

      // INCREASE STEP AND RESET TIMER
      anim.time = 0;
      anim.step++;

      if( anim.step >= anim._stps ){
        anim.step = 0;
      }

      // CALL UPDATER
      anim._upt();
    }
  }
};

// ---------------------------------------------------------------------------

view.registerSpriteAnimator( "SELECTION", 7, 150, function(){
  if( controller.input.state() !== "MOVEPATH_SELECTION" &&
      controller.input.state() !== "ACTION_SELECT_TARGET"  ) return;

  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  // ITERATE THROUGH THE SCREEN
  var selectData = controller.input.selectionData;
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( selectData.getPositionValue( x, y ) > -1 ){

        view.markForRedraw( x,y );
      }
    }
  }
});

view.registerSpriteAnimator( "STATUS", 8, 375, function(){

});

view.registerSpriteAnimator( "UNIT", 3, 250, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( model.unitPosMap[x][y] !== null ){
        view.markForRedrawWithNeighbours(x,y);
      }
    }
  }
});

view.registerSpriteAnimator( "PROPERTY", 4, 400, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( model.propertyPosMap[x][y] !== null ){
        view.markForRedrawWithNeighbours(x,y);
      }
    }
  }
});