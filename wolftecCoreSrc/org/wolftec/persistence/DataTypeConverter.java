package org.wolftec.persistence;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.validation.ValidationManager;

public abstract class DataTypeConverter<T> implements Serializer<T> {

  @Injected
  private JsonConverter json;

  @Injected
  private ValidationManager validation;

  public abstract Class<?> getDataTypeClass();

  @Override
  public void deserialize(String data, Callback1<T> cb) {
    json.deserialize(data, (mapData) -> {
      if (validation.validate(mapData, getDataTypeClass())) {
        cb.$invoke((T) cb);

      } else {
        JsUtil.raiseError("IllegalObjectData");
        cb.$invoke(null);
      }
    });
  }

  @Override
  public void serialize(T data, Callback1<String> cb) {
    if (validation.validate(data, getDataTypeClass())) {
      json.serialize(((Map<String, Object>) ((Object) data)), cb);

    } else {
      JsUtil.raiseError("IllegalObjectData");
      cb.$invoke(null);
    }
  }

}
