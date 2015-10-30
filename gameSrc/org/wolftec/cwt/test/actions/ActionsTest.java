package org.wolftec.cwt.test.actions;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.TileMeta;

public abstract class ActionsTest {

  public static Array<TileMeta> noPos() {
    return JSCollections.$array();
  }

  public static Array<TileMeta> allPos() {
    return JSCollections.$array(TileMeta.OWN, TileMeta.OWN_USED, TileMeta.ALLIED, TileMeta.EMPTY, TileMeta.ENEMY);
  }

  public static Array<TileMeta> allPropPos() {
    return JSCollections.$array(TileMeta.OWN, TileMeta.ALLIED, TileMeta.EMPTY, TileMeta.ENEMY);
  }

  public static Array<TileMeta> fromMeta(TileMeta... arguments) {
    Array<TileMeta> posArray = JSCollections.$array();
    for (int i = 0; i < arguments.length; i++) {
      posArray.push(arguments[i]);
    }
    return posArray;
  }

  public static boolean sourceCheck(Action action, Array<TileMeta> unitFlags, Array<TileMeta> propFlags) {
    return doesActionSupportsGivenSets(action, true, unitFlags, propFlags);
  }

  public static boolean targetCheck(Action action, Array<TileMeta> unitFlags, Array<TileMeta> propFlags) {
    return doesActionSupportsGivenSets(action, false, unitFlags, propFlags);
  }

  private static boolean doesActionSupportsGivenSets(Action action, boolean source, Array<TileMeta> unitFlags, Array<TileMeta> propFlags) {
    Array<TileMeta> all = allPos();
    Array<TileMeta> allProp = allPropPos();
    for (int i = 0; i < all.$length(); i++) {
      for (int j = 0; j < allProp.$length(); j++) {
        TileMeta unitFlag = all.$get(i);
        TileMeta propertyFlag = allProp.$get(j);

        boolean expectedOutput = (unitFlags.indexOf(unitFlag) != -1 && propFlags.indexOf(propertyFlag) != -1);

        if (source) {
          if (expectedOutput != action.checkSource(unitFlag, propertyFlag)) {
            return false;
          }
        } else {
          if (expectedOutput != action.checkTarget(unitFlag, propertyFlag)) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
