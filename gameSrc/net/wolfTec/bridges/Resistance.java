package net.wolfTec.bridges;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public abstract class Resistance {
	public native void series(Array<Callback1<Callback0>> functions, Callback0 finishCb);

	public native void parallel(Array<Callback1<Callback0>> functions, Callback0 finishCb);
}
