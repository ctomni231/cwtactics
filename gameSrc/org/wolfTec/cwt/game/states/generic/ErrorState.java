package org.wolfTec.cwt.game.states.generic;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gfx.UserInterfaceLayerBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Created;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class ErrorState implements State {
  
  // TODO use button group
  
  @Created("{name=$beanName}")
  private Logger log;

  @Injected
  private UserInterfaceLayerBean ui;

  private String errorMessage;
  private boolean rendered;

  private int selectedAction;

  public void setErrorMessage(String message) {
    this.errorMessage = message;
  }

  @Override
  public void enter() {
    rendered = false;
    errorMessage = "";
    selectedAction = 0;
  }

  @Override
  public void keyLeft(StateMachineBean stm) {
    if (selectedAction > 0) selectedAction--;
  }

  @Override
  public void keyRight(StateMachineBean stm) {
    if (selectedAction < 2) selectedAction++;
  }

  @Override
  public void keyAction(StateMachineBean stm) {
    switch (selectedAction) {

    /* Restart */
      case 0:
        log.error("NotImplementedYet");
        break;

      /* Wipe-Out Content and restart */
      case 1:
        log.error("NotImplementedYet");
        break;

      /* Send report and restart */
      case 2:
        log.error("NotImplementedYet");
        break;
    }
  }

  @Override
  public void render(int delta) {
    if (!rendered) {
      rendered = true;
    }
  }

}
