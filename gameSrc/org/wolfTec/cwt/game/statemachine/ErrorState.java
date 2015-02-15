package org.wolfTec.cwt.game.statemachine;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gfx.UserInterfaceLayerBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.InjectedByFactory;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;

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

  @Override
  public void enter() {
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
