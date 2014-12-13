package webpage;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

@Namespace("cwt") public class WebPage {

	@SuppressWarnings("unused") private static Map<String, NavBarLink> navigationBar;
	@SuppressWarnings("unused") private static ContentPanel mainContent;
	private static Map<String, Dialog> dialogs;

	public static void main(String[] args) {
		Log.fine("Initializing webpage");

		Global.window.document.title = "Custom Wars: Tactics";
		
		loadStuff();
		registerEvents();
	}
	
	/**
	 * Registers some global events.
	 */
	private static void registerEvents () {
		EventHandler.onEvent("openDialog", new Callback2<Object, String>() {
			public void $invoke(Object event, String dialogName) {
			  dialogs.$get(dialogName).show();
			}
		});
	}

	/**
	 * Loads the stuff asynchrony.
	 */
	public static void loadStuff () {
		Array<Callback1<Callback0>> tasks = JSCollections.$array();

		tasks.push(new Callback1<Callback0>() {
			public void $invoke(final Callback0 next) {
				DataLoader.loadDialogs(new Callback1<Map<String, Dialog>>() {
					public void $invoke(Map<String, Dialog> dialogs) {
						WebPage.dialogs = dialogs;
						next.$invoke();
					}
				});
			}
		});

		tasks.push(new Callback1<Callback0>() {
			public void $invoke(final Callback0 next) {
				DataLoader.loadContentPanel(new Callback1<ContentPanel>() {
					public void $invoke(ContentPanel panel) {
						WebPage.mainContent = panel;
						next.$invoke();
					}
				});
			}
		});

		tasks.push(new Callback1<Callback0>() {
			public void $invoke(final Callback0 next) {
				DataLoader.loadNavigationBar(new Callback1<Map<String, NavBarLink>>() {
					public void $invoke(Map<String, NavBarLink> bar) {
						WebPage.navigationBar = bar;
						next.$invoke();
					}
				});
			}
		});

		Callback0 loadingDone = new Callback0() {
			public void $invoke() {
				Log.fine("Webpage initialized");
				bridge.Global.$("body").css("display", "");
			}
		};

		bridge.Global.R.series(tasks, loadingDone);
	}
}
