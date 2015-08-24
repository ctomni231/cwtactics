package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionManager;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

/**
 * The action evaluation state evaluates an action with the first data entry
 * from the action manager.
 */
public class ActionEvalState implements State {

  private ErrorManager  errors;
  private ActionManager actions;

  private Action        activeAction;
  private ActionData    activeData;

  @Override
  public void onEnter(Maybe<Class<? extends State>> previous) {
    if (!actions.hasData()) {
      errors.raiseError("no action data available", "ActionEval");
    }

    activeData = actions.popData();
    activeAction = actions.getActionByNumericId(activeData.id);
  }

  @Override
  public void onExit() {
    actions.releaseData(activeData);
    activeData = null;
    activeAction = null;
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    activeAction.evaluateByData(delta, activeData);

    /*
     * the action decides when it's completely evaluated and rendered.
     * Especially rendering can acquire more frames to be completed. Stay in the
     * action evaluation state to recall the update and render function as long
     * the action evaluation isn't completed.
     */
    return activeAction.isDataEvaluationCompleted(activeData) ? Maybe.of(IdleState.class) : NO_TRANSITION;
  }

  @Override
  public void render(int delta, GraphicManager graphic) {
    activeAction.renderByData(delta, graphic, activeData);
  }
}
