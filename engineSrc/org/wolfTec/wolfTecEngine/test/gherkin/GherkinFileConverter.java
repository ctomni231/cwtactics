package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.vfs.Serializer;

@ManagedComponent
public class GherkinFileConverter implements Serializer, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger p_log;
  
  private Parser p_parser;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_parser = new Parser();
  }
  
  @Override
  public void deserialize(String data, Callback1<Object> cb) {
    cb.$invoke(p_parser.parseContent(data));
  }

  @Override
  public void serialize(Object data, Callback1<Object> cb) {
    p_log.error("UnsupportedOperationException");
  }

}
