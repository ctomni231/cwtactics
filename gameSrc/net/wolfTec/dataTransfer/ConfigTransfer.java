package net.wolfTec.dataTransfer;

import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.input.InputHandler;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.Storage;
import net.wolfTec.utility.Storage.StorageEntry;

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
	private InputHandler $inputHandler;

	public void saveAppConfig(Callback0 callback) {
		String valueAnimated = CustomWarsTactics.configs.$get(PARAM_ANIMATED_TILES).getValue() == 1 ? "1" : "0";
		String valueForceTouch = CustomWarsTactics.configs.$get(PARAM_FORCE_TOUCH).getValue() == 1 ? "1" : "0";

		Storage.set(PARAM_ANIMATED_TILES, valueAnimated, new Callback2<Object, Object>() {
			public void $invoke(Object arg0, Object arg1) {
				Storage.set(PARAM_ANIMATED_TILES, valueForceTouch, new Callback2<Object, Object>() {
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
		CustomWarsTactics.configs.$get(PARAM_ANIMATED_TILES).setValue(0);
		CustomWarsTactics.configs.$get(PARAM_FORCE_TOUCH).setValue(0);

		Storage.get(PARAM_ANIMATED_TILES, new Callback1<Storage.StorageEntry>() {
			@Override public void $invoke(StorageEntry entry) {
				if (entry != null) {
					CustomWarsTactics.configs.$get(PARAM_ANIMATED_TILES).setValue(entry.value == "1" ? 1 : 0);
				}

				// forceTouch can be overruled by a URL parameter
				if ($urlParameterDto.wantsForceTouch()) {
					CustomWarsTactics.configs.$get(PARAM_FORCE_TOUCH).setValue(1);
					callback.$invoke();

				} else {
					// load value from storage
					Storage.get(PARAM_FORCE_TOUCH, new Callback1<Storage.StorageEntry>() {
						@Override public void $invoke(StorageEntry entry) {
							if (entry != null && (Boolean) entry.value == true) {
								CustomWarsTactics.configs.$get(PARAM_FORCE_TOUCH).setValue(1);
							}

							if (callback != null) {
								callback.$invoke();
							}
						}
					});
				}
			}
		});
	}

	/**
	 * Saves the current active input mapping into the user storage.
	 */
	public void saveKeyMapping(Callback0 cb) {
		Map<String, Map> mapping = JSCollections.$map();
		mapping.$put("keyboard", $inputHandler.KEYBOARD_MAPPING);
		mapping.$put("gamePad", $inputHandler.GAMEPAD_MAPPING);

		Storage.set(MAPPING_STORAGE_KEY, mapping, new Callback2<Object, Object>() {
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
		Storage.get(MAPPING_STORAGE_KEY, new Callback1<Storage.StorageEntry>() {
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
