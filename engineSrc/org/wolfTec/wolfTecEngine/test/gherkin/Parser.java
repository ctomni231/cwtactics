package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolfTec.wolfTecEngine.components.JsUtil;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;

public class Parser {
  
  private static Map<String, Array<String>> syntax;
  
  public static enum SyntaxToken {
    ROOT,
    FEATURE,
    SCENARIO,
    GIVEN,
    WHEN,
    THEN
  }
  
  static {
    syntax = ContainerUtil.createMap();

    syntax.$put(SyntaxToken.ROOT.name(), JsUtil.splitString("FEATURE", ""));
    syntax.$put(SyntaxToken.FEATURE.name(), JsUtil.splitString("SCENARIO", ""));
    syntax.$put("SCENARIO", JsUtil.splitString("GIVEN", ""));
    syntax.$put("GIVEN", JsUtil.splitString("WHEN", ""));
    syntax.$put("WHEN", JsUtil.splitString("THEN", ""));
    syntax.$put("THEN", JsUtil.splitString("SCENARIO", ""));
  }
  
  public Feature parseContent (String content) {
    Feature feature = new Feature();
    
    Array<String> lines = JsUtil.splitString(content, "\n");
    for (int lineIndex = 0; lineIndex < lines.$length(); lineIndex++) {
      String line = lines.$get(lineIndex);
      
    }
    
    return feature;
  }

  private void p_and_scenario (Array<String> holder, String line) {
  }

  private void p_and_given (Array<String> holder, String line) {
  }

  private void p_and_when (Array<String> holder, String line) {
  }

  private void p_and_then (Array<String> holder, String line) {
  }

  private void p_and_and (Array<String> holder, String line) {
  }
  
  private void p_token_text (Array<String> holder, String line) {
    holder.push(line);
  }
}
