package org.wolfTec.cwt.game.statemachine.gameStates;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.renderer.layers.UserInterfaceLayerBean;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;

@Bean
public class ErrorState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_ERROR;
  }

  @InjectedByFactory
  private Logger log;

  @Injected
  private UserInterfaceLayerBean ui;

  private String errorMessage;
  private boolean rendered;

  private int selectedAction;

  public void setErrorMessage(String message) {
    this.errorMessage = message;
  }

  /**
   * @deprecated Use {@link #enter(Object...)} instead
   */
  @Override
  public void enter() {
    enter(null);
  }

  @Override
  public void enter(Object... args) {
    rendered = false;
    errorMessage = "";
    selectedAction = 0;
  }

  @Override
  public void keyLeft() {
    if (selectedAction > 0) selectedAction--;
  }

  @Override
  public void keyRight() {
    if (selectedAction < 2) selectedAction++;
  }

  @Override
  public void keyAction() {
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
      CanvasRenderingContext2D ctxUI = ui.getContext(EngineGlobals.INACTIVE_ID);

      rendered = true;
    }
  }

}
