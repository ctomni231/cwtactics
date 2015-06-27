package org.wolftec.cwtactics.game.system.ui;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Capturable;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.components.ui.Menu;
import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.NextFrameEvent;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

public class ActionSystem implements ConstructedClass, ActionEvents, NextFrameEvent {

  @SyntheticType
  public class ActionData {
    String command;
    int sx;
    int sy;
    int tx;
    int ty;
  }

  private EventEmitter ev;
  private EntityManager em;

  private BitSet flags;
  private CircularBuffer<String> buffer;

  @Override
  public void onConstruction() {
    flags = new BitSet();
    buffer = new CircularBuffer<String>(Constants.COMMAND_BUFFER_SIZE);
  }

  @Override
  public void onAddAction(String key, boolean enabled) {
    em.getComponent(EntityId.GAME_UI, Menu.class).menu.add(key);
  }

  @Override
  public void onTriggerAction(String action) {
    // TODO not enough here to invoke actions later
    ActionData data = (ActionData) JSObjectAdapter.$js("{}");
    data.command = action;
    data.sx = 0;
    data.sy = 0;
    data.tx = 0;
    data.ty = 0;
    buffer.add(JSGlobal.JSON.stringify(data));
  }

  @Override
  public void onNextFrame(int delta) {
    if (!buffer.isEmpty()) {
      ActionData data = (ActionData) JSGlobal.JSON.parse(buffer.popFirst());
      ev.publish(ActionEvents.class).onInvokeAction(data.command, data.sx, data.sy, data.tx, data.ty);
    }
  }

  @Override
  public void onTriggerActionGeneration(int x, int y) {
    if (flags == null) {
      ev.publish(ErrorEvent.class).onIllegalState("cannot trigger menu generation twice at the same time");
      return;
    }

    BitSet accFlags = flags;
    flags = null;

    accFlags.clear();
    em.forEachComponentOfType(Position.class, (em, entity, pos) -> {
      if (pos.x == x && pos.y == y) {

        // TODO improve
        Owner owner = em.getComponent(entity, Owner.class);

        if (owner == null) {
          accFlags.set(FLAG_SOURCE_PROP_NONE);

        } else {
          Turn turn = em.getComponent(EntityId.GAME_ROUND, Turn.class);
          int gap = em.hasEntityComponent(entity, Capturable.class) ? 0 : FLAG_UNIT_GAP_START;

          /* show found object type (property or unit) */
          accFlags.set(gap);

          if (owner.owner == turn.owner) {
            accFlags.set(FLAG_SOURCE_PROP_TO + gap);

          } else if (em.getComponent(owner.owner, Player.class).team == em.getComponent(turn.owner, Player.class).team) {
            accFlags.set(FLAG_SOURCE_PROP_TO_ALLIED + gap);

          } else {
            accFlags.set(FLAG_SOURCE_PROP_TO_ENEMY + gap);
          }
        }
      }
    });

    flags = accFlags;
  }
}
