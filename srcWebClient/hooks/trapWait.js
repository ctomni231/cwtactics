view.registerCommandHook({

  key: "trapWait",

  prepare: function( data ){
    this.time = 0;
    this.xp = data.getTargetX();
    this.yp = data.getTargetY();
    this.x = data.getTargetX() * TILE_LENGTH;
    this.y = data.getTargetY() * TILE_LENGTH;
  },

  render: function(){
    var pic = view.getInfoImageForType("TRAPPED");
    view.canvasCtx.drawImage( pic, this.x, this.y );
  },

  update: function( delta ){
    this.time += delta;
  },

  isDone: function(){
    var res = this.time > 1000;
    if( res ){
      var pic = view.getInfoImageForType("TRAPPED");
      var y = this.yp;
      for( var i=this.xp,e=i+( parseInt(pic.width/TILE_LENGTH,10) ); i<=e; i++ ){
        view.markForRedraw( i , y );
      }
    }
    return res;
  }

});