package webpage;

import org.stjs.javascript.dom.Anchor;
import org.stjs.javascript.dom.LI;
import org.stjs.javascript.dom.UList;

public abstract class DomHelper {

	public static Anchor createLink () {
		return (Anchor) org.stjs.javascript.Global.window.document.createElement("a");
	}

	public static UList createList () {
		return (UList) org.stjs.javascript.Global.window.document.createElement("ul");
	}

	public static LI createListEntry () {
		return (LI) org.stjs.javascript.Global.window.document.createElement("li");
	}
}
