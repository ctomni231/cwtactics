package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputService;
import org.wolftec.cwt.loading.GameLoadingManager;
import org.wolftec.cwt.loading.ResourceRequestWatcher;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.serialization.PersistenceManager;
import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.update.GameUpdater;
import org.wolftec.cwt.util.SerialJobQueue;

public class LoadingState extends AbstractState implements ResourceRequestWatcher
{

  private Log log;
  private PersistenceManager storage;
  private GameLoadingManager loading;
  private boolean done;

  @Override
  public void onEnter(StateFlowData flowData)
  {
    done = false;
    loading.loadData(() ->
    {
      log.info("done");

      SerialJobQueue jobs = new SerialJobQueue();

      jobs.pushJob((next) -> new GameUpdater(storage).evaluateAllNecessaryUpdates(next));

      jobs.evaluate(() -> done = true);
    });
  }

  @Override
  public void update(StateFlowData flowData, int delta, InputService input)
  {
    if (done)
    {
      flowData.setTransitionTo("StartScreenState");
    }
  }

  @Override
  public void render(int delta, GraphicManager gfx)
  {
  }

  @Override
  public void onStartLoading(String what)
  {

  }

  @Override
  public void onFinishedLoading(String what)
  {

  }
}
