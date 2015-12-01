package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.model.ActionData;
import org.wolftec.cwt.model.actions.AbstractAction;
import org.wolftec.cwt.view.GraphicManager;
import org.wolftec.cwt.view.input.InputService;

/**
 * The action evaluation state evaluates an action with the first data entry
 * from the action manager.
 */
public class IngameEvalActionState extends State {

  private Log log;

  private ActionService actions;

  private AbstractAction activeAction;
  private ActionData activeData;

  @Override
  public void onEnter(StateFlowData transition) {
    if (!actions.hasData()) {
      JsUtil.throwError("no action data available");
    }

    activeData = actions.popData();
    activeAction = actions.getActionById(activeData.id);

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
  public void update(StateFlowData transition, int delta, InputService input) {
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
