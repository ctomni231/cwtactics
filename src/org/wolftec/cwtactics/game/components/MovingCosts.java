package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class MovingCosts implements Component {
  public Map<String, Integer> costs;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("costs").map().keys((keyData) -> keyData.pattern("(\\@ALL|MT[A-Z]{4})")).values((valData) -> valData.integer().ge(0).le(10));
  }
}
