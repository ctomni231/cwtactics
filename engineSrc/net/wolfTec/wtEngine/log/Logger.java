package net.wolfTec.wtEngine.log;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public abstract class Logger {
	
	public native void info(String msg);

	public native void warn(String msg);

	public native void error(String msg);
}
