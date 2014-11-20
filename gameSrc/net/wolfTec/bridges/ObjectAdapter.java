package net.wolfTec.bridges;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Adapter;

@Adapter
public abstract class ObjectAdapter {

    public static native Array<String> keys(Object obj);
}
