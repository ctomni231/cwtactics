util.scoped(function(){

  var selection = controller.stateMachine.data.selection;

  var animations = [

    // UNIT
    0,  3, 0, 250, 0,

    // UNIT SIMPLE
    0,  3, 0, 250, 0,

    // SELECTION
    0,  7, 0, 150, 0,

    // STATUS
    0, 20, 0, 300, 0,

    // PROPERTY
    0,  4, 0, 400, 0,

    // ANIMATED TILES (4)
    0,  4, 0, 500, 0,

    // ANIMATED TILES (8)
    0,  8, 0, 500, 0
  ];

  var unitStepper = +1;

  /**
   *
   */
  view.getSpriteStep = function( key ){
    switch( key ){
      case "UNIT":           return animations[0];
      case "UNIT_SIMPLE":    return animations[5];
      case "SELECTION":      return animations[10];
      case "STATUS":         return animations[15];
      case "PROPERTY":       return animations[20];
      case "ANIM_TILES":     return animations[25];
      case "ANIM_TILES_EXT": return animations[30];
    }

    return 0;
  };

  /**
   *
   */
  view.updateSpriteAnimations = function( delta ){
    var flagged = false;

    for( var i=0, e=animations.length; i<e ; i+=5 ) {

      // add time to animation slot
      animations[i+2] += delta;

      // if slot reaches maximum time per step
      if( animations[i+2] >= animations[i+3] ){
        animations[i+2] = 0;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // special unit animation
        if( i === 0 ){
          animations[i] += unitStepper;

          if( unitStepper === -1 ){

            // breaks lower border
            if( animations[i] === -1 ){
              animations[i] = 1;
              unitStepper   = +1;
            }
          }
          else{

            // breaks upper border
            if( animations[i] === animations[i+1] ){
              animations[i] = (animations[i+1] - 2);
              unitStepper   = -1;
            }
          }
        }
        // normal animations
        else{
          animations[i] += 1;
          if( animations[i] === animations[i+1] ) animations[i] = 0;
        }

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // set rerender flag
        flagged = true;
        animations[i+4] = 1;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        if( flagged ){
          var x  = 0;
          var yS = 0;
          var xe = model.map_width;
          var ye = model.map_height;


          if( animations[4] === 1 ||
              animations[9] === 1 ||
              animations[24] === 1 ||
              animations[29] === 1 ){

            for( ; x<xe; x++ ){
              for( var y=yS ; y<ye; y++ ){

                // units or selection tiles
                if( animations[4] === 1 ||
                    animations[9] === 1 ){

                  if( model.unit_posData[x][y] !== null ) view.redraw_markPosWithNeighboursRing(x,y);
                }

                // status needs only an updated step number
                // the graphics will be updated with unit redraws

                // properties
                if( animations[24] === 1 ){

                  if( model.property_posMap[x][y] !== null ) view.redraw_markPosWithNeighboursRing(x,y);
                }

                // animated tiles (solves also extendet anims)
                if( animations[29] === 1 || animations[34] === 1 ){

                  if( view.animatedTiles[ model.map_data[x][y].ID ] ) view.redraw_markPos( x,y );
                }

              }
            }
          }

          var focusExists = (
            controller.stateMachine.state === "MOVEPATH_SELECTION" ||
            controller.stateMachine.state === "ACTION_SELECT_TARGET_A" ||
            controller.stateMachine.state === "ACTION_SELECT_TARGET_B" ||
            controller.attackRangeVisible
          );

          // units or selection tiles

          if( focusExists && animations[14] === 1 ){
            selection.rerenderNonInactive();
          }
        }

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // reset all "render" flags
        animations[4] = 0;
        animations[9] = 0;
        animations[14] = 0;
        animations[19] = 0;
        animations[24] = 0;
        animations[29] = 0;
        animations[34] = 0;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      }
    };
  };

});
