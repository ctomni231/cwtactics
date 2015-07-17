package org.wolftec.cwtactics.game.events.ui;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.bitset.BitSet;

public class TriggerData {
  public int                x;
  public int                y;
  public String             tile;
  public String             property;
  public String             unit;
  public BitSet             flags;
  public Callback0          addEnabled;
  public Callback1<Boolean> addEnabledWhen;
}
