package org.wolftec.cwt.controller.actions.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.StringUtil;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.ReflectionUtil;
import org.wolftec.cwt.model.actions.AbstractAction;

public class Actions {

  /**
   * List of all available actions.
   */
  private Array<AbstractAction> actions;

  /**
   * Action -> ActionID<numeric> mapping
   */
  private Map<String, Integer> ids;

  public Actions() {
    ids = JSCollections.$map();
    actions = JSCollections.$array();

    ReflectionUtil.forEachClassOfType(AbstractAction.class, (actionType) -> actions.push(ReflectionUtil.createInstance(actionType)));

    /*
     * we sort the actions by their hash values. This results into same order of
     * the actions in the actions array in every environment.
     */
    actions.sort((a, b) -> {
      int aHash = StringUtil.stringToHash(a.key());
      int bHash = StringUtil.stringToHash(b.key());

      if (aHash < bHash) {
        return -1;
      } else if (aHash > bHash) {
        return 1;
      } else {
        return 0;
      }
    });

    ListUtil.forEachArrayValue(actions, (index, action) -> {
      ids.$put(action.key(), index);
    });
  }

  /**
   * Returns a list of all registered actions.
   */
  public Array<AbstractAction> getActions() {
    return actions;
  }

  public AbstractAction getActionByKey(String key) {
    return getActionById(getIdByKey(key));
  }

  public AbstractAction getActionById(int id) {
    return NullUtil.getOrThrow(actions.$get(id));
  }

  /**
   * Gets the numeric ID of an action key.
   */
  public int getIdByKey(String key) {
    return NullUtil.getOrThrow(ids.$get(key));
  }
}
