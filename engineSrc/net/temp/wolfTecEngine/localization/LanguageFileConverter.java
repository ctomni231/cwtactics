package net.temp.wolfTecEngine.localization;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.JsExec;
import org.wolftec.persistence.Serializer;

public class LanguageFileConverter implements Serializer<Map<String, String>> {

  @Override
  public void deserialize(String data, Callback1<Map<String, String>> cb) {
    cb.$invoke(JsExec.injectJS("JSON.parse(data)"));
  }

  @Override
  public void serialize(Map<String, String> data, Callback1<String> cb) {
    cb.$invoke(JsExec.injectJS("JSON.stringify(data)"));
  }

}
