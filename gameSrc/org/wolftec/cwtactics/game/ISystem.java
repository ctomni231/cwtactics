package org.wolftec.cwtactics.game;

import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.ConstructedFactory;

public interface ISystem extends ConstructedClass {

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
