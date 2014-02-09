util.scoped(function(){

  var expl_img;
  var rocket_img;
  var rocket_img_inv;

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

    view.redraw_markPos(x,y);
  }

  function checkStatus( x,y ){
    if( model.map_isValidPosition(x,y) ){
      var unit = model.unit_posData[x][y];
      if( unit !== null ){
        controller.updateUnitStatus( model.unit_extractId(unit) );
      }
    }
  }

  view.registerAnimationHook({
    key: "rocketFly",

    prepare: function( x,y, tx,ty,siloId ){
      if( !rocket_img ) rocket_img = view.getInfoImageForType("FLYING_ROCKET");
      if( !rocket_img_inv ) rocket_img_inv = view.getInfoImageForType("FLYING_ROCKET_INV");

      this.siloX   = controller.getCanvasPosX(x);
      this.siloY   = controller.getCanvasPosY(y);
      this.targetX = controller.getCanvasPosX(tx);
      this.targetY = controller.getCanvasPosY(ty);
      this.curX    = this.siloX;
      this.curY    = this.siloY;
      this.phase = 0;
    },

    render: function(){
      var tileSize = TILE_LENGTH;
      var scx = 0;
      var scy = 0;
      var scw = 24;
      var sch = 24;
      var tcx = this.curX;
      var tcy = this.curY;
      var tcw = tileSize +8;
      var tch = tileSize +8;
      
      if( tcy < 0 ){
        scw += tcy;
        scy -= tcy;
        tcy = 0;
      }

      view.canvasCtx.drawImage(
        (this.phase===0)? rocket_img : rocket_img_inv,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

      view.redraw_markPosWithNeighboursRing(
        parseInt(this.curX/TILE_LENGTH, 10),
        parseInt(this.curY/TILE_LENGTH, 10)
      );
    },

    update: function( delta ){
      var shift = ( delta/1000 ) * ( TILE_LENGTH*14);

      if( this.phase === 0 ){

        // rocket flies up
        this.curY -= shift;

        if( this.curY <= 0 ){
          // controller.setScreenPosition( this.targetX, this.targetY, true );

          this.curX = this.targetX;
          this.curY = 0;
          this.phase = 1;
        }
      }
      else {

        // rocket flies down
        this.curY += shift;

        if( this.curY >= this.targetY ){
          this.phase = 2;
        }
      }
    },

    isDone: function(){
      return (this.phase === 2);
    }
  });

  view.registerAnimationHook({

    key: "explode_invoked",

    prepare: function( tx,ty, range, damage, owner ){
      if( !expl_img ) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
      controller.audio_playSound("ROCKET_IMPACT");

      this.x = tx;
      this.y = ty;
      this.range = range;
      this.maxStep = 10+range+1;
      this.step = 0;
      this.time = 0;
    },

    render: function(){
      model.map_doInRange( this.x, this.y, this.range, renderSmoke, this.step );
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
      if( done ) model.map_doInRange( this.x, this.y, this.range, checkStatus );

      return done;
    }

  });

  view.registerAnimationHook({

    key: "bombs_fireCannon",

    prepare: function( ox,oy,x,y,tp ){
      var type = model.data_tileSheets[tp];

      var fireAnim = type.assets.fireAnimation;
      assert( fireAnim.length === 5 );

      this.pic     = view.getInfoImageForType(fireAnim[0]);
      this.sizeX   = fireAnim[1];
      this.sizeY   = fireAnim[2];
      this.offsetX = fireAnim[3];
      this.offsetY = fireAnim[4];

      this.curX    = ox;
      this.curY    = oy;

      this.step    = 0;
      this.time    = 0;

      controller.audio_playSound( type.assets.fireSound);
    },

    render: function(){
      var tileSize = TILE_LENGTH;
      var scx = this.sizeX*this.step;
      var scy = 0;
      var scw = this.sizeX;
      var sch = this.sizeY;
      var tcx = (this.curX)*tileSize + this.offsetX;
      var tcy = (this.curY)*tileSize + this.offsetY;
      var tcw = this.sizeX;
      var tch = this.sizeY;

      view.canvasCtx.drawImage(
        this.pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

    },

    update: function( delta ){
      this.time += delta;
      if( this.time > 100 ){
        this.step++;
        this.time = 0;
      }
    },

    isDone: function(){
      return this.step === 6;
    }

  });

  view.registerAnimationHook({

    key: "bombs_fireLaser",

    prepare: function( ox,oy ){
      // var type = model.data_tileSheets[tp];
      var type = model.property_posMap[ox][oy].type;

      var fireAnimA = type.assets.chargeAnimation;
      var fireAnimB = type.assets.fireAnimation;
      var fireAnimC = type.assets.streamAnimation;
      assert( fireAnimA.length === 5 );
      assert( fireAnimB.length === 5 );
      assert( fireAnimC.length === 5 );
      this.a      = {
        pic     : view.getInfoImageForType(fireAnimA[0]),
        sizeX   : fireAnimB[1],
        sizeY   : fireAnimB[2],
        offsetX : fireAnimB[3],
        offsetY : fireAnimB[4]
      };

      this.b      = {
        pic     : view.getInfoImageForType(fireAnimB[0]),
        sizeX   : fireAnimA[1],
        sizeY   : fireAnimA[2],
        offsetX : fireAnimA[3],
        offsetY : fireAnimA[4]
      };

      this.c      = {
        pic     : view.getInfoImageForType(fireAnimC[0]),
        sizeX   : fireAnimC[1],
        sizeY   : fireAnimC[2],
        offsetX : fireAnimC[3],
        offsetY : fireAnimC[4]
      };

      //W
      fireAnimA = type.assets.chargeAnimation3;
      fireAnimB = type.assets.fireAnimation3;
      fireAnimC = type.assets.streamAnimation3;
      assert( fireAnimA.length === 5 );
      assert( fireAnimB.length === 5 );
      assert( fireAnimC.length === 5 );

      this.a2      = {
        pic     : view.getInfoImageForType(fireAnimA[0]),
        sizeX   : fireAnimB[1],
        sizeY   : fireAnimB[2],
        offsetX : fireAnimB[3],
        offsetY : fireAnimB[4]
      };

      this.b2      = {
        pic     : view.getInfoImageForType(fireAnimB[0]),
        sizeX   : fireAnimA[1],
        sizeY   : fireAnimA[2],
        offsetX : fireAnimA[3],
        offsetY : fireAnimA[4]
      };

      this.c2      = {
        pic     : view.getInfoImageForType(fireAnimC[0]),
        sizeX   : fireAnimC[1],
        sizeY   : fireAnimC[2],
        offsetX : fireAnimC[3],
        offsetY : fireAnimC[4]
      };

      //S
      fireAnimA = type.assets.chargeAnimation2;
      fireAnimB = type.assets.fireAnimation2;
      fireAnimC = type.assets.streamAnimation2;
      assert( fireAnimA.length === 5 );
      assert( fireAnimB.length === 5 );
      assert( fireAnimC.length === 5 );

      this.a3      = {
        pic     : view.getInfoImageForType(fireAnimA[0]),
        sizeX   : fireAnimB[1],
        sizeY   : fireAnimB[2],
        offsetX : fireAnimB[3],
        offsetY : fireAnimB[4]
      };

      this.b3      = {
        pic     : view.getInfoImageForType(fireAnimB[0]),
        sizeX   : fireAnimA[1],
        sizeY   : fireAnimA[2],
        offsetX : fireAnimA[3],
        offsetY : fireAnimA[4]
      };

      this.c3      = {
        pic     : view.getInfoImageForType(fireAnimC[0]),
        sizeX   : fireAnimC[1],
        sizeY   : fireAnimC[2],
        offsetX : fireAnimC[3],
        offsetY : fireAnimC[4]
      };

      //N
      fireAnimA = type.assets.chargeAnimation4;
      fireAnimB = type.assets.fireAnimation4;
      fireAnimC = type.assets.streamAnimation4;
      assert( fireAnimA.length === 5 );
      assert( fireAnimB.length === 5 );
      assert( fireAnimC.length === 5 );

      this.a4      = {
        pic     : view.getInfoImageForType(fireAnimA[0]),
        sizeX   : fireAnimB[1],
        sizeY   : fireAnimB[2],
        offsetX : fireAnimB[3],
        offsetY : fireAnimB[4]
      };

      this.b4      = {
        pic     : view.getInfoImageForType(fireAnimB[0]),
        sizeX   : fireAnimA[1],
        sizeY   : fireAnimA[2],
        offsetX : fireAnimA[3],
        offsetY : fireAnimA[4]
      };

      this.c4      = {
        pic     : view.getInfoImageForType(fireAnimC[0]),
        sizeX   : fireAnimC[1],
        sizeY   : fireAnimC[2],
        offsetX : fireAnimC[3],
        offsetY : fireAnimC[4]
      };

      this.curX    = ox;
      this.curY    = oy;

      this.phase   = 0;
      this.step    = 0;
      this.time    = 0;

      controller.audio_playSound( type.assets.fireSound );
    },

    render: function(){
      var data = (this.phase === 0)? this.a : this.b;
      var data2 = (this.phase === 0)? this.a2 : this.b2;
      var data3 = (this.phase === 0)? this.a3 : this.b3;
      var data4 = (this.phase === 0)? this.a4 : this.b4;

      // E
      var tileSize = TILE_LENGTH;
      var scx = data.sizeX*this.step;
      var scy = 0;
      var scw = data.sizeX;
      var sch = data.sizeY;
      var tcx = (this.curX)*tileSize + data.offsetX;
      var tcy = (this.curY)*tileSize + data.offsetY;
      var tcw = data.sizeX;
      var tch = data.sizeY;
      view.canvasCtx.drawImage(
        data.pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

      //W
      tileSize = TILE_LENGTH;
      scx = data2.sizeX*this.step;
      scy = 0;
      scw = data2.sizeX;
      sch = data2.sizeY;
      tcx = (this.curX)*tileSize + data2.offsetX;
      tcy = (this.curY)*tileSize + data2.offsetY;
      tcw = data2.sizeX;
      tch = data2.sizeY;
      view.canvasCtx.drawImage(
        data2.pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

      //S
      tileSize = TILE_LENGTH;
      scx = data3.sizeX*this.step;
      scy = 0;
      scw = data3.sizeX;
      sch = data3.sizeY;
      tcx = (this.curX)*tileSize + data3.offsetX;
      tcy = (this.curY)*tileSize + data3.offsetY;
      tcw = data3.sizeX;
      tch = data3.sizeY;
      view.canvasCtx.drawImage(
        data3.pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

      //N
      tileSize = TILE_LENGTH;
      scx = data4.sizeX*this.step;
      scy = 0;
      scw = data4.sizeX;
      sch = data4.sizeY;
      tcx = (this.curX)*tileSize + data4.offsetX;
      tcy = (this.curY)*tileSize + data4.offsetY;
      tcw = data4.sizeX;
      tch = data4.sizeY;
      view.canvasCtx.drawImage(
        data4.pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );


      // redraw
      view.redraw_markPosWithNeighboursRing(this.curX, this.curY);

      // TODO: streched over all tiles in the cross
      if( data === this.b ){
        data = this.c;
        data2 = this.c2;
        data3 = this.c3;
        data4 = this.c4;

        // E
        scx = data.sizeX*this.step;
        scy = 0;
        scw = data.sizeX;
        sch = data.sizeY;
        for( var ci = this.curX+1, ce=model.map_width; ci < ce; ci++ ){
          tcx = (ci)*tileSize + data.offsetX;
          tcy = (this.curY)*tileSize + data.offsetY;
          tcw = data.sizeX;
          tch = data.sizeY;

          view.canvasCtx.drawImage(
            data.pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          view.redraw_markPos( ci, this.curY-1 );
          view.redraw_markPos( ci, this.curY );
          view.redraw_markPos( ci, this.curY+1 );
        }

        // W
        scx = data2.sizeX*this.step;
        scy = 0;
        scw = data2.sizeX;
        sch = data2.sizeY;
        for( var ci = this.curX-1, ce=0; ci >= ce; ci-- ){
          tcx = (ci)*tileSize + data2.offsetX;
          tcy = (this.curY)*tileSize + data2.offsetY;
          tcw = data2.sizeX;
          tch = data2.sizeY;

          view.canvasCtx.drawImage(
            data2.pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          view.redraw_markPos( ci, this.curY-1 );
          view.redraw_markPos( ci, this.curY );
          view.redraw_markPos( ci, this.curY+1 );
        }

        // S
        scx = data3.sizeX*this.step;
        scy = 0;
        scw = data3.sizeX;
        sch = data3.sizeY;
        for( var ci = this.curY+1, ce=model.map_height; ci < ce; ci++ ){
          tcx = (this.curX)*tileSize + data3.offsetX;
          tcy = (ci)*tileSize + data3.offsetY;
          tcw = data3.sizeX;
          tch = data3.sizeY;

          view.canvasCtx.drawImage(
            data3.pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          view.redraw_markPos( this.curX+1,ci );
          view.redraw_markPos( this.curX,ci );
          view.redraw_markPos( this.curX-1,ci);
        }

        // N
        scx = data4.sizeX*this.step;
        scy = 0;
        scw = data4.sizeX;
        sch = data4.sizeY;
        for( var ci = this.curY-1, ce=0; ci >= 0; ci-- ){
          tcx = (this.curX)*tileSize + data4.offsetX;
          tcy = (ci)*tileSize + data4.offsetY;
          tcw = data4.sizeX;
          tch = data4.sizeY;

          view.canvasCtx.drawImage(
            data4.pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          view.redraw_markPos( this.curX+1,ci );
          view.redraw_markPos( this.curX,ci );
          view.redraw_markPos( this.curX-1,ci );
        }
      }
    },

    update: function( delta ){
      this.time += delta;
      if( this.time > 100 ){
        this.step++;
        this.time = 0;

        switch( this.phase ){

          // charge phase
          case 0:
            if( this.step === 10 ){
              this.step = 0;
              this.phase++;
            }

          // fire phase
          case 1:
            if( this.step === 12 ){
              this.step = 0;
              this.phase++;
            }
        }
      }
    },

    isDone: function(){
      return this.phase === 2;
    }

  });

});
