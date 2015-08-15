package org.wolftec.cwt.states;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.ioc.Constructable;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Nullable;

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

  public void event(String event) {
    Map<String, String> desc = getStateDesc(active);
    if (Nullable.isPresent(desc.$get(event))) {
      active = desc.$get(event);
    }
  }

  public String getState() {
    return active;
  }

  public void setState(String state) {
    Nullable.getOrThrow(states.$get(state), "UnknownState");
    active = state;
  }
}
