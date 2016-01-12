package org.wolftec.cwt.loop;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.JsUtil;

public class GameloopService implements ManagedClass
{

  // --------------- RequestAnimationFrame API ---------------

  @GlobalScope
  @STJSBridge
  static class RequestAnimationFrameGlobal
  {
    native static void requestAnimationFrame(Callback0 handler);
  }

  // --------------- RequestAnimationFrame API ---------------

  private Array<GameloopWatcher> frameWatchers;

  private Log       log;
  private boolean   active;
  private long      oldTime;
  private Callback0 loopFunction;

  @Override
  public void onConstruction()
  {

    /*
     * accessing the object with that is faster because loopFunction has not to
     * be bind against the loop object
     */
    final GameloopService that = this;

    that.active = false;
    that.oldTime = JsUtil.getTimestamp();
    that.loopFunction = () ->
    {

      long now = JsUtil.getTimestamp();
      int delta = (int) (now - that.oldTime);
      that.oldTime = now;

      that.update(delta);

      if (that.active)
      {
        RequestAnimationFrameGlobal.requestAnimationFrame(that.loopFunction);
      }
    };
  }

  private void update(int delta)
  {
    for (int i = 0; i < frameWatchers.$length(); i++)
    {
      frameWatchers.$get(i).onFrameTick(delta);
    }

  }

  /**
   * Starts the central application loop which starts the game flow. The
   * environment will try to invoke the loop every 16ms. In this invocation the
   * active state will be updated and all {@link GameloopWatcher} objects will
   * be triggered.
   */
  public void start()
  {
    AssertUtil.assertThat(!active);

    active = true;
    log.info("starting game loop");

    RequestAnimationFrameGlobal.requestAnimationFrame(loopFunction);
  }

  /**
   * Stops the game loop.
   */
  public void stop()
  {
    AssertUtil.assertThat(active);

    active = false;
    log.info("stopping game loop");
  }
}
