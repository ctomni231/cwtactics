package org.wolfTec.cwt.utility.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.RegExp;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.Script;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.log.Logger;

import static org.stjs.javascript.JSObjectAdapter.$js;

public class TestRunner {
  
  public static final String VALUE_PASSED = "PASSED";
  public static final String VALUE_FAILED = "FAILED";
  
  private Logger log;

  private FactsBase facts;
  private Array<Feature> features;

  public TestRunner() {
    features = JSCollections.$array();
  }

  public void runAll() {
    for (int i = 0; i < features.$length(); i++) {
      Feature feature = features.$get(i);

      log.info("Testing feature " + feature.name);
      log.info(feature.description);

      Array<Screnario> scenarios = feature.scenarios;
      for (int j = 0; j < scenarios.$length(); j++) {
        Screnario scenario = scenarios.$get(j);

        log.info("Scenario " + scenario.name);
        log.info(scenario.description);

        
      }
    }
  }

  // into FactsBase?
  private void fireHandler(Array<RegExp> facts, Array<Callback1<Array<String>>> handlers, String line) {
    for (int i = 0; i < facts.$length(); i++) {
      RegExp fact = facts.$get(i);
      if (fact.test(line)) {
        handlers.$get(i).$invoke(null); // TODO arguments
        return;
      }
    }
    log.error("Could not find a possible handler for sentence => " + line);
  }

  public void runTest() {

  }

  private void loadAllFiles(Array<String> files) {
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
