package webpage.datatypes;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.SyntheticType;

@Namespace("cwt") @SyntheticType public class NavBarLinkDesc {
	public String id;
	public String link;
	public String label;
	public String title;
	public boolean sameWindow;
	public boolean isDialog;
}
