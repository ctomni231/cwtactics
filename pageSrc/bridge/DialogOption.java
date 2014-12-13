package bridge;

import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;

@SyntheticType @STJSBridge public class DialogOption {
	public Map<String, Callback0> buttons;
	public boolean closeOnEscape;
	public boolean draggable;
	public boolean autoOpen;
	public int height;
	public int width;
	public int maxHeight;
	public int maxWidth;
	public int minHeight;
	public int minWidth;
	public boolean modal;
	public boolean resizable;
	public String title;
	public DialogStateChangeOption show;
	public DialogStateChangeOption hide;
}
