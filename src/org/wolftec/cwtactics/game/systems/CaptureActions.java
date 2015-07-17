package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.components.Capturable;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.error.IllegalArguments;
import org.wolftec.cwtactics.game.events.gameround.UnitCapturesProperty;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.AddAction;
import org.wolftec.cwtactics.game.events.ui.BuildActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

public class CaptureActions implements System, BuildActions, InvokeAction {

  private IllegalArguments       illegalArgumentsExc;
  private AddAction              addActionEvent;
  private UnitCapturesProperty        captureEvent;

  private Components<Living>     livings;
  private Components<Position>   positions;
  private Components<Capturable> capturables;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    boolean capturableFlag = flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ENEMY) == 1 || flags.get(ActionFlags.FLAG_SOURCE_PROP_NONE) == 1;
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1 && capturableFlag) {
      if (capturables.has(property)) {
        addActionEvent.onAddAction("capture", true);
      }
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "capture") {

      // TODO improve readability
      String capturer = positions.find((entity, pos) -> livings.has(entity) && pos.x == tx && pos.y == tx);
      String property = positions.find((entity, pos) -> capturables.has(entity) && pos.x == tx && pos.y == tx);

      if (capturer == null || property == null) {
        illegalArgumentsExc.onIllegalArguments("missing data");
      }

      captureEvent.onUnitCapturesProperty(capturer, property);
    }
  }

}
