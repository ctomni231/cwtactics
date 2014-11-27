package net.wolfTec.bridges;

import net.wolfTec.bridges.webAudio.AudioContext;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.functions.Callback;

@GlobalScope
public class Window {

    public static LocalForage localForage;

    public static Resistance R;

    public static net.wolfTec.bridges.webAudio.AudioContext webkitAudioContext;
    public static AudioContext AudioContext;
    public static Base64Helper Base64Helper;

    public static native void requestAnimationFrame(Callback function);
}
