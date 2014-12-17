package net.wolfTec.bridges;

import org.stjs.javascript.dom.DOMEvent;

public class TouchEvent extends DOMEvent {
	public native void preventDefault();

	public TouchEventFinger[]	touches;
	public int	              timeStamp;
}
