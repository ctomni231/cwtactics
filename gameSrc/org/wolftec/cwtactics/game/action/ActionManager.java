package org.wolftec.cwtactics.game.action;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.game.domain.menu.ActionMenu;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.cwtactics.game.logic.TransferLogic;
import org.wolftec.cwtactics.game.renderer.UnitLayerBean;
import org.wolftec.cwtactics.game.state.StateDataBean;
import org.wolftec.wCore.container.CircularBuffer;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.DataTypeConverter;
import org.wolftec.wPlay.network.NetworkBackend;
import org.wolftec.wPlay.state.ActionQueueHandler;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public class ActionManager implements ActionQueueHandler<ActionItem>,
    ManagedComponentInitialization {

  @ManagedConstruction
  private Logger LOG;

  @Injected
  private NetworkBackend network;

  @Injected
  private StateDataBean stateData;

  @Injected
  private TransferLogic transfer;

  @Injected
  private GameManager gameround;

  @Injected
  private StateManager stateMachine;

  @Injected
  private UnitLayerBean unitLayer;

  private DataTypeConverter<ActionItem> actionConv;

  private CircularBuffer<ActionItem> actionItems;
  private CircularBuffer<ActionItem> actionBuffer;

  private Callback1<ActionItem> deserializeActionCb;
  private Callback1<String> sendNetworkMessage;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    actionConv = new DataTypeConverter(ActionItem.class);

    actionItems = new CircularBuffer<ActionItem>(200); // TODO
    actionBuffer = new CircularBuffer<ActionItem>(200); // TODO

    deserializeActionCb = (data) -> {
      actionItems.push(data);
    };

    sendNetworkMessage = (data) -> network.sendMessage(data);
  }

  public void initMenuByMapClick(ActionMenu menu) {

  }

  public void initMenuByUnitClick(ActionMenu menu) {
    Unit unit = null; // TODO

    if (unit.type.stealth) { // TODO S,T NONE - SAME
      menu.addEntry(unit.hidden ? ActionConstants.UNHIDE : ActionConstants.HIDE, true);
    }

    menu.addEntry(ActionConstants.WAIT, true); // TODO S,T NONE - SAME
  }

  public void initMenuByPropertyClick(ActionMenu menu) {

  }

  public boolean hasSubMenu(String key) {
    return false; // TODO
  }

  public void invokeAction(int actionKey, int p1, int p2, int p3, int p4, int p5) {
    String key = null;
    switch (key) {

      case ActionConstants.TO_OPTIONS:
        // TODO magic string
        stateData.fromIngameToOptions = true;
        stateMachine.changeState("MENU_OPTIONS");
        break;

      case ActionConstants.HIDE:
        gameround.units.$get(p1).hidden = true;
        break;

      case ActionConstants.UNHIDE:
        gameround.units.$get(p1).hidden = false;
        break;

      case ActionConstants.TRANSFER_MONEY:
        transfer.transferMoney(gameround.players.$get(p1), gameround.players.$get(p2), p3);
        break;
    }
  }

  @Override
  public void queueRemoteAction(String message) {
    actionConv.deserialize(message, this.deserializeActionCb);
  }

  private void queueActionIntoBuffer(ActionItem message, boolean immediate) {
    ActionItem actionData = actionBuffer.popLast();

    if (network.isConnected()) {
      actionConv.serialize(actionData, sendNetworkMessage);
    }

    LOG.info("append action " + actionData + (immediate ? " and calling it immediately" : ""));

    if (immediate) {
      actionItems.pushInFront(actionData);
    } else {
      actionItems.push(actionData);
    }
  }

  @Override
  public void queueAction(ActionItem message) {
    queueActionIntoBuffer(message, false);
  }

  @Override
  public void queueImmediateAction(ActionItem message) {
    queueActionIntoBuffer(message, true);
  }

  @Override
  public boolean hasQueuedActions() {
    return !actionItems.isEmpty();
  }

  @Override
  public void invokeNextAction() {
    ActionItem data = actionItems.popFirst();
    if (data == null) {
      LOG.error("NullPointerException");
    }

    invokeAction(data.actionId, data.p1, data.p2, data.p3, data.p4, data.p5);

    // cache used object
    data.reset();
    actionBuffer.push(data);
  }

  // public boolean checkRelation(Action.SourceToTarget checkMode,
  // Array<Relationship> relationList, Relationship sMode, Relationship stMode)
  // {
  // Relationship currentRelationship;
  // switch (checkMode) {
  // case SOURCE_AND_TARGET:
  // currentRelationship = sMode;
  // break;
  //
  // case SOURCE_AND_SUBTARGET:
  // currentRelationship = stMode;
  // break;
  //
  // default:
  // currentRelationship = null;
  // }
  //
  // for (int i = 2, e = relationList.$length(); i < e; i++) {
  // if (relationList.$get(i) == currentRelationship) {
  // return true;
  // }
  // }
  //
  // return false;
  // }
  //
  // /**
  // * Generates the action menu based on the given position data.
  // */
  // public void generate() {
  // Relationship st_mode = null;
  // Relationship sst_mode = null;
  // Relationship pr_st_mode = null;
  // Relationship pr_sst_mode = null;
  // Position sPos = parent.source;
  // Position tPos = parent.target;
  // Position tsPos = parent.targetSelection;
  // RelationshipCheckLogic.RelationshipCheckMode ChkU =
  // RelationshipCheckLogic.RelationshipCheckMode.CHECK_NORMAL;
  // RelationshipCheckLogic.RelationshipCheckMode ChkP =
  // RelationshipCheckLogic.RelationshipCheckMode.CHECK_PROPERTY;
  // Property sProp = sPos.property;
  // Unit sUnit = sPos.unit;
  // boolean unitActable = (!(sUnit == null || sUnit.getOwner() !=
  // net.wolfTec.gameround.turnOwner || !sUnit.isCanAct()));
  // boolean propertyActable = (!(sUnit != null || sProp == null || sProp.owner
  // != net.wolfTec.gameround.turnOwner || sProp.type.blocker));
  // boolean mapActable = (!unitActable && !propertyActable);
  //
  // // check_ all game action objects and fill menu
  // Array<Action> actions = Game.actionInvoker.getActions();
  // for (int i = 0, e = actions.$length(); i < e; i++) {
  // Action action = actions.$get(i);
  //
  // switch (action.type) {
  //
  // case CLIENT_ACTION:
  // // TODO: ai check
  // if (!mapActable || net.wolfTec.gameround.lastClientPlayer !=
  // net.wolfTec.gameround.turnOwner) {
  // continue;
  // }
  // break;
  //
  // case PROPERTY_ACTION:
  // if (!propertyActable) {
  // continue;
  // }
  // break;
  //
  // case MAP_ACTION:
  // if (!mapActable) {
  // continue;
  // }
  // break;
  //
  // case UNIT_ACTION:
  // if (!unitActable) {
  // continue;
  // }
  //
  // // extract relationships
  // if (st_mode == null) {
  // st_mode = RelationshipCheckLogic.getRelationShipTo(sPos, tPos, ChkU, ChkU);
  // sst_mode = RelationshipCheckLogic.getRelationShipTo(sPos, tsPos, ChkU,
  // ChkU);
  // pr_st_mode = RelationshipCheckLogic.getRelationShipTo(sPos, tPos, ChkU,
  // ChkP);
  // pr_sst_mode = RelationshipCheckLogic.getRelationShipTo(sPos, tsPos, ChkU,
  // ChkP);
  // }
  //
  // // relation to unit
  // if (action.relationToUnit != null) {
  // if (!checkRelation(action.mappingForUnit, action.relationToUnit, st_mode,
  // sst_mode)) {
  // continue;
  // }
  // }
  //
  // // relation to property
  // if (action.relationToProperty != null) {
  // if (!checkRelation(action.mappingForProperty, action.relationToProperty,
  // pr_st_mode, pr_sst_mode)) {
  // continue;
  // }
  // }
  // break;
  //
  // case ENGINE_ACTION:
  // continue;
  // }
  //
  // // if condition matches then add the entry to the menu list
  // if (action.condition.$invoke(parent)) {
  // addEntry(action.key, true);
  // }
  // }
  // }
  //
  // public void generateSubMenu() {
  // parent.selectedAction.prepareMenu.$invoke(parent);
  // }
}
