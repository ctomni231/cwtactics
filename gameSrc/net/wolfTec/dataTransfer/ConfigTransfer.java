package net.wolfTec.dataTransfer;

import net.wolfTec.input.InputHandlerBean;
import net.wolfTec.system.StorageBean;
import net.wolfTec.system.StorageBean.StorageEntry;
import net.wolfTec.utility.Debug;
import net.wolfTec.wtEngine.model.GameRoundBean;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public class ConfigTransfer {
	
	public static final String PARAM_ANIMATED_TILES = "animatedTiles";

	public static final String PARAM_FORCE_TOUCH = "forceTouch";

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

}
