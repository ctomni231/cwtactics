package org.wolfTec.wolfTecEngine.input;

import org.stjs.javascript.Map;
import org.wolfTec.managed.ComponentManager;
import org.wolfTec.managed.ManagedComponent;
import org.wolfTec.managed.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;
import org.wolfTec.wolfTecEngine.util.JsUtil;

@ManagedComponent(whenQualifier="input=WOLFTEC")
public class LiveInputManager implements InputManager, ManagedComponentInitialization {

  private Map<String, Integer> p_actionStatus;
  private Map<String, Boolean> p_keyStatus;
  private Map<String, String> p_actionMapping;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_actionStatus = ContainerUtil.createMap();
    p_actionMapping = ContainerUtil.createMap();
    p_keyStatus = ContainerUtil.createMap();
  }

  @Override
  public boolean isActionPressed(String action) {
    return p_actionStatus.$get(action) > 0;
  }

  @Override
  public boolean isKeyPressed(String action) {
    return p_keyStatus.$get(action);
  }

  @Override
  public void keyPressed(String key) {
    p_keyStatus.$put(key, true);
    Integer value = p_actionStatus.$get(key);
    if (JsUtil.isTruly(value)) {
      p_actionStatus.$put(key, value + 1);
    }
  }

  @Override
  public void keyReleased(String key) {
    p_keyStatus.$put(key, false);
    Integer value = p_actionStatus.$get(key);
    if (JsUtil.isTruly(value)) {
      p_actionStatus.$put(key, value - 1);
    }
  }

  @Override
  public void connectActionMapping(String keyId, String action) {
    p_actionMapping.$put(keyId, action);
  }

  @Override
  public void disconnectActionMapping(String keyId) {
    p_actionMapping.$put(keyId, null);
  }
}
