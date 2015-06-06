package org.wolftec.cwtactics.game.timelimit;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.GameEndEvent;
import org.wolftec.cwtactics.game.event.GameStartEvent;
import org.wolftec.cwtactics.game.event.NextFrameEvent;
import org.wolftec.cwtactics.game.event.TurnEndEvent;
import org.wolftec.cwtactics.game.event.TurnStartEvent;

/**
 * The {@link GameTimeSystem} adds time limits for the turn and game mechanic.
 * When a turn limit is reached then the turn will be ended by this system. If
 * the game time limit is reached then the game round will be ended by this
 * system.
 */
public class GameTimeSystem implements ISystem, NextFrameEvent, GameStartEvent, TurnStartEvent {

  @Override
  public void onNextFrame(int delta) {
    GameTimeCompnent data = gec("GAMETIME", GameTimeCompnent.class);

    data.gameTime += delta;
    data.turnTime += delta;

    if (data.turnTime >= data.turnTimeLimit) {
      info("ending current turn because turn time limit is reached");
      publish(TurnEndEvent.class).onTurnEnd();

    } else if (data.gameTime >= data.gameTimeLimit) {
      info("ending game because game time limit is reached");
      publish(GameEndEvent.class).onGameEnd();
    }
  }

  @Override
  public void onGameStart() {
    GameTimeCompnent data = gec("GAMETIME", GameTimeCompnent.class);
    data.gameTime = 0;
    data.turnTime = 0;
  }

  @Override
  public void onTurnStart(String player, int turn) {
    GameTimeCompnent data = gec("GAMETIME", GameTimeCompnent.class);
    data.turnTime = 0;
  }
}
