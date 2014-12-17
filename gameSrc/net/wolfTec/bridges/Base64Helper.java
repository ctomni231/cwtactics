package net.wolfTec.bridges;

import net.wolfTec.bridges.webAudio.AudioBuffer;
import org.stjs.javascript.dom.Element;

public abstract class Base64Helper {

	public native AudioBuffer decodeBuffer(Object buffer);

	public native String canvasToBase64(Element image);

	public native Element base64ToImage(String imageData);
}
