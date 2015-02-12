package org.wolfTec.cwt.game.network;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolfTec.cwt.utility.validation.IntValue;

@SyntheticType
public abstract class NetworkMessage {

  @IntValue(min = 0, max = 99)
  public int actionId;
  @IntValue()
  public Array<Integer> parameters;
}
