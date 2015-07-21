package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Capturable implements Component {

  public int     points;
  public boolean looseAfterCaptured;
  public String  changeIntoAfterCaptured;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("points").integer().def(20);

    data.desc("looseAfterCaptured").bool().def(false);

    data.desc("changeIntoAfterCaptured").isString().def("UTNONE").pattern("UT[A-Z]{4}");
  }
}
