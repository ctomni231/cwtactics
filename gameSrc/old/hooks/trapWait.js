view.registerAnimationHook({

  key:"trapwait_invoked",

  prepare: function( uid ){
    var unit = model.unit_data[ uid ];
    this.time = 0;
    this.xp = unit.x+1;
    this.yp = unit.y;
    this.x = (unit.x+1) * TILE_LENGTH;
    this.y = unit.y * TILE_LENGTH;
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
        view.redraw_markPos( i , y );
      }
    }
    return res;
  }

});
