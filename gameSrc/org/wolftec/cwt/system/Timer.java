package org.wolftec.cwt.system;

public class Timer {
  public int time;
  public int step;
  public int maxTime;
  public int maxSteps;

  public Timer(int steps, int time) {
    this.time = 0;
    this.step = 0;
    this.maxTime = time;
    this.maxSteps = steps;
  }

  public void evalTime(int time) {
    this.time += time;
    if (this.time > this.maxTime) {
      this.step += 1;
      this.time = 0;

      if (this.step == this.maxSteps) {
        this.step = 0;
      }
    }
  }

  public void reset() {
    this.time = 0;
    this.step = 0;
  }

}
