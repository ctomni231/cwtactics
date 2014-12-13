package bridge;

public class Dialog {
	public native void open();
	public native void close();
	public native void destroy();
	public native DialogOption option();
	public native boolean isOpen();
}
