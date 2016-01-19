package org.wolftec.cwt.states.start;

import org.wolftec.cwt.loading.ResourceRequestWatcher;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.log.LogProvider;

public class LoadingStateResourceWatcher implements ResourceRequestWatcher
{
  private Log log;

  public LoadingStateResourceWatcher()
  {
    log = LogProvider.createLogger(this);
  }

  @Override
  public void onStartLoading(String what)
  {
    log.info("started loading " + what);
  }

  @Override
  public void onFinishedLoading(String what)
  {
    log.info("finished loading " + what);
  }

}