package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.Log;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;

/**
 * The action evaluation state evaluates an action with the first data entry
 * from the action manager.
 */
public class IngameEvalActionState extends AbstractState {

  private Log log;

  private ErrorManager  errors;
  private ActionManager actions;

  private Action     activeAction;
  private ActionData activeData;

  @Override
  public void onEnter(StateFlowData transition) {
    if (!actions.hasData()) {
      errors.raiseError("no action data available", "ActionEval");
    }

    activeData = actions.popData();
    activeAction = actions.getActionByNumericId(activeData.id);
  }

  @Override
  public void onExit(StateFlowData transition) {
    actions.releaseData(activeData);
    activeData = null;
    activeAction = null;
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    log.info("evaluate action data " + activeData.toString());

    activeAction.evaluateByData(delta, activeData, transition);

    /*
     * the action decides when it's completely evaluated and rendered.
     * Especially rendering can acquire more frames to be completed. Stay in the
     * action evaluation state to recall the update and render function as long
     * the action evaluation isn't completed.
     */
    if (activeAction.isDataEvaluationCompleted(activeData)) {
      log.info("evaluation completed");

      // actions may manipulate the active state so we go into Idle only if the
      // actions does not set a custom target
      if (!transition.getNextState().isPresent()) {
        transition.setTransitionTo("IngameIdleState");
      } else {

        // check target state
        if (!transition.getNextState().get().startsWith("Ingame")) {
          errors.raiseError("cannot move into a non-ingame state here", "ActionEvaluation");
        }
      }

    } else {
      log.info("evaluation needs at least one more frame to complete");
    }
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
    activeAction.renderByData(delta, gfx, activeData);
  }
}
