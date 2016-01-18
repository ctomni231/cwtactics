package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.Constants;

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
}
