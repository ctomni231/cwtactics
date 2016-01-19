package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;

public class Plugins<T>
{
  private Array<T> plugins;

  public Plugins(Class<T> type)
  {
    grabPlugins(type);
  }

  private void grabPlugins(Class<T> type)
  {
    plugins = JSCollections.$array();

    Object namespaceObject = ObjectUtil.getGlobalProperty(Constants.NAMESPACE);
    ClassUtil.forEachClassOfNamespace(namespaceObject, (name, ctype) ->
    {
      if (ClassUtil.classImplementsInterface(ctype, type))
      {
        plugins.push((T) ClassUtil.newInstance(ctype));
      }
    });

    ObjectUtil.freezeObject(plugins);
  }

  public Array<T> getPlugins()
  {
    return plugins;
  }

  public void forEach(Callback1<T> iteratorCallback)
  {
    for (int i = 0; i < plugins.$length(); i++)
    {
      iteratorCallback.$invoke(plugins.$get(i));
    }
  }

  public void asyncForEach(Callback2<T, Callback0> iteratorCallback, Callback0 whenDone)
  {
    ListUtil.forEachArrayValueAsync(plugins, (index, plugin, next) -> iteratorCallback.$invoke(plugin, next), whenDone);
  }
}
