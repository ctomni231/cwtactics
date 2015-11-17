package org.wolftec.cwt.controller.actions.core;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.collection.RingList;

public class ActionDataPuffer {

  /** Holds unused {@link ActionData} objects to reuse them later */
  private RingList<ActionData> pool;

  private RingList<ActionData> buffer;

  public ActionDataPuffer() {
    pool = new RingList<ActionData>(Constants.ACTION_BUFFER_SIZE);
    buffer = new RingList<ActionData>(Constants.ACTION_BUFFER_SIZE);

    pool.fillByProvider((i) -> new ActionData());
  }

  public void insertData(ActionData data) {
    ActionData newData = pool.popLast();
    ActionDataFactory.copyData(data, newData);
    buffer.push(newData);
  }

  public boolean hasData() {
    return !buffer.isEmpty();
  }

  public void popLast(Callback1<ActionData> dataHandler) {
    ActionData first = buffer.popFirst();
    dataHandler.$invoke(first);
    pool.push(first);
  }
}
