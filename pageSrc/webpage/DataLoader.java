package webpage;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

import webpage.datatypes.ContentPanelDesc;
import webpage.datatypes.DialogDesc;
import webpage.datatypes.NavBarLinkDesc;
import bridge.Global;

@Namespace("cwt") public abstract class DataLoader {

	/**
	 * Loads and Renders the dialogs.
	 * 
	 * @param callback
	 */
	public static void loadDialogs(final Callback1<Map<String, Dialog>> callback) {
		Log.fine("Loading dialogs");
		
		Global.$.get("data/dialogs.json", new Callback1<String>() {
			public void $invoke(String response) {
				try {
					Map<String, Dialog> dialogs = JSCollections.$map();
					Array<DialogDesc> dialogDescs = (Array<DialogDesc>) org.stjs.javascript.Global.JSON.parse(response);

					for (int i = 0; i < dialogDescs.$length(); i++) {
						dialogs.$put(dialogDescs.$get(i).id ,new Dialog(dialogDescs.$get(i)));
					}

					callback.$invoke(dialogs);
					
				} catch (Exception e) {
					ErrorHandler.doErrorHandling(e);
				}
			}
		});
	}

	/**
	 * Loads and Renders the content panel.
	 * 
	 * @param callback
	 */
	public static void loadContentPanel(final Callback1<ContentPanel> callback) {
		Log.fine("Loading content panel");
		
		Global.$.get("data/content.json", new Callback1<String>() {
			public void $invoke(String response) {
				try {
					ContentPanelDesc desc = (ContentPanelDesc) org.stjs.javascript.Global.JSON.parse(response);
					callback.$invoke(new ContentPanel(desc));
					
				} catch (Exception e) {
					ErrorHandler.doErrorHandling(e);
				}
			}
		});
	}

	/**
	 * Loads and Renders the navigation bar.
	 * 
	 * @param callback
	 */
	public static void loadNavigationBar(final Callback1<Map<String, NavBarLink>> callback) {
		Log.fine("Loading navigation bar");
		
		Global.$.get("data/navigation.json", new Callback1<String>() {
			public void $invoke(String response) {
				try {
					Map<String, NavBarLink> navLinks = JSCollections.$map();
					Array<NavBarLinkDesc> descs = (Array<NavBarLinkDesc>) org.stjs.javascript.Global.JSON.parse(response);

					for (int i = 0; i < descs.$length(); i++) {
						NavBarLinkDesc desc = descs.$get(i);
						navLinks.$put(desc.id, new NavBarLink(desc));
					}

					callback.$invoke(navLinks);
					
				} catch (Exception e) {
					ErrorHandler.doErrorHandling(e);
				}
			}
		});
	}
}
