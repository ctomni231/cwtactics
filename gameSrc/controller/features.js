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
  audioSFX: ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) === true),

  /**
   * Controls the availability of music.
   */
  audioMusic: ((Browser.chrome || Browser.safari) === true),

  /**
   * Controls the availability of game-pad input.
   */
  gamePad: ((Browser.chrome && !!navigator.webkitGetGamepads) === true),

  /**
   * Controls the availability of computer keyboard input.
   */
  keyboard:	((!Browser.mobile) === true),

  /**
   * Controls the availability of mouse input.
   */
  mouse: ((!Browser.mobile) === true),

  /**
   * Controls the availability of touch input.
   */
  touch: ((Browser.mobile) === true),

  /**
   * Signals a official supported environment. If false then it doesn't mean the
   * environment cannot run the game, but the status is not official tested. As
   * result the game could run fine or breaks.
   */
  supported: ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) === true),

  // scaledImg:  false,

  /**
   * Controls the usage of the workaround for the iOS7 WebSQL DB bug.
   */
  iosWebSQLFix: ((Browser.ios && Browser.version >= 7) === true)
};
