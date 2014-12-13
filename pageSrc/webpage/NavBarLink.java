package webpage;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Anchor;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;

import webpage.datatypes.NavBarLinkDesc;
import bridge.Global;

@Namespace("cwt") public class NavBarLink {

	public static final String SECTION_NAME = "#navbar";

	private String ref;

	public NavBarLink(NavBarLinkDesc desc) {
		Log.fine("Generate navigation bar link " + desc.id);

		this.ref = "#" + desc.id;
		buildElement(desc);
	}
	
	/**
	 * Builds the navigation bar.
	 * 
	 * @param desc
	 */
	private void buildElement(final NavBarLinkDesc desc) {	
		Anchor link = DomHelper.createLink();
		
		if (desc.isDialog == true) {
			link.href = "#";
			link.onclick = new Function1<DOMEvent, Boolean>() {
				public Boolean $invoke(DOMEvent ev) {
					EventHandler.fireEvent("openDialog", JSCollections.$array(desc.link));
					return false;
				}
			};
			
		} else {
			link.href = desc.link;
			if (desc.sameWindow != true) {
				link.target = "_blank";
			}
		}
		
		link.title = desc.label;
		link.innerHTML = desc.label;

		Global.$(SECTION_NAME).append(link);
	}

	public void click() {
		Global.$(ref).click();
	}
}
