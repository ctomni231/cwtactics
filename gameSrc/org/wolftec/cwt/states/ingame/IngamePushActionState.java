package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.actions.MoveAppend;
import org.wolftec.cwt.logic.actions.MoveEnd;
import org.wolftec.cwt.logic.actions.MoveStart;
import org.wolftec.cwt.logic.actions.WaitUnit;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.wTec.action.Action;
import org.wolftec.wTec.action.ActionData;
import org.wolftec.wTec.action.ActionManager;
import org.wolftec.wTec.input.InputProvider;
import org.wolftec.wTec.state.AbstractIngameState;
import org.wolftec.wTec.state.StateFlowData;

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
  public void update(StateFlowData transition, int delta, InputProvider input) {
    boolean trapped = false;

    if (!uiData.movePath.isEmpty()) {
      trapped = move.trapCheck(model, uiData.movePath, uiData.source, uiData.target);

      ActionData moveStart = actions.acquireData();
      ActionData moveEnd = actions.acquireData();

      moveStartAction.fillData(uiData, moveStart);
      actions.localActionData(moveStartAction.key(), moveStart, false);

      while (!uiData.movePath.isEmpty()) {
        ActionData moveMedium = actions.acquireData();
        moveAppendAction.fillData(uiData, moveMedium);
        actions.localActionData(moveAppendAction.key(), moveMedium, false);
      }

      moveEndAction.fillData(uiData, moveEnd);
      actions.localActionData(moveEndAction.key(), moveEnd, false);
    }

    if (!trapped) {
      Action action = uiData.getAction();

      ActionData actionData = actions.acquireData();
      action.fillData(uiData, actionData);
      actions.localActionData(action.key(), actionData, false);

      if (!action.noAutoWait()) {
        ActionData waitData = actions.acquireData();
        waitAction.fillData(uiData, waitData);
        actions.localActionData(waitAction.key(), waitData, false);
      }

      if (action.multiStepAction()) {
        transition.setTransitionTo("IngameMenuState");

      } else {
        transition.setTransitionTo("IngameIdleState");
      }

    } else {
      ActionData waitData = actions.acquireData();
      waitAction.fillData(uiData, waitData);
      actions.localActionData(waitAction.key(), waitData, false);
    }
  }
}
