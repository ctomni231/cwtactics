package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Capturable;
import org.wolftec.cwtactics.game.components.Capturer;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.CaptureEvents;

public class CaptureSystem implements ISystem, ActionInvokedEvent {

  private EntityManager em;

  @Override
  public void onInvokeAction(String action, String pstr, int p1, int p2, int p3, int p4, int p5) {
    if (action == "Capture") {
      String property = null;
      String capturer = null;

      Capturable propertyData = em.getComponent(property, Capturable.class);
      Capturer capturerData = em.getComponent(capturer, Capturer.class);

      propertyData.points -= capturerData.points;
      publish(CaptureEvents.class).onLoweredCapturePoints(capturer, property, capturerData.points);

      if (propertyData.points <= 0) {

        Owner propertyOwner = em.getComponent(property, Owner.class);
        Owner capturerOwner = em.getComponent(capturer, Owner.class);

        propertyOwner.owner = capturerOwner.owner;

        publish(CaptureEvents.class).onCapturedProperty(capturer, property);
      }
    }
  }

}
