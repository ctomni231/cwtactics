package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.components.IEntityComponent;

public class TypeSys implements ISystem {

  @Override
  public void onInit() {
    // TODO Auto-generated method stub
    ISystem.super.onInit();
  }

  public void createUnitType(Map<String, Object> data) {
    String id = (String) data.$get("ID");
    entityManager().acquireEntityWithId(id);
    // parse components
  }

  private void parseTypeComponents(String entityId, Map<String, Object> data, Array<IEntityComponent> allowedComponents) {

  }
}
