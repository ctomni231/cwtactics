util.scoped(function(){
  
  var spriteAnimation = {};
  
  var spriteAnimators_ = [];
  
  /**
   *
   */
  view.registerSpriteAnimator = function( key, steps, timePerStep, updatorFn ){
    
    var holder = {};
    holder.stps = steps;
    holder.tps = timePerStep;
    holder.upt = updatorFn;
    holder.step = 0;
    holder.time = 0;
    
    spriteAnimation[key] = holder;
    spriteAnimators_.push( holder );
  };
  
  /**
   *
   */
  view.getSpriteStep = function( key ){
    return spriteAnimation[key].step;
  };
  
  /**
   *
   */
  view.updateSpriteAnimations = function( delta ){
    for( var i=0,e=spriteAnimators_.length; i<e; i++ ){
      
      var anim = spriteAnimators_[i];
      anim.time += delta;
      if( anim.time >= anim.tps ){
        
        // INCREASE STEP AND RESET TIMER
        anim.time = 0;
        anim.step++;
        
        if( anim.step >= anim.stps ){
          anim.step = 0;
        }
        
        // CALL UPDATER
        anim.upt();
      }
    }
  };
  
});

util.scoped(function(){
  
  // CACHE
  var selection = controller.stateMachine.data.selection;
  
  view.registerSpriteAnimator( "SELECTION", 7, 150, function(){
    var state = controller.stateMachine.state;
    if( state !== "MOVEPATH_SELECTION" &&
        state !== "ACTION_SELECT_TARGET_A" &&
        state !== "ACTION_SELECT_TARGET_B" &&
        !controller.attackRangeVisible ) return;
    
    var x  = 0;
    var yS = 0;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    
    // ITERATE THROUGH THE SCREEN
    for( ; x<xe; x++ ){
      for( var y=yS ; y<ye; y++ ){
        if( selection.getValueAt( x, y ) > -1 ){
          
        // TODO : do not check all 
          view.markForRedraw( x,y );
        }
      }
    }
  });
});

view.registerSpriteAnimator( "STATUS", 20, 375, function(){
  
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

view.registerSpriteAnimator( "ANIM_TILES", 4, 300, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  
  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      
      // TODO : cache list with animated tiles
      if( view.animatedTiles[ view.mapImages[x][y] ] ){
        view.markForRedraw( x,y );
      }
    }
  }
});