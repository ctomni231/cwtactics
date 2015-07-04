package org.wolftec.cwtactics.test.game;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.TimerData;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.NextFrameEvent;
import org.wolftec.cwtactics.test.core.ITest;

public class GameTimerRules implements ITest, System {

  private Log log;
  private Asserter asserter;
  private EventEmitter ev;
  private EntityManager em;

  @Override
  public void beforeTest() {
    asserter.resetFailureDetection();
  }

  @Override
  public void afterTest() {
    asserter.throwErrorWhenFailureDetected();
  }

  public void test_turnTimeLimit_shouldSetNextPlayer() {
    
    em.getComponent(EntityId.GAME_ROUND, Turn.class).owner = "PL0";
    em.getComponent(EntityId.GAME_ROUND, TimerData.class).turnTime = 10;
    em.getComponent(EntityId.GAME_ROUND, TimerData.class).turnTimeLimit = 10;

    ev.publish(NextFrameEvent.class).onNextFrame(100);

    asserter.inspectValue("active turn owner", em.getComponent(EntityId.GAME_ROUND, Turn.class).owner).equals("PL1");
  }
}
