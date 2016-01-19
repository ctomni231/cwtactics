package org.wolftec.cwt.states.start;

import org.wolftec.cwt.loading.DataGrabbers;
import org.wolftec.cwt.loading.GameLoadingManager;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.parameters.Parameters;
import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.update.GameUpdater;
import org.wolftec.cwt.util.SerialJobQueue;

public class LoadingState extends AbstractState
{

  private Log log;
  private GameLoadingManager loading;

  @Override
  public void onEnter(StateFlowData flowData)
  {
    loading.loadData(() ->
    {
      SerialJobQueue jobs = new SerialJobQueue();

      jobs.pushJob((next) -> new Parameters().invokeAllUrlParameterActions(next));
      jobs.pushJob((next) -> new DataGrabbers().downloadGameData(next));
      jobs.pushJob((next) -> new GameUpdater().invokeAllNecessaryGameUpdates(next));

      jobs.evaluate(() ->
      {
        log.info("done");
        flowData.setTransitionTo("StartScreenState");
      });
    });
  }
}
