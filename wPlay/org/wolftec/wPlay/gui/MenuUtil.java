package org.wolftec.wPlay.gui;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwtactics.game.state.InputAction;
import org.wolftec.wCore.core.ReflectionUtil;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

public abstract class MenuUtil {

  private static final String ATTR_NEXT_STATE = "nextState";

  public static <T extends UiElement> T create(UiContainer root, UiInputHandler ui, Class<T> elClass, String query, UiRenderer renderer) {
    T el = ReflectionUtil.getClassInstance(elClass);

    el.styleByQuery(query);

    if (ui != null) ui.registerElements(el);
    if (root != null) root.appendChild(el);

    return el;
  }

  /**
   * 
   * @param root
   * @param renderer
   * @param query
   * @return
   */
  public static UiContainer createContainer(UiContainer root, UiRenderer renderer, String query) {
    return create(root, null, UiContainer.class, query, renderer);
  }

  /**
   * 
   * @param root
   * @param ui
   * @param renderer
   * @param textKey
   * @param query
   * @param next
   * @return
   */
  public static UiElement createTransitionButton(UiContainer root, UiInputHandler ui, UiRenderer renderer, String textKey, String query,
      Class<? extends State> next) {

    UiElement el = create(root, ui, UiElement.class, query, renderer);
    el.data.$put("buttonText", textKey);
    el.data.$put(ATTR_NEXT_STATE, ReflectionUtil.getSimpleName(next));
    return el;
  }

  public static UiElement createActionButton(UiContainer root, UiInputHandler ui, UiRenderer renderer, String textKey, String query, Callback0 action) {
    UiElement el = create(root, ui, UiElement.class, query, renderer);
    el.data.$put("buttonText", textKey);
    return el;
  }

  /**
   * 
   * @param stm
   * @param input
   */
  public static void registerMenuHandler(StateManager stm, UiInputHandler input, Class<? extends State> last) {
    input.onAction(InputAction.B, () -> stm.changeToStateClass(last));
    input.onAction(InputAction.A, () -> {
      String nextState = input.getSelectedElement().data.$get(ATTR_NEXT_STATE);
      stm.changeState(nextState);
    });
  }
}
