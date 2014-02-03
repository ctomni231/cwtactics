/**
 * Contains all features of the web client. If the value of a feature is `true`, then it will
 * be supported by the current active environment. If the value is `false`, then it isn't
 * supported.
 *
 * @type {Object}
 */
cwt.ClientFeatures = {

  /**
   * Controls the availability of audio effects.
   */
  audioSFX: 	false,

  /**
   * Controls the availability of music.
   */
  audioMusic: false,

  /**
   * Controls the availability of game-pad input.
   */
  gamePad:    false,

  /**
   * Controls the availability of computer keyboard input.
   */
  keyboard:	false,

  /**
   * Controls the availability of mouse input.
   */
  mouse:		false,

  /**
   * Controls the availability of touch input.
   */
  touch:		false,

  /**
   * Signals a official supported environment. If false then it doesn't mean the
   * environment cannot run the game, but the status is not official tested. As
   * result the game could run fine or breaks.
   */
  supported:  false,

  // scaledImg:  false,

  /**
   * Controls the usage of the workaround for the iOS7 WebSQL DB bug.
   */
  iosWebSQLFix: false,

  /**
   *
   */
  updateFeatures: function () {

    // Mobile Browser
    if( Browser.mobile ){

      // ios has *AA* support
      if( Browser.ios ){
        if( Browser.version >= 5 ) this.supported = true;
        if( Browser.version >= 6 ) this.audioSFX = true;
        this.iosWebSQLFix = true;
      }
      else if( Browser.android ){
        this.supported = true;
      }

      this.touch = true;
    }
    // Desktop Browser
    else{

      controller.stateMachine.data.fastClickMode = true;

      // chrome has *AAA* support
      if( Browser.chrome || Browser.safari){
        this.supported 	= true;
        this.audioSFX 		= true;
        this.audioMusic 	= true;
      }

      if( Browser.chrome ) this.gamePad = true;

      this.mouse 	= true;
      this.keyboard 	= true;
    }
  }
};
