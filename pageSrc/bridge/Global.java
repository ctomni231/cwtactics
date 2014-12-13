package bridge;

import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.dom.Document;
import org.stjs.javascript.dom.Element;

@GlobalScope
public class Global {
  public static JQuery $;
  public static Resistance R;
  public static LocalStorage localStorage;
	public static native JQuery $(String query);
	public static native JQuery $(Element element);
	public static native JQuery $(Document element);
	public static native Moment moment();
	public static native Moment moment(String date, String pattern);
}
