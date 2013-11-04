view.registerAnimationHook({
  
  key: "move_moveUnitByPath",
  
  prepare: function( way, uid, x,y ){
    
    this.moveAnimationX     = x;
    this.moveAnimationY     = y;
    this.moveAnimationIndex = 0;
    this.moveAnimationPath  = way;
    this.moveAnimationUid   = uid;
    this.moveAnimationShift = 0;
    
    this.moveAnimationDustX = -1;
    this.moveAnimationDustY = -1;
    this.moveAnimationDustTime = -1;
    this.moveAnimationDustStep = -1;
    this.moveAnimationDustPic = null;
    
    .preventRenderUnit = model.unit_data[ uid ];
    var mvType = model.unit_data[ uid ].type.movetype;
    
    /*
    var mvSoundId;
    if( mvType === "MV_INFANTRY" || mvType === "MV_MECH" ) mvSoundId = "MV_FOOT";
    else if( mvType === "MV_TANK" ) mvSoundId = "MV_TANK";
    else if( mvType === "MV_AIR" ) mvSoundId = "MV_AIR";
    else mvSoundId = "MV_VHCL";
    
    this.snd = controller.playSound( mvSoundId );
    */
    
    if( constants.DEBUG ){
      util.log(
        "drawing move from",
        "(",this.moveAnimationX,",",this.moveAnimationY,")",
        "with path",
        "(",this.moveAnimationPath,")"
      );
    }
  },
  
  update: function( delta ){
    var tileSize = TILE_LENGTH;
    
    // MOVE 4 TILES / SECOND
    this.moveAnimationShift += ( delta/1000 ) * ( tileSize*8);
    
    .markForRedrawWithNeighboursRing(
      this.moveAnimationX, this.moveAnimationY
    );
    
    // DUST
    if( this.moveAnimationDustStep !== -1 ){
      
      this.moveAnimationDustTime += delta;
      if( this.moveAnimationDustTime > 30 ){
        
        this.moveAnimationDustStep++;
        this.moveAnimationDustTime = 0;
        
        if( this.moveAnimationDustStep === 3 ){
          this.moveAnimationDustStep = -1;
        }
      }
    }
    
    if( this.moveAnimationShift > tileSize ){
      
      this.moveAnimationDustX = this.moveAnimationX;
      this.moveAnimationDustY = this.moveAnimationY;
      this.moveAnimationDustTime = 0;
      this.moveAnimationDustStep = 0;
      
      // UPDATE ANIMATION POS
      switch( this.moveAnimationPath[ this.moveAnimationIndex ] ){
          
        case model.move_MOVE_CODES.UP :
          this.moveAnimationY--;
          this.moveAnimationDustPic = .getInfoImageForType("DUST_U");
          break;
          
        case model.move_MOVE_CODES.RIGHT :
          this.moveAnimationX++;
          this.moveAnimationDustPic = .getInfoImageForType("DUST_R");
          break;
          
        case model.move_MOVE_CODES.DOWN :
          this.moveAnimationY++;
          this.moveAnimationDustPic = .getInfoImageForType("DUST_D");
          break;
          
        case model.move_MOVE_CODES.LEFT :
          this.moveAnimationX--;
          this.moveAnimationDustPic = .getInfoImageForType("DUST_L");
          break;
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
        .preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
      }
    }
  },
  
  render: function(){
    var uid      = this.moveAnimationUid;
    var cx       = this.moveAnimationX;
    var cy       = this.moveAnimationY;
    var shift    = this.moveAnimationShift;
    var moveCode = this.moveAnimationPath[ this.moveAnimationIndex ];
    var unit     = model.unit_data[ uid ];
    var color = .colorArray[ unit.owner ];
    var state;
    var tp = unit.type;
    
    // GET CORRECT IMAGE STATE
    switch( moveCode ){
      case model.move_MOVE_CODES.UP :    state = .IMAGE_CODE_UP;    break;
      case model.move_MOVE_CODES.RIGHT : state = .IMAGE_CODE_RIGHT; break;
      case model.move_MOVE_CODES.DOWN :  state = .IMAGE_CODE_DOWN;  break;
      case model.move_MOVE_CODES.LEFT :  state = .IMAGE_CODE_LEFT;  break;
    }
    
    var pic = .getUnitImageForType( tp.ID, state, color );
    
    var tileSize = TILE_LENGTH;
    var BASESIZE = controller.baseSize;
    var scx = (BASESIZE*2)*.getSpriteStep("UNIT");
    var scy = 0;
    var scw = BASESIZE*2;
    var sch = BASESIZE*2;
    var tcx = ( cx )*tileSize -tileSize/2; // TODO
    var tcy = ( cy )*tileSize -tileSize/2;
    var tcw = tileSize+tileSize;
    var tch = tileSize+tileSize;
    
    // ADD SHIFT
    switch( moveCode ){
      case model.move_MOVE_CODES.UP:    tcy -= shift; break;
      case model.move_MOVE_CODES.LEFT:  tcx -= shift; break;
      case model.move_MOVE_CODES.RIGHT: tcx += shift; break;
      case model.move_MOVE_CODES.DOWN:  tcy += shift; break;
    }
    
    // DRAW IT
    if( pic !== undefined ){
      .canvasCtx.drawImage(
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
        case model.move_MOVE_CODES.UP:    tcy -= shift; break;
        case model.move_MOVE_CODES.LEFT:  tcx -= shift; break;
        case model.move_MOVE_CODES.RIGHT: tcx += shift; break;
        case model.move_MOVE_CODES.DOWN:  tcy += shift; break;
      }
      
      .canvasCtx.fillStyle="rgb(255,0,0)";
      .canvasCtx.fillRect(
        tcx,tcy,
        tcw,tch
      );
    }
    
    // DUST
    if( this.moveAnimationDustStep !== -1 ){
      
      var tileSize = TILE_LENGTH;
      scx = (BASESIZE*2)*this.moveAnimationDustStep;
      scy = 0;
      scw = BASESIZE*2;
      sch = BASESIZE*2;
      tcx = ( this.moveAnimationDustX )*tileSize -tileSize/2;
      tcy = ( this.moveAnimationDustY )*tileSize -tileSize/2;
      tcw = tileSize+tileSize;
      tch = tileSize+tileSize;
      
      .canvasCtx.drawImage(
        this.moveAnimationDustPic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );
    }
  },
  
  isDone: function(){
    var done = (this.moveAnimationUid === -1);
    return done;
  }
  
});
