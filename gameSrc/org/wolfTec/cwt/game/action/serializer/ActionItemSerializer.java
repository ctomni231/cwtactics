package org.wolfTec.cwt.game.action.serializer;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.vfs.Serializer;
import org.wolfTec.wolfTecEngine.util.JsExec;

public class ActionItemSerializer implements Serializer {

  @Override
  public void deserialize(String data, Callback1<Object> cb) {
    // TODO validate
    cb.$invoke(JsExec.injectJS("JSON.parse(data)"));
  }

  @Override
  public void serialize(Object data, Callback1<Object> cb) {
    cb.$invoke(JsExec.injectJS("JSON.stringify(data)"));
  }

}
