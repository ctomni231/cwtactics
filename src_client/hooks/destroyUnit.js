view.registerAnimationHook({

  key: "destroyUnit",

  prepare: function( id ){
    var unit = model.unit_data[ id ];

    this.step = 0;
    this.time = 0;

    this.x = -unit.x;
    this.y = -unit.y;

    controller.audio_playSound("EXPLODE");
  },

  render: function(){
    var step = this.step;

    var pic = view.getInfoImageForType("EXPLOSION_GROUND");

    var x = this.x;
    var y = this.y;

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
      pic,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );

    view.redraw_markPos(x,y);
  },

  update: function( delta ){
    this.time += delta;
    if( this.time > 75 ){
      this.step++;
      this.time = 0;
    }
  },

  isDone: function(){
    return this.step === 10;
  }

});
