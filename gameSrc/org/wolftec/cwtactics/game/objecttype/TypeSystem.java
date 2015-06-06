package org.wolftec.cwtactics.game.objecttype;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.ObjectChangeTypeEvent;

public class TypeSystem implements ISystem, ObjectChangeTypeEvent {

  @Override
  public void onObjectGetsType(String object, String type) {
    gogec(object, TypeComponent.class).type = type;
  }
}
