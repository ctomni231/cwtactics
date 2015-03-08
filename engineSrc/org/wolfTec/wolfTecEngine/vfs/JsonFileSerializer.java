package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;

/**
 * Simple object serializer which uses JSON to convert objects to strings and
 * strings to objects.
 */
@ManagedComponent
public class JsonFileSerializer implements Serializer {

  @Override
  public void deserialize(String data, Callback1<Object> cb) {
    cb.$invoke(JsExec.injectJS("JSON.parse(data)"));
  }

  @Override
  public void serialize(Object data, Callback1<Object> cb) {
    cb.$invoke(JsExec.injectJS("JSON.stringify(data)"));
  }

}
