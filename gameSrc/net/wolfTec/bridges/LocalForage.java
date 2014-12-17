package net.wolfTec.bridges;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback0;

public abstract class LocalForage {

	public native void config(Map<String, Object> config);

	public native <T> void getItem(String key, Callback1<T> callback);

	public native <T> void setItem(String key, T value, Callback2<Object, ?> callback);

	public native void keys(Callback1<Array<String>> callback);

	public native void clear(Callback0 callback);

	public native void removeItem(String key, Callback0 callback);
}
