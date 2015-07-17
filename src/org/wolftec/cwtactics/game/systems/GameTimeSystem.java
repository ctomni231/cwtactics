package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.components.TimerData;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.ClientEndsTurn;
import org.wolftec.cwtactics.game.events.gameround.GameroundEnd;
import org.wolftec.cwtactics.game.events.gameround.GameroundStart;
import org.wolftec.cwtactics.game.events.gameround.TurnStarts;
import org.wolftec.cwtactics.game.events.system.FrameTick;

/**
 * The {@link GameTimeSystem} adds time limits for the turn and game mechanic.
 * When a turn limit is reached then the turn will be ended by this system. If
 * the game time limit is reached then the game round will be ended by this
 * system.
 */
public class GameTimeSystem implements System, FrameTick, GameroundStart, TurnStarts {

  private Log                   log;

  private ClientEndsTurn        endTurnEvent;
  private GameroundEnd          gameroundEndEvent;

  private Components<TimerData> timers;

  @Override
  public void onNextTick(int delta) {
    TimerData data = getGameroundTimer();

    data.gameTime += delta;
    data.turnTime += delta;

    if (data.turnTime >= data.turnTimeLimit) {
      log.info("ending current turn because turn time limit is reached");
      endTurnEvent.onClientEndsTurn();

    } else if (data.gameTime >= data.gameTimeLimit) {
      log.info("ending game because game time limit is reached");
      gameroundEndEvent.onGameroundEnd();
    }
  }

  @Override
  public void gameroundStart() {
    TimerData data = getGameroundTimer();
    data.gameTime = 0;
    data.turnTime = 0;
  }

  @Override
  public void onTurnStarts(String player, int turn) {
    TimerData data = getGameroundTimer();
    data.turnTime = 0;
  }

  private TimerData getGameroundTimer() {
    TimerData data = timers.get(Entities.GAME_ROUND);
    return data;
  }
}
