package org.wolftec.cwtactics.game.util;

/**
 * From:
 * http://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle
 * -a-single-bit-in-javascript
 */
public final class BitUtil {

  /**
   * 
   * @param number
   * @param bit
   * @return true when the bit in the number is true
   */
  public static boolean isTrue(int number, int bit) {
    return ((number >> bit) % 2 != 0);
  }

  /**
   * Sets the given bit in the number to 1.
   * 
   * @param number
   * @param bit
   * @return
   */
  public static int set(int number, int bit) {
    return number | 1 << bit;
  }

  /**
   * Sets the given bit in the number to 0.
   * 
   * @param number
   * @param bit
   * @return
   */
  public static int clear(int number, int bit) {
    return number & ~(1 << bit);
  }

  /**
   * Toggles the given bit in the number.
   * 
   * @param number
   * @param bit
   * @return
   */
  public static int toggle(int number, int bit) {
    return isTrue(number, bit) ? clear(number, bit) : set(number, bit);
  }
}
