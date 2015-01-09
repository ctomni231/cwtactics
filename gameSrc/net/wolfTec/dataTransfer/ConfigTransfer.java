package net.wolfTec.dataTransfer;

import net.wolfTec.input.InputHandlerBean;
import net.wolfTec.model.GameRoundBean;
import net.wolfTec.system.StorageBean;
import net.wolfTec.system.StorageBean.StorageEntry;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public class ConfigTransfer {
	
	public static final String PARAM_ANIMATED_TILES = "animatedTiles";

	public static final String PARAM_FORCE_TOUCH = "forceTouch";

	public static final String MAPPING_STORAGE_KEY = "keyboardMapping";

	private URLParameterTransfer $urlParameterDto;
	private InputHandlerBean $inputHandler;
	private GameRoundBean $gameround;

	public void saveAppConfig(Callback0 callback) {
		String valueAnimated = $gameround.getCfg(PARAM_ANIMATED_TILES).getValue() == 1 ? "1" : "0";
		String valueForceTouch = $gameround.getCfg(PARAM_FORCE_TOUCH).getValue() == 1 ? "1" : "0";

		StorageBean.set(PARAM_ANIMATED_TILES, valueAnimated, new Callback2<Object, Object>() {
			public void $invoke(Object arg0, Object arg1) {
				StorageBean.set(PARAM_ANIMATED_TILES, valueForceTouch, new Callback2<Object, Object>() {
					public void $invoke(Object arg0, Object arg1) {
						if (callback != null) {
							callback.$invoke();
						}
					};
				});
			};
		});
	}

	public void loadAppConfig(Callback0 callback) {
		 
	}

	/**
	 * Saves the current active input mapping into the user storage.
	 */
	public void saveKeyMapping(Callback0 cb) {
		Map<String, Map> mapping = JSCollections.$map();
		mapping.$put("keyboard", $inputHandler.KEYBOARD_MAPPING);
		mapping.$put("gamePad", $inputHandler.GAMEPAD_MAPPING);

		StorageBean.set(MAPPING_STORAGE_KEY, mapping, new Callback2<Object, Object>() {
			@Override public void $invoke(Object arg0, Object arg1) {
				Debug.logInfo(null, "Successfully saved user input mapping");
				if (cb != null)
					cb.$invoke();
			}
		});
	}

	/**
	 * Loads the keyboard input mapping from the user storage. If no user input
	 * setting will be found then the default mapping will be used.
	 *
	 * @param cb
	 */
	public void loadKeyMapping(Callback0 cb) {
		StorageBean.get(MAPPING_STORAGE_KEY, new Callback1<StorageBean.StorageEntry>() {
			@Override public void $invoke(StorageEntry arg0) {
				if (arg0 != null && arg0.value != null) {
					Map<String, Map<String, Integer>> mapping = (Map<String, Map<String, Integer>>) arg0.value;

					if (JSObjectAdapter.hasOwnProperty(mapping, "keyboard")) {
						$inputHandler.KEYBOARD_MAPPING = mapping.$get("keyboard");
					}

					if (JSObjectAdapter.hasOwnProperty(mapping, "gamePad")) {
						$inputHandler.GAMEPAD_MAPPING = mapping.$get("gamePad");
					}

					if (cb != null)
						cb.$invoke();
				}
			}
		});
	}
}
