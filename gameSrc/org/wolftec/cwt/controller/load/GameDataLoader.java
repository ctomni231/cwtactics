package org.wolftec.cwt.controller.load;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.controller.Controller;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.annotations.InjectedPostConstruction;
import org.wolftec.cwt.view.View;

public class GameDataLoader {

  @InjectedPostConstruction public Controller ctr;
  @InjectedPostConstruction public View view;

  @AsyncOperation
  public void loadGameData(@AsyncCallback Callback0 onFinish) {

  }

  @AsyncOperation
  public void loadGameConfig(@AsyncCallback Callback0 onFinish) {

  }

  @AsyncOperation
  public void saveGameConfig(@AsyncCallback Callback0 onFinish) {

  }
}
