package org.wolftec.wPlay.state;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.wPlay.gui.MenuUtil;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.gui.UiInputHandler;
import org.wolftec.wPlay.gui.UiRenderer;
import org.wolftec.wPlay.input.LiveInputManager;

public abstract class MenuState implements State {

  protected UiInputHandler input;
  protected UiContainer root;

  @Override
  public void init(StateManager stm) {
    root = (UiContainer) new UiContainer().styleByQuery("0px 0px 100% 100%");
    input = new UiInputHandler();

    createLayout(stm);
  }

  public abstract void createLayout(StateManager stm);

  @Override
  public void update(StateManager stm, LiveInputManager input, int delta) {

  }

  public UiContainer createContainer(UiContainer root, UiRenderer renderer, String query) {
    return MenuUtil.create(root, null, UiContainer.class, query, renderer);
  }

  public UiElement createTransitionButton(UiContainer root, UiRenderer renderer, String textKey, String query, Class<? extends State> next) {
    return MenuUtil.createTransitionButton(root, input, renderer, textKey, query, next);
  }

  public UiElement createActionButton(UiContainer root, UiRenderer renderer, String textKey, String query, Callback0 action) {
    return MenuUtil.createActionButton(root, input, renderer, textKey, query, action);
  }

  public void registerMenuHandler(StateManager stm, Class<? extends State> last) {
    MenuUtil.registerMenuHandler(stm, input, last);
  }
}
