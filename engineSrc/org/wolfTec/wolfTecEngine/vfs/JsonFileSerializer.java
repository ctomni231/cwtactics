package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;

/**
 * Simple object serializer which uses JSON to convert objects to strings and
 * strings to objects.
 */
@ManagedComponent
public class JsonFileSerializer implements Serializer<Map<String, Object>> {

  @Override
  public void deserialize(String data, Callback1<Map<String, Object>> cb) {
    cb.$invoke(JsExec.injectJS("JSON.parse(data)"));
  }

  @Override
  public void serialize(Map<String, Object> data, Callback1<String> cb) {
    cb.$invoke(JsExec.injectJS("JSON.stringify(data)"));
  }

}
