package org.wolftec.cwt.controller.states.base;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.javascript.ClassUtil;
import org.wolftec.cwt.view.GraphicManager;
import org.wolftec.cwt.view.input.InputService;

public class State {

  /**
   * Called when the state will be leaved.
   * 
   * @param flowData
   *          transition data
   */
  public void onExit(StateFlowData flowData) {

  }

  /**
   * Called when the state will be entered.
   * 
   * @param flowData
   *          transition data
   */
  public void onEnter(StateFlowData flowData) {

  }

  /**
   * Called at first in a new frame.
   * 
   * @param flowData
   *          state execution flow data
   * @param delta
   *          time since the last frame
   */
  public void update(StateFlowData flowData, int delta, InputService input) {
  }

  /**
   * Called after update to render the changes.
   * 
   * @param delta
   *          time since the last frame
   */
  public void render(int delta, GraphicManager gfx) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.font = "24pt Arial";
    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("STATE: " + ClassUtil.getClassName(this), 30, 60, 400);
  }
}
