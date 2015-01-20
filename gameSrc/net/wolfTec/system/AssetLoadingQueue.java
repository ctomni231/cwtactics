package net.wolfTec.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

/**
 * 
 * <strong>Low-Level class</strong>
 */
public class AssetLoadingQueue {

	@SyntheticType public static class AssetLoadingItem {
		public String	id;
		public Object	data;
	}

	private Object											loadingQueue;
	private Callback1<AssetLoadingItem>	itemCallback;
	private Callback0										finalCallback;

	public AssetLoadingQueue(Callback1<AssetLoadingItem> itemCallback, Callback0 finalCallback) {
		this.loadingQueue = JSObjectAdapter.$js("new createjs.LoadQueue()");
		JSObjectAdapter.$js("loadingQueue.installPlugin(createjs.Sound)");
		
		this.itemCallback = itemCallback;
		this.finalCallback = finalCallback;

		JSObjectAdapter.$js("loadingQueue.on(\"complete\", this.iterateItems, this)");
	}

	/**
	 * Called after the loading of all assets is completed.
	 */
	private void iterateItems() {
		Array<AssetLoadingItem> items = JSObjectAdapter.$js("loadingQueue.getLoadedItems()");
		for (int i = 0; i < items.$length(); i++) {
			this.itemCallback.$invoke(items.$get(i));
		}
		this.finalCallback.$invoke();
	}

	/**
	 * Adds an asset to the loading queue.
	 * 
	 * @param id
	 * @param path
	 */
	public void addAsset(String id, String path) {
		JSObjectAdapter.$js("loadingQueue.loadFile({id:id, src:path, loadNow=false})");
	}

	public void loadAssets() {
		JSObjectAdapter.$js("loadingQueue.load()");

		// release stuff
		loadingQueue = null;
		itemCallback = null;
		finalCallback = null;
	}
}
