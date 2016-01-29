package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.collection.ListUtil;

public class SerialJobDataPipeQueue<T>
{
  private Array<Callback2<T, Callback0>> jobs;

  public SerialJobDataPipeQueue()
  {
    jobs = JSCollections.$array();
  }

  public SerialJobDataPipeQueue pushJob(Callback2<T, Callback0> jobCallback)
  {
    jobs.push(NullUtil.getOrThrow(jobCallback));
    return this;
  }

  public void evaluate(T data, Callback0 whenDone)
  {
    ListUtil.forEachArrayValueAsync(jobs, (index, job, next) -> job.$invoke(data, next), whenDone);
  }
}
