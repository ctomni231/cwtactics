package net.wolfTec.utility;


/**
 * Holds the status of the supported features of the active browser environment where CW:T runs in.
 */
public class Features {

    /**
     * Controls the availability of audio effects.
     */
    public boolean audioSFX = false;

    /**
     * Controls the availability of music.
     */
    public boolean audioMusic = false;

    /**
     * Controls the availability of game-pad input.
     */
    public boolean gamePad = false;

    /**
     * Controls the availability of computer keyboard input.
     */
    public boolean keyboard = false;

    /**
     * Controls the availability of mouse input.
     */
    public boolean mouse = false;

    /**
     * Controls the availability of touch input.
     */
    public boolean touch = false;

    /**
     * Signals a official supported environment. If false then it doesn't mean the environment cannot run the game,
     * but the status is not official tested. As result the game may runs fine; laggy or is completely broken.
     */
    public boolean supported = false;

    /**
     * Controls the usage of the workaround for the iOS7 WebSQL DB bug.
     */
    public boolean iosWebSQLFix = false;

    /* static {
        audioSFX = ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) == true);
        audioMusic = ((Browser.chrome || Browser.safari) == true);
        gamePad = ((Browser.chrome && !!navigator.webkitGetGamepads) == true);
        keyboard = (Browser.mobile != true);
        mouse = (Browser.mobile != true);
        touch = (Browser.mobile == true);
        supported = ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) == true);
        iosWebSQLFix = ((Browser.ios && Browser.version == 7) == true);
    } */
}
