package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.components.Capturable;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.Turn;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.error.IllegalState;
import org.wolftec.cwtactics.game.events.system.FrameTick;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.GenerateActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;
import org.wolftec.cwtactics.game.events.ui.InvokeData;
import org.wolftec.cwtactics.game.events.ui.RegisterAction;
import org.wolftec.cwtactics.game.events.ui.TriggerData;

public class ActionSystem implements System, InvokeAction, GenerateActions, FrameTick {

  @SyntheticType
  public class Action {
    Callback1<TriggerData> check;
    Callback1<InvokeData>  invoke;
  }

  private Map<String, Action>    actions;

  private BitSet                 flags;
  private InvokeData             invokeData;
  private TriggerData            triggerData;

  private RegisterAction         registerActionEv;
  private IllegalState           illegalStateExc;

  // private Components<Menu> menus;
  private Components<Turn>       turns;
  private Components<Owner>      owners;
  private Components<Player>     players;
  private Components<Position>   positions;
  private Components<Capturable> capturables;

  // private Components<ActionBuffer> buffers;
  //
  // @Override
  // public void onConstruction() {
  // flags = BitSetFactory.create();
  // buffers.acquire(Entities.GAME_UI).buffer = new
  // CircularBuffer<String>(Constants.COMMAND_BUFFER_SIZE);
  // }
  //
  // @Override
  // public void onTriggerAction(String action) {
  // // TODO not enough here to invoke actions later
  // ActionData data = (ActionData) JSObjectAdapter.$js("{}");
  // data.command = action;
  // data.sx = 0;
  // data.sy = 0;
  // data.tx = 0;
  // data.ty = 0;
  // buffers.get(Entities.GAME_UI).buffer.add(JSGlobal.JSON.stringify(data));
  // }
  //

  @Override
  public void onConstruction() {

    flags = new BitSet();
    invokeData = new InvokeData();
    triggerData = new TriggerData();

    registerActionEv.onRegisterAction((key, checkCallback, invokeCallback) -> {
      Action action = new Action();
      action.check = checkCallback;
      action.invoke = invokeCallback;
      actions.$put(key, action);
    });
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    // TODO Auto-generated method stub
    //
  }

  @Override
  public void onNextTick(int delta) {
    // CircularBuffer<String> buffer = buffers.get(Entities.GAME_UI).buffer;
    // if (!buffer.isEmpty()) {
    // ActionData data = (ActionData) JSGlobal.JSON.parse(buffer.popFirst());
    // actionEv.invokeAction(data.command, data.sx, data.sy, data.tx, data.ty);
    // }
  }

  @Override
  public void onGenerateActions(int x, int y) {
    if (flags == null) {
      illegalStateExc.onIllegalState("cannot trigger menu generation twice at the same time");
      return;
    }

    // localize instance vars to improve performance
    BitSet accFlags = this.flags;
    Components<Owner> owners = this.owners;
    // localize instance vars to improve performance

    flags = null;

    accFlags.clear();
    positions.each((entity, pos) -> {
      if (pos.x == x && pos.y == y) {
        Owner owner = owners.get(entity);

        if (owner == null) {
          accFlags.set(ActionFlags.FLAG_SOURCE_PROP_NONE);

        } else {
          Turn turn = turns.get(Entities.GAME_ROUND);

          int gap = capturables.has(entity) ? 0 : ActionFlags.FLAG_UNIT_GAP_START;

          /* show found object type (property or unit) */
          accFlags.set(gap);

          if (owner.owner == turn.owner) {
            accFlags.set(ActionFlags.FLAG_SOURCE_PROP_TO + gap);

          } else if (players.get(owner.owner).team == players.get(turn.owner).team) {
            accFlags.set(ActionFlags.FLAG_SOURCE_PROP_TO_ALLIED + gap);

          } else {
            accFlags.set(ActionFlags.FLAG_SOURCE_PROP_TO_ENEMY + gap);
          }
        }
      }
    });

    JsUtil.forEachMapValue(actions, (actionKey, actionObject) -> {
      actionObject.check.$invoke(triggerData);
    });

    flags = accFlags;
  }
}
