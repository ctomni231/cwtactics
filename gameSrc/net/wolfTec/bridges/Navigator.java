package net.wolfTec.bridges;

import org.stjs.javascript.Map;

public class Navigator {
	public native Map<String, Object> getGamepads();

	public native Map<String, Object> webkitGetGamepads();
}
