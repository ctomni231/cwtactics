package org.wolftec.wCore.i18n;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.persistence.Serializer;

@ManagedComponent
public class LanguageFileConverter implements Serializer<Map<String, String>> {

  @Override
  public void deserialize(String data, Callback1<Map<String, String>> cb) {
    Map<String, String> dataMap = JsExec.injectJS("JSON.parse(data)");

    Array<String> dataKeys = JsUtil.getObjectKeys(dataMap);
    for (int i = 0; i < dataKeys.$length(); i++) {
      String key = dataKeys.$get(i);
      if (!JsUtil.isString(dataMap.$get(key))) {
        JsUtil.raiseError("MalformedLangugageFile");
        cb.$invoke(null);
      }
    }

    cb.$invoke(dataMap);
  }

  @Override
  public void serialize(Map<String, String> data, Callback1<String> cb) {
    JsUtil.raiseError("UnsupportedOperation");
  }

}
