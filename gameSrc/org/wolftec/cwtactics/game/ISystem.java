package org.wolftec.cwtactics.game;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.ConstructedFactory;

public interface ISystem extends ConstructedClass {

  default EntityManager em() {
    EntityManager em = (EntityManager) JSObjectAdapter.$get(this, "__em__");

    // cache the entity manager reference to avoid expensive lookup
    // TODO maybe there is a way without property (--> prototype ?)
    if (em == JSGlobal.undefined) {
      em = ConstructedFactory.getObject(EntityManager.class);
      JSObjectAdapter.$put(this, "__em__", em);
    }

    return em;
  }

  default ComponentManager cm() {
    ComponentManager cm = (ComponentManager) JSObjectAdapter.$get(this, "__cm__");

    // cache the entity manager reference to avoid expensive lookup
    // TODO maybe there is a way without property (--> prototype ?)
    if (cm == JSGlobal.undefined) {
      cm = ConstructedFactory.getObject(ComponentManager.class);
      JSObjectAdapter.$put(this, "__cm__", cm);
    }

    return cm;
  }

  /**
   * Returns the publisher event emitter object for a given event type. Calling
   * the event function on this object leads into an invocation of all listeners
   * for that event function.
   * 
   * @param eventClass
   * @return
   */
  default <T extends IEvent> T publish(Class<T> eventClass) {
    return ConstructedFactory.getObject(EventEmitter.class).getEventEmitter();
  }
}
