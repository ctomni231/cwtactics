package org.wolftec.cwtactics.game.system.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.system.ISystem;

public class TypeSys implements ISystem {

  @Override
  public void onInit() {
  }

  public void createUnitType(Map<String, Object> data) {
    String id = (String) data.$get("ID");
    entityManager().acquireEntityWithId(id);
    // parse components
  }

  private void parseTypeComponents(String entityId, Map<String, Object> data, Array<IEntityComponent> allowedComponents) {
    try {

    } catch (Error e) {
      events().ERROR_RAISED.publish("CouldNotReadType: " + JSGlobal.JSON.stringify(data));
    }
  }
}
