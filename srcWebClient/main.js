/**
 * @namespace
 */
cwt.client = {

  VERSION: function(){
    [0,1,0].join(",");
  },

  /**
   * Id of the app div element.
   *
   * @constant
   */
  APP_CONTAINER: "app",

  /**
   * Id of the canvas element.
   *
   * @constant
   */
  CANVAS_CONTAINER: "cwt_maplayer",

  /**
   * @constant
   */
  MENU_CONTAINER: "menu",

  init: function( annotated ){

    // init controllers
    cwt.client._initCanvasElement();
    cwt.client.menuController.init();
    cwt.client.inputController.init();
  },

  /**
   * Updates the game logic and graphic.
   *
   * @param delta time since last call in ms
   */
  update: function( delta ){
    var cl = cwt.client;

    cl.solveMapShift();

    if( cl.drawChanges > 0 ){
      cl.drawScreen();
    }

    if( cl.msx === 0 && cl.msy === 0 ) cl.triggerAnimation( delta );
  }
};