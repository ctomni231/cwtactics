package org.wolftec.cwtactics.game.capture;

import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Capturable implements Component {
  public int     points;
  public boolean looseAfterCaptured;
  public String  changeIntoAfterCaptured;
}
