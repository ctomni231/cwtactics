package org.wolftec.cwtactics.test.game;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.FrameTick;
import org.wolftec.cwtactics.game.timer.TimerData;
import org.wolftec.cwtactics.game.turn.Turn;
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

    em.getComponent(Entities.GAME_ROUND, Turn.class).owner = "PL0";
    em.getComponent(Entities.GAME_ROUND, TimerData.class).turnTime = 10;
    em.getComponent(Entities.GAME_ROUND, TimerData.class).turnTimeLimit = 10;

    ev.publish(FrameTick.class).onNextTick(100);

    asserter.inspectValue("active turn owner", em.getComponent(Entities.GAME_ROUND, Turn.class).owner).equals("PL1");
  }
}
