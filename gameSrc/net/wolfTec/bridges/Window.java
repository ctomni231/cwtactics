package net.wolfTec.bridges;

import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

@GlobalScope
public class Window {

    public static JSON JSON;

    public static Console console;

    public static LocalForage localForage;

    public Document document;

    public Navigator navigator;

    public Screen screen;

    public int innerHeight;
    public int innerWidth;

    public int outerHeight;
    public int outerWidth;
    public int pageXOffset;
    public int pageYOffset;

    public int screenLeft;
    public int screenTop;
    public int screenX;
    public int screenY;

    public static native void requestAnimationFrame(Callback0 loop);

    public static native void addEventListener(String type, Callback1<DOMEvent> listener);

    public static native void addEventListener(String type, Callback1<DOMEvent> listener, boolean useCapture);

    public static native void removeEventListener(String type, Callback1<DOMEvent> listener);

    public static native void removeEventListener(String type, Callback1<DOMEvent> listener, boolean useCapture);

    public static native boolean dispatchEvent(DOMEvent event);
}
