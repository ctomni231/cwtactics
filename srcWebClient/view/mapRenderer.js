const TILE_LENGTH = 16;

controller.baseSize = CWT_MOD_DEFAULT.graphic.baseSize;

/**
 *
 */
view.preventRenderUnit = null;

/**
 *
 */
view.canvasCtx = controller.screenElement.getContext("2d");

view.colorArray = [
  view.COLOR_RED,
  view.COLOR_BLUE,
  view.COLOR_GREEN,
  view.COLOR_YELLOW
];

/**
 *
 * @example this is a god method because it would hit the performance
 *          extremly on non-JIT compatible environments like ios home
 *          screen apps if the single draw parts would be separated.
 * @param scale
 */
view.renderMap = function( scale ){
  var tileSize = TILE_LENGTH;
  var ctx = view.canvasCtx;
  var sx = controller.screenX;
  var sy = controller.screenY;
  var type;
  var pic;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;
  var sprStepSel = view.getSpriteStep("SELECTION");
  var sprStepUnit = view.getSpriteStep("UNIT");
  var sprStepProp = view.getSpriteStep("PROPERTY");
  var sprStepStat = view.getSpriteStep("STATUS");
  var BASESIZE = controller.baseSize;
  
  var focusExists = (
    controller.input.state() === "MOVEPATH_SELECTION" ||
      controller.input.state() === "ACTION_SELECT_TARGET"
  );

  var inShadow;

  // ITERATE BY ROW
  var ye = model.mapHeight-1;
  for(var y = 0; y<=ye; y++){

    // ITERATE BY COLUMN
    var xe = model.mapWidth-1;
    for(var x= 0; x<=xe; x++){

      inShadow = model.fogData[x][y] === 0;

      // RENDER IF NEEDED
      if( view.drawScreen[x][y] === true ){

        // --------------------------------------------------------------------
        // DRAW TILE

        type = model.map[x][y];
        pic = view.getTileImageForType( type );

        scx = 0;
        scy = 0;
        scw = BASESIZE;
        sch = BASESIZE*2;
        tcx = (x)*tileSize;
        tcy = (y)*tileSize - tileSize;
        tcw = tileSize;
        tch = tileSize*2;

        if( tcy < 0 ){
          scy = scy + BASESIZE;
          sch = sch - BASESIZE;
          tcy = tcy + tileSize;
          tch = tch - tileSize;
        }

        if( pic !== undefined ){
          ctx.drawImage(
            pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          // RENDER GRAY OVERLAY TO MARK AS USED
          /*
          if( inShadow && tch > 16 && view.OVERLAYER[type] === true ){

            pic = view.getTileImageForType( type , view.COLOR_BLACK_MASK );

            ctx.globalAlpha = 0.35;
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch/2,
              tcx,tcy,
              tcw,tch/2
            );
            ctx.globalAlpha = 1;
          }
          */
        }
        else{
          ctx.fillStyle="rgb(0,0,255)";
          ctx.fillRect( tcx,tcy, tileSize,tileSize );
        }

        // continue;
        // --------------------------------------------------------------------
        // DRAW PROPERTY

        var property = model.propertyPosMap[x][y];
        if( property !== null ){

          var color;
          if( property.owner === -1 ){
            color = view.COLOR_NEUTRAL;
          }
          else{
            color = view.colorArray[ property.owner ];
          }

          if( inShadow ) color = view.COLOR_NEUTRAL;

          pic = view.getPropertyImageForType( property.type, color );
          scx = 0 + BASESIZE*sprStepProp;
          scy = 0;
          scw = BASESIZE;
          sch = BASESIZE*2;
          tcx = (x)*tileSize;
          tcy = (y)*tileSize - tileSize;
          tcw = tileSize;
          tch = tileSize*2;

          if( tcy < 0 ){
            scy = scy + BASESIZE;
            sch = sch - BASESIZE;
            tcy = tcy + tileSize;
            tch = tch - tileSize;
          }

          if( pic !== undefined ){
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch,
              tcx,tcy,
              tcw,tch
            );

            // RENDER GRAY OVERLAY TO MARK AS USED
            if( inShadow && tch > 16 && property !== null ){

              pic = view.getPropertyImageForType(
                property.type, view.COLOR_BLACK_MASK
              );

              ctx.globalAlpha = 0.35;
              ctx.drawImage(
                pic,
                scx,scy,
                scw,sch/2,
                tcx,tcy,
                tcw,tch/2
              );
              ctx.globalAlpha = 1;
            }
          }
          else{
            tcx = (x)*tileSize;
            tcy = (y)*tileSize;
            tcw = tileSize;
            tch = tileSize;

            ctx.fillStyle="rgb(0,255,0)";
            ctx.fillRect(
              tcx,tcy,
              tcw,tch
            );
          }
        }

        // --------------------------------------------------------------------
        // DRAW SHADOW

        if( inShadow ){
          tcx = (x)*tileSize;
          tcy = (y)*tileSize;
          tcw = tileSize;
          tch = tileSize;

          ctx.globalAlpha = 0.2;
          ctx.fillStyle="black";
          ctx.fillRect(
            tcx,tcy,
            tcw,tch
          );
          ctx.globalAlpha = 1;
        }

        // --------------------------------------------------------------------
        // DRAW FOCUS
        if( focusExists ){
          pic = view.getInfoImageForType(
            ( controller.input.state() === "MOVEPATH_SELECTION" )?
              "MOVE_FOC" : "ATK_FOC"
          );

          var value = controller.input.selectionData.getPositionValue( x,y );
          if( value > 0 ){

            scx = BASESIZE*sprStepSel;
            scy = 0;
            scw = BASESIZE;
            sch = BASESIZE;
            tcx = (x)*tileSize;
            tcy = (y)*tileSize;
            tcw = tileSize;
            tch = tileSize;

            ctx.globalAlpha = 0.65;
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch,
              tcx,tcy,
              tcw,tch
            );
            ctx.globalAlpha = 1;
          }
        }

        // --------------------------------------------------------------------
        // DRAW UNIT

        var unit = model.unitPosMap[x][y];
        if( !inShadow && unit !== null ){
          if( unit !== view.preventRenderUnit ){
            var color;
            if( unit.owner === -1 ){
              color = view.COLOR_NEUTRAL;
            }
            else{
              color = view.colorArray[ unit.owner ];
            }

            var state = ( unit.owner % 2 === 1 )?
              view.IMAGE_CODE_IDLE : view.IMAGE_CODE_IDLE_INVERTED;

            pic = view.getUnitImageForType( unit.type, state, color );

            scx = (BASESIZE*2)*sprStepUnit;
            scy = 0;
            scw = BASESIZE*2;
            sch = BASESIZE*2;
            tcx = (x)*tileSize-tileSize/2; // TODO fix scale
            tcy = (y)*tileSize-tileSize/2;
            tcw = tileSize+tileSize;
            tch = tileSize+tileSize;

            if( pic !== undefined ){
              ctx.drawImage(
                pic,
                scx,scy,
                scw,sch,
                tcx,tcy,
                tcw,tch
              );

              // RENDER GRAY OVERLAY TO MARK AS USED
              if( unit.owner === model.turnOwner &&
                !model.canAct( model.extractUnitId( unit ) ) ){

                ctx.globalAlpha = 0.5;
                ctx.drawImage(
                  view.getUnitImageForType(
                    unit.type, state, view.COLOR_BLACK_MASK
                  ),
                  scx,scy,
                  scw,sch,
                  tcx,tcy,
                  tcw,tch
                );
                ctx.globalAlpha = 1;
              }
            }
            else{
              tcx = (x)*tileSize;
              tcy = (y)*tileSize;
              tcw = tileSize;
              tch = tileSize;

              ctx.fillStyle="rgb(255,0,0)";
              ctx.fillRect(
                tcx,tcy,
                tcw,tch
              );
            }

            pic = unit._clientData_.hpPic;
            if( pic !== null ){
              ctx.drawImage(
                pic,
                tcx+tileSize,tcy+tileSize
              );
            }

            // ------------------------------------------------------------

            if( sprStepStat !== 0 &&
              sprStepStat !== 1 &&

              sprStepStat !== 4 &&
              sprStepStat !== 5 &&

              sprStepStat !== 8 &&
              sprStepStat !== 9 &&

              sprStepStat !== 12 &&
              sprStepStat !== 13 ){

              var st = parseInt( sprStepStat/4 , 10 );

              pic = null;
              var stIn = st;
              do{

                if( stIn === 0 && unit._clientData_.lowAmmo ){
                  pic = view.getInfoImageForType("SYM_AMMO");
                }
                else if( stIn === 1 && unit._clientData_.lowFuel ){
                  pic = view.getInfoImageForType("SYM_FUEL");
                }
                else if( stIn === 2 && unit._clientData_.captures ){
                  pic = view.getInfoImageForType("SYM_CAPTURE");
                }
                else if( stIn === 3 && unit._clientData_.hasLoads ){
                  pic = view.getInfoImageForType("SYM_LOAD");
                }

                if( pic !== null ) break;

                stIn++;
                if( stIn === 4 ) stIn = 0;
              }
              while( stIn !== st );

              if( pic !== null ){
                ctx.drawImage(
                  pic,
                  tcx+tileSize/2,tcy+tileSize
                );
              }
            }

            // ------------------------------------------------------------
          }
        }

        view.drawScreen[x][y] = false;
      }
    }
  }

  // DRAW ARROW
  if( controller.input.state() === "MOVEPATH_SELECTION" ){
    var actiondataObj = controller.input.actionData;
    var currentMovePath = actiondataObj.getMovePath();
    var cX = actiondataObj.getSourceX();
    var cY = actiondataObj.getSourceY();
    var oX;
    var oY;
    var tX;
    var tY;

    for( var i=0,e=currentMovePath.length; i<e; i++ ){
      if( currentMovePath[i] === null ) break;

      oX = cX;
      oY = cY;

      // TODO reduce 3 switches to 1

      // CURRENT TILE
      switch( currentMovePath[i] ){
        case model.MOVE_CODE_UP :    cY--; break;
        case model.MOVE_CODE_RIGHT : cX++; break;
        case model.MOVE_CODE_DOWN :  cY++; break;
        case model.MOVE_CODE_LEFT :  cX--; break;
      }

      // NEXT TILE
      if( i === e-1 || currentMovePath[i+1] === null ){
        tX = -1; tY = -1;
      }
      else{
        switch( currentMovePath[i+1] ){
          case model.MOVE_CODE_UP :    tX = cX;   tY = cY-1; break;
          case model.MOVE_CODE_RIGHT : tX = cX+1; tY = cY;   break;
          case model.MOVE_CODE_DOWN :  tX = cX;   tY = cY+1; break;
          case model.MOVE_CODE_LEFT :  tX = cX-1; tY = cY;   break;
        }
      }

      if( tX == -1 ){

        // TARGET TILE
        switch( currentMovePath[i] ){
          case model.MOVE_CODE_UP :
            pic = view.getTileImageForType("ARROW_N"); break;
          case model.MOVE_CODE_RIGHT :
            pic = view.getTileImageForType("ARROW_E"); break;
          case model.MOVE_CODE_DOWN :
            pic = view.getTileImageForType("ARROW_S"); break;
          case model.MOVE_CODE_LEFT :
            pic = view.getTileImageForType("ARROW_W"); break;
        }
      }
      else{

        var diffX = Math.abs( tX-oX );
        var diffY = Math.abs( tY-oY );

        // IN THE MIDDLE OF THE WAY
        if( diffX === 2 ){
          pic = view.getTileImageForType("ARROW_WE");
        }
        else if( diffY === 2 ){
          pic = view.getTileImageForType("ARROW_NS");
        }
        else if( (tX<cX && oY>cY) || (oX<cX && tY>cY)  ){
          pic = view.getTileImageForType("ARROW_SW");
        }
        else if( (tX<cX && oY<cY) || (oX<cX && tY<cY) ){
          pic = view.getTileImageForType("ARROW_WN");
        }
        else if( (tX>cX && oY<cY) || (oX>cX && tY<cY) ){
          pic = view.getTileImageForType("ARROW_NE");
        }
        else if( (tX>cX && oY>cY) || (oX>cX && tY>cY) ){
          pic = view.getTileImageForType("ARROW_ES");
        }
        else{
          util.logError(
            "illegal move arrow state",
            "old (",oX,",",oY,")",
            "current (",cX,",",cY,")",
            "next (",tX,",",tY,")",
            "path (", currentMovePath ,")"
          );

          continue;
        }
      }

      if( cX >= 0 && cY >= 0 &&
        cX < controller.screenWidth && cY < controller.screenHeight ){
        ctx.drawImage(
          pic,
          cX*tileSize,
          cY*tileSize
        );
      }
    }
  }

  // DRAW CURSOR
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f00';
  ctx.strokeRect(
    tileSize*controller.mapCursorX+1,
    tileSize*controller.mapCursorY+1,
    tileSize-2,tileSize-2
  );

  view.drawScreenChanges=0;
};

view.fitScreenToDeviceOrientation = function(){
  var canvEl = controller.screenElement;

  canvEl.width = TILE_LENGTH*model.mapWidth;
  canvEl.height = TILE_LENGTH*model.mapHeight;

  controller.screenWidth  = parseInt( window.innerWidth/  TILE_LENGTH, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ TILE_LENGTH, 10 );
};