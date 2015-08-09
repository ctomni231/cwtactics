package org.wolftec.cwt.save;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.ioc.Injectable;

public class SaveManager implements Injectable {

  private Array<GameHandler<?>> gameHandlers;
  private Array<AppHandler<?>>  appHandlers;

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveGame(String saveName, Callback1<String> doneCb) {
    // TODO
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void loadGame(String saveName, Callback1<String> doneCb) {
    // TODO
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveAppData(Callback1<String> doneCb) {
    // TODO
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void loadAppData(Callback1<String> doneCb) {
    // TODO
  }
}
