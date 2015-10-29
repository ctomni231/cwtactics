package org.wolftec.cwt.core.config;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.persistence.SaveAppdataHandler;
import org.wolftec.cwt.core.persistence.SavegameHandler;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.NumberUtil;
import org.wolftec.cwt.core.util.UrlParameterUtil;

public class ConfigPeristence implements GameLoader, SaveAppdataHandler<Map<String, Integer>>, SavegameHandler<Map<String, Integer>> {

  private ConfigurableValueManager cfgManager;

  private Log log;

  @Override
  public int priority() {
    return 1;
  }

  private void grabConfigFromUrl(String paramName, ConfigurableValue cfg) {
    String cfgParamValue = UrlParameterUtil.getParameter(paramName);
    if (NullUtil.isPresent(cfgParamValue)) {
      if (cfgParamValue != "0" && cfgParamValue != "1") {
        log.warn("illegal cfg value for " + paramName + " in the url -> will be ignored");
        return;
      }

      cfg.setValue(NumberUtil.asInt(cfgParamValue));
    }
  }

  @Override
  public void onLoad(Callback0 done) {
    cfgManager.forEachConfig((cfg) -> {
      if (isAppCfg(cfg)) {
        grabConfigFromUrl(cfg.key, cfg);
      }
    });
    done.$invoke();
  }

  @Override
  public void onAppLoad(Map<String, Integer> data) {
    cfgManager.forEachConfig((cfg) -> {
      if (isAppCfg(cfg)) {
        saveConfig(data, cfg);
      }
    });
  }

  @Override
  public void onAppSave(Map<String, Integer> data) {
    cfgManager.forEachConfig((cfg) -> {
      if (isAppCfg(cfg)) {
        loadConfig(data, cfg);
      }
    });
  }

  @Override
  public void onGameLoad(Map<String, Integer> data) {
    cfgManager.forEachConfig((cfg) -> {
      if (!isAppCfg(cfg)) {
        saveConfig(data, cfg);
      }
    });
  }

  @Override
  public void onGameSave(Map<String, Integer> data) {
    cfgManager.forEachConfig((cfg) -> {
      if (!isAppCfg(cfg)) {
        loadConfig(data, cfg);
      }
    });
  }

  public void saveConfig(Map<String, Integer> data, ConfigurableValue cfg) {
    cfg.setValue(NullUtil.getOrElse(data.$get(cfg.key), cfg.def));
  }

  public void loadConfig(Map<String, Integer> data, ConfigurableValue cfg) {
    data.$put(cfg.key, cfg.value);
  }

  public boolean isAppCfg(ConfigurableValue cfg) {
    return cfg.key.startsWith("app.");
  }
}
