package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;

public class Properties {

  /**
   * All property objects of a game round. This buffer holds the maximum amount
   * of possible property objects. Inactive ones are marked by no reference in
   * the map.
   */
  private Array<Property> properties;

  public Properties() {
    properties = ListUtil.instanceList(Property.class, Constants.MAX_PROPERTIES);
  }

  public Property getProperty(int id) {
    AssertUtil.assertThatNot(id < 0 || id > properties.$length());
    return properties.$get(id);
  }

  public int getPropertyId(Property obj) {
    return properties.indexOf(obj);
  }

  public boolean isValidPropertyId(int id) {
    return (id >= 0 && id < properties.$length());
  }

  public void forEachProperty(Callback2<Integer, Property> cb) {
    for (int i = 0; i < properties.$length(); i++) {
      cb.$invoke(i, properties.$get(i));
    }
  }

  public Property getInactiveProperty() {
    for (int i = 0, e = Constants.MAX_PROPERTIES; i < e; i++) {
      if (getProperty(i).type == null) {
        return getProperty(i);
      }
    }
    return JsUtil.throwError("no inactive property left");
  }
}
