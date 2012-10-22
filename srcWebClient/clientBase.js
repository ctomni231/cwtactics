/**
 * Meta package that contains some identical strings for the html application
 * components and the update function.
 *
 * @namespace
 */
var client = {
  ID_APP_DIV: "CWTWC_APP",
  ID_MENU:    "CWTWC_MENU",
  ID_CANVAS:  "CWTWC_CANVAS"
};

/**
 * Updates the game logic and graphic.
 *
 * @param delta time since last call in ms
 */
client.update = function( delta ){

  if( animation.isMoveAnimationActive() === false ){

    // UPDATE LOGIC
    if( controller.hasNextAction() ){
      var msg = controller.evaluateNextAction();

      if( msg.k === "move" ){
        animation.prepareMoveAnimation(msg.a[0], msg.a[1],msg.a[2], msg.a[3]);
      }

      if( msg.k === "silofire" ){
        var x = msg.a[5];
        var y = msg.a[6];
        screen.markForRedrawRange( x,y,2 );
      }

      if( util.DEBUG ){
        util.logInfo("Executed a",msg.k,"command");
      }
    }
  }
  else{

    // UPDATE MOVE
    animation.updateMoveAnimation( delta );
  }

  // UPDATE ANIMATION STEP
  if( userInput.moveScreenX === 0 &&
      userInput.moveScreenY === 0 ){

    animation.updateAnimationTimer( delta );
  }
  else{
    userInput.solveMapShift();
  }

  // RENDER
  if( screen.drawChanges > 0 ){
    screen.drawScreen();
  }

  // RENDER MOVE
  if( animation.isMoveAnimationActive() === true ){

    // uid, cx, cy, shift, moveCode
    screen.drawMoveAnimation(
      animation.moveAnimationUid,
      animation.moveAnimationX, animation.moveAnimationY,
      animation.moveAnimationShift,
      animation.moveAnimationPath[ animation.moveAnimationIndex ]
    );
  }
};

/**
 * Screen module contains api and events to redraw all visible things on the
 * screen.
 * @namespace
 */
var screen    = {};

/**
 * Contains all control functions to load and player sounds in the game.
 *
 * @namespace
 * @example
 *  required: WEB AUDIO API
 */
var sound     = {};

/**
 * Contains all functions to catch user input commands and pushing them
 * into the game engine.
 *
 * @namespace
 */
var userInput = {};

/**
 * Contains all ingame images.
 *
 * @namespace
 */
var images    = {};

/**
 * ...
 * @namespace
 */
var menu      = {};

/**
 *
 */
var animation = {};

/**
 * ...
 * @namespace
 */
var storage   = {};

/**
 * ...
 * @namespace
 */
var locale    = {};

/** @constant */
signal.EVENT_CLIENT_INIT = "client:init";

/** @constant */
signal.EVENT_CLIENT_START = "client:start";

signal.connect( signal.EVENT_CLIENT_START, function(){
  screen.completeRedraw();
});