package webpage.datatypes;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.SyntheticType;

@Namespace("cwt") @SyntheticType public class ContentPanelDesc {

	@SyntheticType public static class ChangelogDesc {

		public Array<String> NEW;
		public Array<String> CHANGED;
		public Array<String> FIXED;
	}

	public String header;
	public String version;
	public String subHeaderT;
	public String subHeaderB;

	public Array<String> text;

	public String img;
	public String link;

	public ChangelogDesc log;
}
