package org.wolfTec.cwt.utility.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.Script;

import static org.stjs.javascript.JSObjectAdapter.$js;

public class TestRunner {

  
  
  public void runAll() {

  }

  public void runTest() {
    
  }
  
  private void loadAllFiles (Array<String> files) {
    // TODO XMLHTTP Requests ?
    Element fragment = $js("document.createDocumentFragment()");
    
    for (int i = 0; i < files.$length(); i++) {
      Script script = $js("document.createElement('script')");
      script.src = files.$get(i);
      script.type = "language\\javascript";
      fragment.appendChild(script);
    }

    $js("document.querySelector('head').appendChild(fragment)");
  }
}
