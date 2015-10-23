package org.wolftec.cwt.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.input.InputManager;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.test.TestExecutionResults;
import org.wolftec.cwt.core.test.TestManager;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.UrlParameterUtil;
import org.wolftec.cwt.renderer.GraphicManager;

public class NoneState extends AbstractState {

  private Log log;

  private InputManager input;
  private TestManager  manager;

  @Override
  public void onEnter(StateFlowData transition) {
    setupDevKeys();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    mayExecuteTests();
    transition.setTransitionTo("LoadingState");
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.font = "24pt Arial";

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60, 400);

    ctx.fillStyle = "#610B0B";
    ctx.fillText("- Development Version -", 40, 100, 400);
  }

  protected void mayExecuteTests() {
    TestExecutionResults results = manager.callAllTests();

    boolean skipTests = NullUtil.getOrElse(UrlParameterUtil.getParameter("noTests"), "false").equals("true");
    if (manager.hasTests() && !skipTests) {

      boolean skipErrorLog = NullUtil.getOrElse(UrlParameterUtil.getParameter("noTestErrorLog"), "false").equals("true");

      log.info("Test results, " + results.passed + " has passed and " + results.failed + " has failed");
      ListUtil.forEachArrayValue(results.tests, (testI, testData) -> {
        ListUtil.forEachArrayValue(testData.methods, (testMethodI, testMethodData) -> {
          if (testMethodData.succeeded) {
            log.info("[PASSED] " + testData.name + "." + testMethodData.name);
          } else {
            log.error("[FAILED] " + testData.name + "." + testMethodData.name, !skipErrorLog ? testMethodData.error : null);
          }
        });
      });
    }
  }

  private void setupDevKeys() {
    log.info("setup development input mapping");
    input.setButtonMapping("ENTER", GameActions.BUTTON_A);
    input.setButtonMapping("CTRL", GameActions.BUTTON_B);
    input.setButtonMapping("ARROW LEFT", GameActions.BUTTON_LEFT);
    input.setButtonMapping("ARROW RIGHT", GameActions.BUTTON_RIGHT);
    input.setButtonMapping("ARROW UP", GameActions.BUTTON_UP);
    input.setButtonMapping("ARROW DOWN", GameActions.BUTTON_DOWN);
  }
}
