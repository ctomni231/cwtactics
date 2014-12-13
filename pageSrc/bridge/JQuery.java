package bridge;

import org.stjs.javascript.Array;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback;
import org.stjs.javascript.functions.Callback1;

public class JQuery {
	public native Dialog dialog(DialogOption options);
	public native Dialog dialog(String action);
	public native void append(Element element);
	public native void append(String elementBody);
	public native void append(JQuery element);
	public native void getJSON(String path, Callback1<Object> data);
	public native void get(String path, Callback1<String> data);
	public native void click();
	public native String css(String value);

	public native String html(String value);
	public native String html();
	
	public native String remove();
	
	public native void css(String name, String value);

	public native void trigger(String name, Array<?> data);
	public native void on(String name, Callback eventHandler);
}
