package org.wolftec.wPlay.gui;

import org.wolftec.cwtactics.game.renderer.GuiButtonRenderer;
import org.wolftec.cwtactics.game.state.InputAction;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ReflectionUtil;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public abstract class MenuUtil {

  @Injected
  private GuiButtonRenderer buttonRenderer;

  public <T extends UiElement> T create(UiContainer root, UiInputHandler ui, Class<T> elClass, String query, UiRenderer renderer) {
    T el = ReflectionUtil.getClassInstance(elClass);

    el.styleByQuery(query);

    if (ui != null) ui.registerElements(el);
    if (root != null) root.appendChild(el);

    return el;
  }

  public UiContainer createContainer(UiContainer root, String query) {
    return create(root, null, UiContainer.class, query, buttonRenderer);
  }

  public UiElement createTransitionButton(UiContainer root, UiInputHandler ui, String textKey, String query, Class<? extends State> next) {
    UiElement el = create(root, ui, UiElement.class, query, buttonRenderer);
    el.data.$put("buttonText", textKey);
    el.data.$put("nextState", ReflectionUtil.getSimpleName(next));
    return el;
  }

  /**
   * 
   * @param stm
   * @param input
   */
  public void registerMenuHandler(StateManager stm, UiInputHandler input, Class<? extends State> last) {
    input.onAction(InputAction.B, () -> stm.changeToStateClass(last));
    input.onAction(InputAction.A, () -> {
      String nextState = input.getSelectedElement().data.$get("nextState");
      stm.changeState(nextState);
    });
  }
}
