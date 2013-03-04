/*
view.registerCommandHook({

  key: "ATUN",

  // ------------------------------------------------------------------------

  prepare: function( aid, admg, aUseAmmo, did, ddmg, dUseAmmo ){
    var sUnit = model.units[ aid ];
    var tUnit = model.units[ did ];

    this.step = 0;
    this.time = 0;

    if(        sUnit.hp <= 0 ){
      this.x = sUnit.x;
      this.y = sUnit.y;
    }
    else{
      //controller.updateUnitStats( sUnit );

      if(   tUnit.hp <= 0 ){
        this.x = tUnit.x;
        this.y = tUnit.y;
      }
      else{
        //controller.updateUnitStats( tUnit );
        this.step = -1;
      }
    }
  },

  // ------------------------------------------------------------------------

  render: function(){
    var step = this.step;
    if( step === -1 ) return;

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

    view.markForRedraw(x,y);
  },

  // ------------------------------------------------------------------------

  update: function( delta ){
    this.time += delta;
    if( this.time > 50 ){
      this.step++;
      this.time = 0;
    }
  },

  // ------------------------------------------------------------------------

  isDone: function(){
    return this.step === -1 || this.step === 10;
  }

});
*/