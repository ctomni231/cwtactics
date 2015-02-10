package org.wolfTec.cwt.utility;

import org.wolfTec.cwt.utility.beans.Bean;

import static org.stjs.javascript.JSObjectAdapter.$js;

@Bean public class MemoryTools {

  private boolean memoryProfilingEnabled;
  
  public MemoryTools () {
    memoryProfilingEnabled = $js("(performance && performance.memory)");
  }

  public int getHeapSizeLimit () {
    return memoryProfilingEnabled ? $js("performance.memory.jsHeapSizeLimit") : -1;
  }

  public int getTotalHeapSize () {
    return memoryProfilingEnabled ? $js("performance.memory.totalJSHeapSize") : -1;
  }

  public int getUsedHeapSize () {
    return memoryProfilingEnabled ? $js("performance.memory.usedJSHeapSize") : -1;
  }
}