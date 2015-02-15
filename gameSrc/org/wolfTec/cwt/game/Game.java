package org.wolfTec.cwt.game;

import org.wolfTec.wolfTecEngine.beans.BeanFactory;

public abstract class Game {

  public String getVersion() {
    return EngineGlobals.VERSION;
  }

  public static BeanFactory engine;

  public static void main(String[] args) {

    // create engine
    engine = new BeanFactory("cwt");

    // start
  }

}
