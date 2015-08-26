package org.wolftec.cwt.states;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.core.ioc.Constructable;
import org.wolftec.cwt.core.ioc.Injectable;

public class UserInteractionMap implements Constructable {

  private Map<String, Map<String, String>> states;
  private String                           active;

  @Override
  public void onConstruction(Injectable instance) {
    states = JSCollections.$map();
  }

  private Map<String, String> getStateDesc(String state) {
    if (!JSObjectAdapter.hasOwnProperty(states, state)) {
      states.$put(state, JSCollections.$map());
    }
    return states.$get(state);
  }

  public void register(String from, String event, String to) {
    getStateDesc(from).$put(event, to);
  }

  public void registerMulti(String from, Array<String> events, String to) {
    ListUtil.forEachArrayValue(events, (index, event) -> register(from, event, to));
  }

  public void event(String event) {
    Map<String, String> desc = getStateDesc(active);
    if (JSObjectAdapter.hasOwnProperty(desc, event)) {
      active = desc.$get(event);
    }
  }

  public String getState() {
    return active;
  }

  public void setState(String state) {
    if (!JSObjectAdapter.hasOwnProperty(states, state)) {
      JsUtil.throwError("UnknownState");
    }
    active = state;
  }
}
