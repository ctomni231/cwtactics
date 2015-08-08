package org.wolftec.cwt.dataGrabber;

import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.core.Injectable;

public class ConfigDt implements Injectable {

  public static final String PARAM_WIPEOUT        = "resetData";
  public static final String PARAM_FORCE_TOUCH    = "forceTouch";
  public static final String PARAM_ANIMATED_TILES = "animatedTiles";

  private PersistenceManager pm;

  // public void loadParameter (String paramName, Callback0 callback) {
  // pm.get(paramName, (err, obj) -> {
  // var value;
  //
  // if (obj) {
  // Config.getConfig(paramName).setValue(obj.value ? 1 : 0);
  // } else {
  // var param = functions.getQueryParams(document.location.search)[paramName];
  // if (typeof param !== "undefined") {
  // value = (param === "1"? 1 : 0);
  // }
  // }
  //
  // if (typeof value !== "undefined") {
  // Config.getConfig(paramName).setValue(value);
  // }
  //
  // callback.$invoke();
  // });
  // }
  //
  // public void save(Callback0 callback) {
  // pm.set(PARAM_FORCE_TOUCH, (Config.getValue("forceTouch") == 1), () -> {
  // pm.set(PARAM_ANIMATED_TILES, (Config.getValue("animatedTiles") == 1), () ->
  // {
  // callback.$invoke();
  // });
  // });
  // };
  //
  // public void load(Callback0 callback) {
  // loadParameter(PARAM_FORCE_TOUCH, () -> {
  // loadParameter(PARAM_ANIMATED_TILES, callback);
  // });
  // };
  //
  // public boolean wantResetData() {
  // return UrlParameterUtil.getUrlParameter(PARAM_WIPEOUT) == "1";
  // }
}
