package org.wolftec.wCore.persistence;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.validation.ValidationManager;

public class DataTypeConverter<T> implements Serializer<T> {

  // TODO data class by constructor
  private Class<?> dataClass;
  private JsonConverter json;

  public DataTypeConverter(Class<T> clazz) {
    dataClass = clazz;
  }

  @Injected
  private ValidationManager validation;

  @Override
  public void deserialize(String data, Callback1<T> cb) {
    json.deserialize(data, (mapData) -> {
      if (validation.validate(mapData, dataClass)) {
        cb.$invoke((T) cb);

      } else {
        JsUtil.raiseError("IllegalObjectData");
        cb.$invoke(null);
      }
    });
  }

  @Override
  public void serialize(T data, Callback1<String> cb) {
    if (validation.validate(data, dataClass)) {
      json.serialize(((Map<String, Object>) ((Object) data)), cb);

    } else {
      JsUtil.raiseError("IllegalObjectData");
      cb.$invoke(null);
    }
  }

}
