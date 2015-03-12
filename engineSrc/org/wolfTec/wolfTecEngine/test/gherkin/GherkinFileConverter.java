package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.vfs.Serializer;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;

@ManagedComponent
public class GherkinFileConverter implements Serializer<Feature>, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger p_log;
  
  private Parser p_parser;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_parser = new Parser();
  }
  
  @Override
  public void deserialize(String data, Callback1<Feature> cb) {
    cb.$invoke(p_parser.parseContent(data));
  }

  @Override
  public void serialize(Feature data, Callback1<String> cb) {
    p_log.error("UnsupportedOperationException");
  }

}
