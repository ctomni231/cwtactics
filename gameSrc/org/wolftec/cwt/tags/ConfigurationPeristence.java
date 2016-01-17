package org.wolftec.cwt.tags;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.loading.GameLoadingHandler;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.SaveAppdataHandler;
import org.wolftec.cwt.serialization.SavegameHandler;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.NumberUtil;
import org.wolftec.cwt.util.UrlParameterUtil;

public class ConfigurationPeristence
    implements GameLoadingHandler, SaveAppdataHandler<Map<String, Integer>>, SavegameHandler<Map<String, Integer>>
{

  private ConfigurationManager cfgManager;
  private Log log;

  @Override
  public int priority()
  {
    return 1;
  }

  private void grabConfigFromUrl(String paramName, Configuration cfg)
  {
    String cfgParamValue = UrlParameterUtil.getParameter(paramName);
    if (NullUtil.isPresent(cfgParamValue))
    {
      if (cfgParamValue != "0" && cfgParamValue != "1")
      {
        log.warn("illegal cfg value for " + paramName + " in the url -> will be ignored");
        return;
      }

      cfg.setValue(NumberUtil.asInt(cfgParamValue));
    }
  }

  private void saveConfig(Map<String, Integer> data, Configuration cfg)
  {
    cfg.setValue(NullUtil.getOrElse(data.$get(cfg.key), cfg.def));
  }

  private void loadConfig(Map<String, Integer> data, Configuration cfg)
  {
    data.$put(cfg.key, cfg.value);
  }

  private boolean isAppCfg(Configuration cfg)
  {
    return cfg.key.startsWith("app.");
  }

  @Override
  public void onLoad(Callback0 done)
  {
    cfgManager.forEachConfig((cfg) ->
    {
      if (isAppCfg(cfg))
      {
        grabConfigFromUrl(cfg.key, cfg);
      }
    });
    done.$invoke();
  }

  @Override
  public void onAppLoad(Map<String, Integer> data)
  {
    cfgManager.forEachConfig((cfg) ->
    {
      if (isAppCfg(cfg))
      {
        saveConfig(data, cfg);
      }
    });
  }

  @Override
  public void onAppSave(Map<String, Integer> data)
  {
    cfgManager.forEachConfig((cfg) ->
    {
      if (isAppCfg(cfg))
      {
        loadConfig(data, cfg);
      }
    });
  }

  @Override
  public void onGameLoad(Map<String, Integer> data)
  {
    cfgManager.forEachConfig((cfg) ->
    {
      if (!isAppCfg(cfg))
      {
        saveConfig(data, cfg);
      }
    });
  }

  @Override
  public void onGameSave(Map<String, Integer> data)
  {
    cfgManager.forEachConfig((cfg) ->
    {
      if (!isAppCfg(cfg))
      {
        loadConfig(data, cfg);
      }
    });
  }
}
