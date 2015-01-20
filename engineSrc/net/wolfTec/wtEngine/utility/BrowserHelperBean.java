package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public class BrowserHelperBean {
	
	/**
	 * 
	 * @param param
	 * @return
	 */
	public String getUrlParameter(String param) {
		Object parameter = JSObjectAdapter.$js("getURLQueryParams(document.location.search)[param]");
		return JSObjectAdapter.$js("parameter !== undefined? parameter : null");
	}
}
