package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.controller.Controller;
import org.wolftec.cwt.model.Model;
import org.wolftec.cwt.test.base.Tests;
import org.wolftec.cwt.view.View;

public class Main {

  /**
   * The entry point of the whole game.
   * 
   * @param args
   */
  public static void main(String[] args) {
    Model model = new Model();
    View view = new View(model);
    Controller controller = new Controller(model, view);

    if (Constants.DEBUG) {
      Tests test = new Tests();

      JSObjectAdapter.$put(Global.window, "cwtController", controller);
      JSObjectAdapter.$put(Global.window, "cwtModel", model);
      JSObjectAdapter.$put(Global.window, "cwtView", view);
      JSObjectAdapter.$put(Global.window, "cwtTest", test);
    }

    // TODO start the controller
  }
}
