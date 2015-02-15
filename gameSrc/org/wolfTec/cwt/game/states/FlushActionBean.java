package org.wolfTec.cwt.game.states;

import org.wolfTec.cwt.game.gamelogic.TransferLogic;
import org.wolfTec.cwt.game.gfx.UnitLayerBean;
import org.wolfTec.cwt.game.model.Menu;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.InjectedByFactory;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class FlushActionBean {

  public final String WAIT = "wait";
  public final String HIDE = "hideUnit";
  public final String UNHIDE = "unhideUnit";
  public final String UNLOAD_UNIT = "unloadUnit";
  public final String LOAD_UNIT = "loadUnit";
  public final String TO_OPTIONS = "options";
  public final String TRANSFER_MONEY = "transferMoney";
  public final String TRANSFER_PROPERTY = "transferProperty";
  public final String TRANSFER_UNIT = "transferUnit";

  @InjectedByFactory
  private Logger log;

  @Injected
  private StateDataBean stateData;

  @Injected
  private TransferLogic transfer;
  
  @Injected
  private GameRoundBean gameround;
  
  @Injected
  private StateMachineBean stateMachine;

  @Injected
  private UnitLayerBean unitLayer;

  public void initMenuByMapClick(Menu menu) {

  }

  public void initMenuByUnitClick(Menu menu) {
    Unit unit = null; // TODO

    if (unit.getType().stealth) { // TODO S,T NONE - SAME
      menu.addEntry(unit.isHidden() ? UNHIDE : HIDE, true);
    }

    menu.addEntry(WAIT, true); // TODO S,T NONE - SAME
  }

  public void initMenuByPropertyClick(Menu menu) {

  }

  public boolean hasSubMenu(String key) {
    return false;
  }

  public void invokeAction(String key, int p1, int p2, int p3, int p4, int p5) {
    switch (key) {

      case WAIT:
        // TODO full re-render.. maybe a little bit to much huh ?
        gameround.getUnit(p1).setCanAct(false);
        unitLayer.onFullScreenRender();
        break;

      case TO_OPTIONS:
        // TODO magic string
        stateData.fromIngameToOptions = true;
        stateMachine.changeState("MENU_OPTIONS");
        break;

      case HIDE:
        gameround.getUnit(p1).setHidden(true);
        break;

      case UNHIDE:
        gameround.getUnit(p1).setHidden(false);
        break;

      case TRANSFER_MONEY:
        transfer.transferMoney(gameround.getPlayer(p1), gameround.getPlayer(p2), p3);
        break;
    }
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
