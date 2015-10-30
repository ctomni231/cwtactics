package org.wolftec.wTec.collections;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback3;

public class MoveableMatrix {

  private int                   sideLen;
  private int                   centerX;
  private int                   centerY;
  private int                   defaultValue;
  private Array<Array<Integer>> data;

  @SuppressWarnings("unchecked")
  public MoveableMatrix(int sideLength) {
    data = JSCollections.$array();
    for (int i = 0; i < sideLength; i++) {
      data.push(JSCollections.$array());
      for (int j = 0; j < sideLength; j++) {
        data.$get(i).$set(j, 0);
      }
    }
    this.sideLen = sideLength;
  }

  public int getCenterX() {
    return centerX;
  }

  public int getCenterY() {
    return centerY;
  }

  public Array<Array<Integer>> getDataArray() {
    return data;
  }

  public void setCenter(int centerx, int centery, int defaultValue) {
    this.centerX = Math.max(0, centerx - (sideLen / 2));
    this.centerY = Math.max(0, centery - (sideLen / 2));
    this.defaultValue = defaultValue;

    // clean data
    for (int rx = 0; rx < sideLen; rx++) {
      for (int ry = 0; ry < sideLen; ry++) {
        this.data.$get(rx).$set(ry, defaultValue);
      }
    }
  }

  public int getValue(int x, int y) {
    x = x - this.centerX;
    y = y - this.centerY;

    if (x < 0 || y < 0 || x >= sideLen || y >= sideLen) {
      return defaultValue;

    } else {
      return this.data.$get(x).$get(y);
    }
  }

  public void setValue(int x, int y, int value) {
    x = x - this.centerX;
    y = y - this.centerY;

    if (x < 0 || y < 0 || x >= sideLen || y >= sideLen) {
      // TODO
      JSObjectAdapter.$js("throw new Error('IndexOutOfBounds')");

    } else {
      this.data.$get(x).$set(y, value);
    }
  }

  public void reset() {
    this.setCenter(0, 0, defaultValue);
  }

  /**
   * Sets all values to the value of newValue. If fixedValue is given, then all
   * positions with the same value as fixedValue won't change its value.
   *
   * @param newValue
   * @param fixedValue
   */
  public void setAllValuesTo(int newValue, int fixedValue) {
    for (int x = 0; x < sideLen; x++) {
      for (int y = 0; y < sideLen; y++) {
        if (this.data.$get(x).$get(y) != fixedValue) {
          this.data.$get(x).$set(y, newValue);
        }
      }
    }
  }

  /**
   * 
   * @param minValue
   * @param maxValue
   */
  public void onAllValidPositions(int minValue, int maxValue, Callback3<Integer, Integer, Integer> cb) {
    for (int x = 0; x < sideLen; x++) {
      for (int y = 0; y < sideLen; y++) {
        int value = this.data.$get(x).$get(y);
        if (value >= minValue && value <= maxValue) {
          cb.$invoke(x, y, value);
        }
      }
    }
  }

  public boolean nextRandomPosition(Callback3<Integer, Integer, Object> cb, Object arg, int minValue) {
    int n = JSGlobal.parseInt(Math.random() * sideLen, 10);
    for (int x = 0; x < sideLen; x++) {
      for (int y = 0; y < sideLen; y++) {
        if (this.data.$get(x).$get(y) >= minValue) {
          n--;

          if (n < 0) {
            cb.$invoke(x, y, arg);
            return true;
          }
        }
      }
    }

    return false;
  }

  public void nextValidPosition(int x, int y, int minValue, boolean walkLeft, Callback3<Integer, Integer, Object> cb, Object arg) {
    x = x - this.centerX;
    y = y - this.centerY;

    if (x < 0 || y < 0 || x >= sideLen || y >= sideLen) {
      if (walkLeft) {
        // start bottom right
        x = sideLen - 1;
        y = sideLen - 1;

      } else {
        // start top left
        x = 0;
        y = 0;

      }
    }

    // walk to the next position
    int mod = (walkLeft) ? -1 : +1;
    y += mod;
    for (; (walkLeft) ? x >= 0 : x < sideLen; x += mod) {
      for (; (walkLeft) ? y >= 0 : y < sideLen; y += mod) {
        if (this.data.$get(x).$get(y) >= minValue) {
          // valid position
          cb.$invoke(x, y, arg);
          return;

        }
      }

      y = (walkLeft) ? sideLen - 1 : 0;
    }
  }

  /**
   * 
   * @param x
   * @param y
   * @return
   */
  public boolean hasActiveNeighbour(int x, int y) {
    x = x - this.centerX;
    y = y - this.centerY;

    if (x < 0 || y < 0 || x >= sideLen || y >= sideLen) {
      JSGlobal.stjs.exception("IndexOutOfBounds");
    }

    return ((x > 0 && this.data.$get(x - 1).$get(y) > 0) || (y > 0 && this.data.$get(x).$get(y - 1) > 0)
        || (x < sideLen - 1 && this.data.$get(x + 1).$get(y) > 0) || (y < sideLen - 1 && this.data.$get(x).$get(y + 1) > 0));
  }
}
