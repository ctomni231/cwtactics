package org.wolftec.cwtactics.engine.bitset;

import org.stjs.javascript.JSObjectAdapter;

public class BitSetFactory {
  public static BitSet create() {
    return JSObjectAdapter.$js("new BitSet()");
  }
}
