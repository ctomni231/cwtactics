package org.wolftec.cwt.config;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.core.config.ConfigurableValue;
import org.wolftec.cwt.core.util.NumberUtil;
import org.wolftec.cwt.core.util.UrlParameterUtil;
import org.wolftec.cwt.system.Log;

public class UrlConfigReader implements GameLoader {

  public static final String PARAM_FORCE_TOUCH     = "forceTouch";
  public static final String PARAM_ANIMATED_TILES  = "animatedTiles";
  public static final String PARAM_FAST_CLICK_MODE = "fastClickMode";

  private Log            log;
  private OptionsManager options;

  @Override
  public int priority() {
    return 1;
  }

  private void grabConfigFromUrl(String paramName, ConfigurableValue cfg) {
    UrlParameterUtil.getParameter(paramName).ifPresent((value) -> {
      if (value != "0" && value != "1") {
        log.warn("IllegalUrlParameter: " + paramName + " will be ignored");
        return;
      }

      cfg.setValue(NumberUtil.convertStringToInt(value));
    });
  }

  @Override
  public void onLoad(Callback0 done) {
    grabConfigFromUrl(PARAM_FORCE_TOUCH, options.forceTouch);
    grabConfigFromUrl(PARAM_ANIMATED_TILES, options.animatedTiles);
    grabConfigFromUrl(PARAM_FAST_CLICK_MODE, options.fastClickMode);
    done.$invoke();
  }
}
