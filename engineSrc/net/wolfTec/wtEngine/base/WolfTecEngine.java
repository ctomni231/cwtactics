package net.wolfTec.wtEngine.base;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public class WolfTecEngine {

  public WolfTecEngine(EngineOptions options) {
    
  }

  public <T> T getBean (String bean) {
    return null;
  }
  
  public <T> T getBeanOfType (Object typeConstructor) {
    return null;
  }
  
  public String getVersion () {
    return "0.38";
  }

  public String getShortName () {
    return "wtEngine";
  }

  public String getLongName () {
    return "WolfTecEngine © BlackCat and JSRulez";
  }
}
