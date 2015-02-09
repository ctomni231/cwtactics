package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.utility.MaxValue;
import org.wolfTec.utility.MinValue;

public class SuicideType {

  @MinValue(1) @MaxValue(10) public int damage;
  @MinValue(1) @MaxValue(Constants.MAX_SELECTION_RANGE) public int range;
  public Array<String> noDamage = JSCollections.$array();
}
