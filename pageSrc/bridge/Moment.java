package bridge;

public class Moment {
	public native boolean isAfter (String date);
	public native String fromNow ();
	public native String add (String mod, int amount);
}
