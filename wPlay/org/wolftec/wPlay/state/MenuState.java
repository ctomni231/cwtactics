package org.wolftec.wPlay.state;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.wCore.core.ReflectionUtil;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.gui.UiInputHandler;
import org.wolftec.wPlay.gui.UiRenderer;
import org.wolftec.wPlay.input.LiveInputManager;

public interface MenuState extends State {

  @Override
  default void init(StateManager stm) {
    UiElement root = new UiContainer().styleByQuery("0px 0px 100% 100%");
    UiInputHandler input = new UiInputHandler();

    createLayout(stm, input, (UiContainer) root);
  }

  void createLayout(StateManager stm, UiInputHandler input, UiContainer root);

  @Override
  default void update(StateManager stm, LiveInputManager input, int delta) {

  }

  public static <T extends UiElement> T create(UiContainer root, UiInputHandler ui, Class<T> elClass, String query, UiRenderer renderer) {
    T el = ReflectionUtil.getClassInstance(elClass);

    el.styleByQuery(query);

    if (ui != null) ui.registerElements(el);
    if (root != null) root.appendChild(el);

    return el;
  }

  public UiContainer createContainer(UiContainer root, UiRenderer renderer, String query) {
    return create(root, null, UiContainer.class, query, renderer);
  }

  public UiElement createTransitionButton(UiContainer root, UiInputHandler ui, UiRenderer renderer, String textKey, String query,
      Class<? extends State> next) {

    UiElement el = create(root, ui, UiElement.class, query, renderer);
    el.data.$put("buttonText", textKey);
    el.data.$put(ATTR_NEXT_STATE, ReflectionUtil.getSimpleName(next));
    return el;
  }

  public UiElement createActionButton(UiContainer root, UiInputHandler ui, UiRenderer renderer, String textKey, String query, Callback0 action) {
    UiElement el = create(root, ui, UiElement.class, query, renderer);
    el.data.$put("buttonText", textKey);
    return el;
  }

  public void registerMenuHandler(StateManager stm, UiInputHandler input, Class<? extends State> last) {
    input.onAction(InputAction.B, () -> stm.changeToStateClass(last));
    input.onAction(InputAction.A, () -> {
      String nextState = input.getSelectedElement().data.$get(ATTR_NEXT_STATE);
      stm.changeState(nextState);
    });
  }
}
