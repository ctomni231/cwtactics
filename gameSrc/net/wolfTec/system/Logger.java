package net.wolfTec.system;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public class Logger {
	
	public native void trace(String msg);

	public native void debug(String msg);

	public native void info(String msg);

	public native void warn(String msg);

	public native void error(String msg);
}
