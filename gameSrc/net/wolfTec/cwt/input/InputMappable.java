package net.wolfTec.cwt.input;

import org.stjs.javascript.Map;

public interface InputMappable {

  Map<String, Integer> getInputMapping();
  
  String getInputMappingName ();

  void setInputMapping(Map<String, Integer> map);
}
