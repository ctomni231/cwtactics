package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.Wait;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.AddAction;
import org.wolftec.cwtactics.game.events.ui.BuildActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

@SyntheticType
public class UsableActions implements System, BuildActions, InvokeAction {

  private Wait                 waitEvent;
  private AddAction            actionEvents;

  private Components<Position> positions;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1) {
      actionEvents.onAddAction("wait", true);
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "wait") {
      String unit = positions.find((entity, pos) -> Entities.isUnitEntity(entity) && pos.x == x && pos.y == y);
      waitEvent.onWait(unit);
    }
  }
}
