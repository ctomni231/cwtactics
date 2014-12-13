package webpage;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback;

@Namespace("cwt") public abstract class EventHandler {

	/**
	 * Registers an event handler which will be invoked every time the event with
	 * the given name will be triggered.
	 * 
	 * @param name
	 * @param callback
	 */
	public static void onEvent(String name, Callback callback) {
		bridge.Global.$(Global.window.document).on(name, callback);
	}

	/**
	 * Fires an event and invokes all event handlers.
	 * 
	 * @param name
	 * @param data
	 */
	public static void fireEvent(String name, Array<?> data) {
		bridge.Global.$(org.stjs.javascript.Global.window.document).trigger(name, data);
	}
}
