package org.wolfTec.cwt.game.action;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.vfs.JsonFileSerializer;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.persistence.Serializer;
import org.wolftec.validation.ValidationManager;

@ManagedComponent
public class ActionConverter implements Serializer {
  
  @Injected
  private JsonFileSerializer jsonSer;

  @Injected
  private ValidationManager validation;
  
  @Override
  public void deserialize(String data, Callback1<Object> cb) {
    jsonSer.deserialize(data, (dataObj) -> {
      validation.hasValidData(dataObj, ActionItem.class);
      cb.$invoke(dataObj);
    });
  }

  @Override
  public void serialize(Object data, Callback1<Object> cb) {
    jsonSer.serialize(data, cb);
  }

}
