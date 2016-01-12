package org.wolftec.cwt.system;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.loading.GameLoadingHandler;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.PersistenceManager;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.UrlParameterUtil;

public class SystemResetter implements GameLoadingHandler
{

  public static final String PARAM_WIPEOUT = "resetData";

  private Log                log;
  private PersistenceManager pm;

  @Override
  public int priority()
  {
    return +999;
  }

  @Override
  public void onLoad(Callback0 done)
  {
    String wipeOutValue = UrlParameterUtil.getParameter(PARAM_WIPEOUT);

    if (NullUtil.isPresent(wipeOutValue))
    {
      if (!(wipeOutValue == "1" || wipeOutValue == "true"))
      {
        log.warn("IllegalUrlParameter: " + PARAM_WIPEOUT + "can only true or 1");
        return;
      }

      wipeAndReload();
    }

    done.$invoke();
  }

  public void wipeAndReload()
  {
    pm.clear((error) ->
    {
      String href = Global.window.document.location.href;
      Global.window.document.location.replace(href.substring(0, href.indexOf("?")));
    });
  }

}
