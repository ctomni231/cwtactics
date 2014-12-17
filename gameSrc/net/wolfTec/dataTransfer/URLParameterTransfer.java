package net.wolfTec.dataTransfer;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;

import net.wolfTec.bridges.Globals;

public class URLParameterTransfer {

	public static final String PARAM_FORCE_TOUCH = "forceTouch";

	public static final String PARAM_WIPE_OUT = "resetData";

	private String getParam(String param) {
		Object o = Globals.getURLQueryParams(Global.window.document.location.search).$get(param);
		return JSGlobal.undefined == o ? null : (String) o;
	}

	/**
	 * 
	 * @return true, when the user wants to reset the game data by the URL, else
	 *         false
	 */
	public boolean wantsResetData() {
		return getParam(PARAM_WIPE_OUT) == "1";
	}
	
	/**
	 * 
	 * @return true, when the user wants to force the touch mode of the game by
	 *         the URL, else false
	 */
	public boolean wantsForceTouch() {
		return getParam(PARAM_FORCE_TOUCH) == "1";
	}
}
