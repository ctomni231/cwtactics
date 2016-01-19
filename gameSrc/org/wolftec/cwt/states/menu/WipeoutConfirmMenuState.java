package org.wolftec.cwt.states.menu;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.states.base.AbstractMenuState;
import org.wolftec.cwt.states.base.GameActions;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.system.ResetDataParameterAction;

public class WipeoutConfirmMenuState extends AbstractMenuState
{

  private static final String UIC_YES = "YES";
  private static final String UIC_NO = "NO";

  @Override
  public void onConstruction()
  {
    ui.registerMulti(UIC_YES, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_NO);
    ui.registerMulti(UIC_NO, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_YES);
  }

  @Override
  public void onEnter(StateFlowData transition)
  {
    ui.setState(UIC_NO);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState)
  {

    switch (currentUiState)
    {

      case UIC_YES:
        String newLocation = Global.window.document.location.href;
        newLocation = newLocation.substring(0, newLocation.indexOf("?"));
        newLocation = newLocation + "?" + ResetDataParameterAction.WIPE_PARAMETER + "=1";
        Global.window.document.location.replace(newLocation);
        break;

      case UIC_NO:
        transition.setTransitionTo(transition.getPreviousState());
        break;
    }
  }

}
