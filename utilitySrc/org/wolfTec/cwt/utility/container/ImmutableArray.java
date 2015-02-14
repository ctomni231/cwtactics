package org.wolfTec.cwt.utility.container;

import org.stjs.javascript.Array;

public abstract class ImmutableArray<T> extends Array<T> {
  
  @Override
  public void $set(int index, T value) {
    throw new UnsupportedOperationException("read only list");
  }
  
  @Override
  public int push(T... values) {
    throw new UnsupportedOperationException("read only list");
  }
}
