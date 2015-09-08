package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateTransition;

/**
 * The action evaluation state evaluates an action with the first data entry
 * from the action manager.
 */
public class IngameEvalActionState extends AbstractState {

  private ErrorManager  errors;
  private ActionManager actions;

  private Action     activeAction;
  private ActionData activeData;

  @Override
  public void onEnter(StateTransition transition) {
    if (!actions.hasData()) {
      errors.raiseError("no action data available", "ActionEval");
    }

    activeData = actions.popData();
    activeAction = actions.getActionByNumericId(activeData.id);
  }

  @Override
  public void onExit(StateTransition transition) {
    actions.releaseData(activeData);
    activeData = null;
    activeAction = null;
  }

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {
    activeAction.evaluateByData(delta, activeData);

    /*
     * the action decides when it's completely evaluated and rendered.
     * Especially rendering can acquire more frames to be completed. Stay in the
     * action evaluation state to recall the update and render function as long
     * the action evaluation isn't completed.
     */
    if (activeAction.isDataEvaluationCompleted(activeData)) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
    activeAction.renderByData(delta, gfx, activeData);
  }
}
