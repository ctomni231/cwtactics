package org.wolftec.cwt.parameters;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.Plugins;
import org.wolftec.cwt.util.UrlParameterUtil;

public class Parameters
{
  public void invokeAllUrlParameterActions(Callback0 whenDone)
  {
    Log log = new Log(this);
    Plugins<ParameterAction> actions = new Plugins<>(ParameterAction.class);
    Map<String, String> parameters = UrlParameterUtil.getParameters();

    ListUtil.forEachArrayValueAsync(actions.getPlugins(), (index, action, next) ->
    {
      String parameterKey = action.watchesOnParameterKey();
      String parameterValue = parameters.$get(parameterKey);

      if (NullUtil.isPresent(parameterValue))
      {
        if (!action.isValid(parameterValue))
        {
          log.warn("url parameter value " + parameterValue + " for key " + parameterKey
              + " is not valid. Will be ingored.");
          next.$invoke();
        }
        else
        {
          action.handle(parameterValue, next);
        }
      }
      else
      {
        next.$invoke();
      }

    } , whenDone);
  }
}
