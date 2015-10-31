package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.logic.ActionData;
import org.wolftec.cwt.logic.ActionManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

/**
 * The action evaluation state evaluates an action with the first data entry
 * from the action manager.
 */
public class IngameEvalActionState extends AbstractState {

  private Log log;

  private ActionManager actions;

  private Action activeAction;
  private ActionData activeData;

  @Override
  public void onEnter(StateFlowData transition) {
    if (!actions.hasData()) {
      JsUtil.throwError("no action data available");
    }

    activeData = actions.popData();
    activeAction = actions.getActionByNumericId(activeData.id);

    /*
     * validate data since we possibly get the action data from a remote source
     */
    activeAction.checkData(activeData);
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
      String nextState = transition.getNextState();
      if (!NullUtil.isPresent(nextState)) {
        transition.setTransitionTo("IngameIdleState");

      } else {
        // check target state
        if (!nextState.startsWith("Ingame")) {
          JsUtil.throwError("cannot move into a non-ingame state here");
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
