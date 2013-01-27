view.registerCommandHook({

  key: "silofire",

  _check: function( x,y ){
    var unit = model.unitPosMap[x][y];
    if( unit !== null ) controller.updateUnitStats( unit );
  },

  _render: function( x,y, step, img ){
    if( step < 0 || step >= 10 ) return;

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
      img,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );

    view.markForRedraw(x,y);
  },

  prepare: function( data ){
    var x = data.getActionTargetX();
    var y = data.getActionTargetY();
    this.x = x;
    this.y = y;
    var chk = this._check;

    chk( x, y-2 );

    chk( x-1, y-1 );
    chk( x  , y-1 );
    chk( x+1, y-1 );

    chk( x-2, y );
    chk( x-1, y );
    chk( x  , y );
    chk( x+1, y );
    chk( x+2, y );

    chk( x-1, y+1 );
    chk( x  , y+1 );
    chk( x+1, y+1 );

    chk( x, y+2 );

    this.step = 0;
    this.time = 0;
  },

  render: function(){
    var pic = view.getInfoImageForType("EXPLOSION_GROUND");
    var step = this.step;
    var chk = this._render;
    var x = this.x;
    var y = this.y;

    // CENTER
    chk( x  , y, step,pic );

    // INNER RING
    step -= 1;
    chk( x  , y-1, step,pic );
    chk( x-1, y, step,pic );
    chk( x+1, y, step,pic );
    chk( x  , y+1, step,pic );

    // OUTER RING
    step -= 3;
    chk( x-1, y+1, step,pic );
    chk( x+1, y+1, step,pic );
    chk( x-1, y-1, step,pic );
    chk( x+1, y-1, step,pic );
    chk( x, y-2, step,pic );
    chk( x, y+2, step,pic );
    chk( x-2, y, step,pic );
    chk( x+2, y, step,pic );
  },

  update: function( delta ){
    this.time += delta;
    if( this.time > 50 ){
      this.step++;
      this.time = 0;
    }
  },

  isDone: function(){
    return this.step === 13;
  }

});