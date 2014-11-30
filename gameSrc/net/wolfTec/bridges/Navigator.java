package net.wolfTec.bridges;

import org.stjs.javascript.Map;

public class Navigator {
    public native Map getGamepads();
    public native Map webkitGetGamepads();
}
