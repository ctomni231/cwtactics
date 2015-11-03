package org.wolftec.cwt.system;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.managed.ManagedClass;

public class Features implements ManagedClass {

  /**
   * Controls the availability of audio effects.
   */
  public boolean audioSFX;

  /**
   * Controls the availability of music.
   */
  public boolean audioMusic;

  /**
   * Controls the availability of game-pad input.
   */
  public boolean gamePad;

  /**
   * Controls the availability of computer keyboard input.
   */
  public boolean keyboard;

  /**
   * Controls the availability of mouse input.
   */
  public boolean mouse;

  /**
   * Controls the availability of touch input.
   */
  public boolean touch;

  /**
   * Signals a official supported environment. If false then it doesn't mean the
   * environment cannot run the game, but the status is not official tested. As
   * result the game may runs fine; laggy or is completely broken.
   */
  public boolean supported;

  /**
   * Controls the usage of the workaround for the iOS7 WebSQL DB bug.
   */
  public boolean iosWebSQLFix;

  @STJSBridge
  static class Browser {
    String  name;
    int     version;
    boolean mobile;
    boolean chrome;
    boolean android;
    boolean ie;
    boolean ff;
    boolean ios;
    boolean safari;
  }

  @Override
  public void onConstruction() {
    Browser browser = JSObjectAdapter.$js("Browser");

    supported = browser.chrome || browser.safari || browser.ios || browser.android;

    audioSFX = browser.chrome || browser.safari || (browser.ios && browser.version >= 6);
    audioMusic = browser.chrome || browser.safari;

    gamePad = browser.chrome && browser.version >= 40;
    keyboard = !browser.mobile;
    mouse = !browser.mobile;
    touch = browser.mobile;

    iosWebSQLFix = browser.ios && browser.version == 7;
  }
}
