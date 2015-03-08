package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.vfs.Serializer;
import org.wolfTec.wolfTecEngine.logging.Logger;

public class GherkinFileConverter implements Serializer {

  private Logger p_log;
  private Parser p_parser;
  
  public GherkinFileConverter(Logger log) {
    p_log = log;
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
