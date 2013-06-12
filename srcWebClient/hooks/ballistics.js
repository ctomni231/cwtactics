util.scoped(function(){
  
  var expl_img;
  
  function renderSmoke( x,y, step, distance ){
    step -= (distance-1);
    if( step < 0 || step > 9 ) return;
    
    var tileSize = TILE_LENGTH;
    var scx = 48*step;
    var scy = 0;
    var scw = 48;
    var sch = 48;
    var tcx = (x)*tileSize;
    var tcy = (y)*tileSize;
    var tcw = tileSize;
    var tch = tileSize;
    
    view.canvasCtx.drawImage(
      expl_img,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );
    
    view.markForRedraw(x,y);
  }
  
  function checkStatus( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        controller.updateUnitStatus( model.extractUnitId(unit) );
      }
    }
  }
  
  view.registerAnimationHook({
    
    key: "fireBombAt",
        
    prepare: function( tx,ty, range, damage, owner ){
      if( !expl_img ) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
      controller.playSound("ROCKET_IMPACT");
      
      this.x = tx;
      this.y = ty;   
      this.range = range;
      this.maxStep = 10+range+1;
      this.step = 0;
      this.time = 0;
    },
    
    render: function(){
      model.doInRange( this.x, this.y, this.range, renderSmoke, this.step );
    },
    
    update: function( delta ){
      this.time += delta;
      if( this.time > 75 ){
        this.step++;
        this.time = 0;
      }
    },
    
    isDone: function(){
      var done = this.step === this.maxStep;
      
      // RENDER HP LOST
      if( done ) model.doInRange( this.x, this.y, this.range, checkStatus );
      
      return done;
    }
    
  });
});