view.registerCommandHook({

  key: "move",

  prepare: function( data ){
    var actionData = controller.actiondata;

    this.moveAnimationX     = data.getSourceX();
    this.moveAnimationY     = data.getSourceY();
    this.moveAnimationIndex = 0;
    this.moveAnimationPath  = data.getMovePath();
    this.moveAnimationUid   = data.getSourceUnitId();
    this.moveAnimationShift = 0;

    view.preventRenderUnit = data.getSourceUnit();

    if( CLIENT_DEBUG ){
      util.logInfo(
        "drawing move from",
        "(",this.moveAnimationX,",",this.moveAnimationY,")",
        "with path",
        "(",this.moveAnimationPath,")"
      );
    }

    // CHECK STATUS
    controller.updateUnitStats( data.getSourceUnit() );
  },

    update: function( delta ){
      var tileSize = TILE_LENGTH;

      // MOVE 4 TILES / SECOND
      this.moveAnimationShift += ( delta/1000 ) * ( tileSize*12 );

      view.markForRedrawWithNeighboursRing(
        this.moveAnimationX, this.moveAnimationY
      );

      if( this.moveAnimationShift > tileSize ){

        // UPDATE ANIMATION POS
        switch( this.moveAnimationPath[ this.moveAnimationIndex ] ){
          case model.MOVE_CODE_UP :    this.moveAnimationY--; break;
          case model.MOVE_CODE_RIGHT : this.moveAnimationX++; break;
          case model.MOVE_CODE_DOWN :  this.moveAnimationY++; break;
          case model.MOVE_CODE_LEFT :  this.moveAnimationX--; break;
        }

        this.moveAnimationIndex++;

        this.moveAnimationShift -= tileSize;
        // this.moveAnimationShift = 0;

        if( this.moveAnimationIndex === this.moveAnimationPath.length ){
          this.moveAnimationX     = 0;
          this.moveAnimationY     = 0;
          this.moveAnimationIndex = 0;
          this.moveAnimationPath  = null;
          this.moveAnimationUid   = -1;
          this.moveAnimationShift = 0;
          view.preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
        }
      }
    },

  render: function(){
    var uid      = this.moveAnimationUid;
    var cx       = this.moveAnimationX;
    var cy       = this.moveAnimationY;
    var shift    = this.moveAnimationShift;
    var moveCode = this.moveAnimationPath[ this.moveAnimationIndex ];
    var unit     = model.units[ uid ];

    var color;
    if( unit.owner === model.turnOwner ){
      color = view.COLOR_GREEN;
    }
    else if( model.players[unit.owner].team ===
              model.players[model.turnOwner].team ){
      color = view.COLOR_BLUE;
    }
    else color = view.COLOR_RED;

    var state;
    var tp = unit.type;

    // GET CORRECT IMAGE STATE
    switch( moveCode ){
      case model.MOVE_CODE_UP :    state = view.IMAGE_CODE_UP;    break;
      case model.MOVE_CODE_RIGHT : state = view.IMAGE_CODE_RIGHT; break;
      case model.MOVE_CODE_DOWN :  state = view.IMAGE_CODE_DOWN;  break;
      case model.MOVE_CODE_LEFT :  state = view.IMAGE_CODE_LEFT;  break;
    }

    var pic = view.getUnitImageForType( tp, state, color );

    var tileSize = TILE_LENGTH;
    var BASESIZE = controller.baseSize;
    var scx = (BASESIZE*2)*view.getSpriteStep("UNIT");
    var scy = 0;
    var scw = BASESIZE*2;
    var sch = BASESIZE*2;
    var tcx = ( cx )*tileSize -tileSize/2; // TODO
    var tcy = ( cy )*tileSize -tileSize/2;
    var tcw = tileSize+tileSize;
    var tch = tileSize+tileSize;

    // ADD SHIFT
    switch( moveCode ){
      case model.MOVE_CODE_UP:    tcy -= shift; break;
      case model.MOVE_CODE_LEFT:  tcx -= shift; break;
      case model.MOVE_CODE_RIGHT: tcx += shift; break;
      case model.MOVE_CODE_DOWN:  tcy += shift; break;
    }

    // DRAW IT
    if( pic !== undefined ){
      view.canvasCtx.drawImage(
        pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tcw
      );
    }
    else{
      tcx = ( cx )*tileSize;
      tcy = ( cy )*tileSize;
      tcw = tileSize;
      tch = tileSize;

      // ADD SHIFT
      switch( moveCode ){
        case model.MOVE_CODE_UP:    tcy -= shift; break;
        case model.MOVE_CODE_LEFT:  tcx -= shift; break;
        case model.MOVE_CODE_RIGHT: tcx += shift; break;
        case model.MOVE_CODE_DOWN:  tcy += shift; break;
      }

      view.canvasCtx.fillStyle="rgb(255,0,0)";
      view.canvasCtx.fillRect(
        tcx,tcy,
        tcw,tch
      );
    }
  },

  isDone: function(){
    return this.moveAnimationUid === -1;
  }

});