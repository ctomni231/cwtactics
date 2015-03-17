package org.wolftec.persistence;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.JsExec;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
public class JsonConverter implements Serializer<Map<String, Object>> {

  @Override
  public void deserialize(String data, Callback1<Map<String, Object>> cb) {
    cb.$invoke(JsExec.injectJS("JSON.parse(data)"));
  }

  @Override
  public void serialize(Map<String, Object> data, Callback1<String> cb) {
    cb.$invoke(JsExec.injectJS("JSON.stringify(data)"));
  }

}
