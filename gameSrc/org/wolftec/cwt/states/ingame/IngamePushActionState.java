package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.actions.MoveAppend;
import org.wolftec.cwt.actions.MoveEnd;
import org.wolftec.cwt.actions.MoveStart;
import org.wolftec.cwt.actions.WaitUnit;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

/**
 * This states flushes the action data from the {@link UserInteractionData} into
 * action data objects which are shared with other clients and stored in the
 * action pool to be executed later by the {@link IngameEvalActionState}.
 */
public class IngamePushActionState extends AbstractIngameState {

  private UserInteractionData uiData;

  private ActionManager actions;
  private MoveLogic     move;
  private ModelManager  model;

  private MoveStart  moveStartAction;
  private MoveAppend moveAppendAction;
  private MoveEnd    moveEndAction;
  private WaitUnit   waitAction;

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {

    boolean trapped = move.trapCheck(model, uiData.movePath, uiData.source, uiData.target);

    if (!uiData.movePath.isEmpty()) {
      moveStartAction.fillData(uiData, actions.acquireData());

      moveAppendAction.fillData(uiData, actions.acquireData());
      while (!uiData.movePath.isEmpty()) {
        moveAppendAction.fillData(uiData, actions.acquireData());
      }

      moveEndAction.fillData(uiData, actions.acquireData());
    }

    if (!trapped) {
      Action action = uiData.getAction();

      action.fillData(uiData, actions.acquireData());

      if (!action.noAutoWait()) {
        waitAction.fillData(uiData, actions.acquireData());
      }

      if (action.multiStepAction()) {
        transition.setTransitionTo("IngameMenuState");

      } else {
        transition.setTransitionTo("IngameIdleState");
      }

    } else {
      waitAction.fillData(uiData, actions.acquireData());
    }
  }
}
