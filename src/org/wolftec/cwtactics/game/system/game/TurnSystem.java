package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.actions.TurnEvents;

public class TurnSystem implements ConstructedClass, TurnEvents {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onClientEndsTurn() {
    Turn data = em.getComponent(EntityId.GAME_ROUND, Turn.class);

    String prevTurnOwner = data.owner;
    ev.publish(TurnEvents.class).onTurnEnd(prevTurnOwner);

    // search new owner
    do {
      data.owner = EntityId.getNextPlayerId(data.owner);

      // when the first player will be checked then we completed an iteration
      // through the player list
      // -> this means all players ends their turn on the active day and we
      // start a new day with a turn for every player
      if (EntityId.isFirstPlayer(data.owner)) {
        data.day++;
        ev.publish(TurnEvents.class).onDayStart(data.day);
      }

      if (em.getComponent(data.owner, Player.class).alive) {
        ev.publish(TurnEvents.class).onTurnStart(data.owner, data.day);
        return;
      }
    } while (data.owner != prevTurnOwner);

    ev.publish(ErrorEvent.class).onIllegalGameData("could not select a new turn owner");
  }
}