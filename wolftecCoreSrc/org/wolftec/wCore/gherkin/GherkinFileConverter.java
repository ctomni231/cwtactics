package org.wolftec.wCore.gherkin;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.Serializer;

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
