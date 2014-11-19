package net.wolfTec.bridges;

import org.stjs.javascript.Map;

public abstract class JSON {

    public native String stringify (Object object);

    public native Map<String,?> parse (String str);
}
