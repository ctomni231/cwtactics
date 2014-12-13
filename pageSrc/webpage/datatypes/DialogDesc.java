package webpage.datatypes;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.SyntheticType;

@Namespace("cwt") @SyntheticType public class DialogDesc {
	public String id;
	public String title;
	public Array<String> text;
}