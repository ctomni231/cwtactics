package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.loop.GameloopService;
import org.wolftec.cwt.managed.IoCContainer;
import org.wolftec.cwt.states.base.StateManager;

public class Main {

  public static void main(String[] args) {
    IoCContainer ioc = new IoCContainer();

    if (Constants.DEBUG) {
      JSObjectAdapter.$put(Global.window, "__ioc__", ioc);
    }

    // The main game itself...
    //ioc.getManagedObjectByType(StateManager.class).setState("NoneState", true);
    // Just so JSR can test... comment out to see what JSR is up to. (Need to
    // start using testing functions)
     ioc.getManagedObjectByType(StateManager.class).setState("TempState",
     true);
    ioc.getManagedObjectByType(GameloopService.class).start();
  }
}
