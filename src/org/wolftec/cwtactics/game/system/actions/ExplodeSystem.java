package org.wolftec.cwtactics.game.system.actions;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.HideAble;
import org.wolftec.cwtactics.game.components.Stealth;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.actions.StealthEvents;

public class ExplodeSystem implements ConstructedClass, StealthEvents, LoadEntityEvent {

  private EntityManager em;
  private Asserter as;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, HideAble.class, (hideAble) -> {
          as.inspectValue("HideAble.additionFuelDrain of " + entity, hideAble.additionFuelDrain).isIntWithinRange(0, 99);
        });
        break;
    }
  }

  @Override
  public void onHideUnit(String unit) {
    changeStealth(unit, true);
  }

  @Override
  public void onUnhideUnit(String unit) {
    changeStealth(unit, false);
  }

  private void changeStealth(String unit, boolean isHidden) {
    Stealth st = em.getComponent(unit, Stealth.class);
    as.resetFailureDetection().inspectValue("unit is " + (isHidden ? "not" : "") + " hidden", st.hidden != isHidden).isTrue().throwErrorWhenFailureDetected();
    st.hidden = isHidden;
  }
}
