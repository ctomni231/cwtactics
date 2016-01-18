package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.collection.ListUtil;

public class SerialJobQueue
{
  private Array<Callback1<Callback0>> jobs;

  public SerialJobQueue()
  {
    jobs = JSCollections.$array();
  }

  public SerialJobQueue pushJob(Callback1<Callback0> jobCallback)
  {
    jobs.push(NullUtil.getOrThrow(jobCallback));
    return this;
  }

  public void evaluate(Callback0 whenDone)
  {
    ListUtil.forEachArrayValueAsync(jobs, (index, job, next) -> job.$invoke(next), whenDone);
  }
}
