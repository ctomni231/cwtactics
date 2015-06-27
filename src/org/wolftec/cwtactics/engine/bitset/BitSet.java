package org.wolftec.cwtactics.engine.bitset;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge
public class BitSet {

  /**
   * Set a bit at position index, default 1
   * 
   * @param bit
   * @return
   */
  public native BitSet set(int bit);

  /**
   * Set a bit at position index, default 1
   * 
   * @param bit
   * @param value
   * @return
   */
  public native BitSet set(int bit, int value);

  /**
   * Get a bit at position index
   * 
   * @param bit
   * @return
   */
  public native int get(int bit);

  /**
   * Get the number of bits set
   * 
   * @return
   */
  public native int cardinality();

  /**
   * Get the most significant bit set, same as log base two
   * 
   * @return
   */
  public native int msb();

  /**
   * Clear all bits by setting them to 0
   * 
   * @param fromBit
   * @param toBit
   * @return
   */
  public native BitSet clear();

  /**
   * Clear a range of bits by setting it to 0
   * 
   * @param fromBit
   * @param toBit
   * @return
   */
  public native BitSet clear(int bitNumber);

  /**
   * Clear a range of bits by setting it to 0
   * 
   * @param fromBit
   * @param toBit
   * @return
   */
  public native BitSet clear(int fromBit, int toBit);

  /**
   * Get the number of bits set
   * 
   * @param fromBit
   * @param toBit
   * @return
   */
  public native BitSet getRange(int fromBit, int toBit);

  /**
   * Set a range of bits, either by a binary string or by a single bit value
   * 
   * @param fromBit
   * @param toBit
   * @param bitString
   * @return
   */
  public native BitSet setRange(int fromBit, int toBit, String bitString);

  /**
   * Set a range of bits, either by a binary string or by a single bit value
   * 
   * @param fromBit
   * @param toBit
   * @param value
   * @return
   */
  public native BitSet setRange(int fromBit, int toBit, int value);

  /**
   * Overrides the toString function for a pretty representation
   * 
   * @param radix
   * @return
   */
  public native String toString(int radix);

  /**
   * Overrides the toString function for a pretty representation (radix = 2)
   * 
   * @param radix
   * @return
   */
  @Override
  public native String toString();

  public native BitSet nand(BitSet mxiedSet);

  public native BitSet nor(BitSet mxiedSet);

  public native BitSet xor(BitSet mxiedSet);

  public native BitSet and(BitSet mxiedSet);

  public native BitSet or(BitSet mxiedSet);

  public native BitSet not(BitSet mxiedSet);

  /**
   * Create a copy of the actual BitSet object
   */
  @Override
  public native BitSet clone();

  /**
   * Compare (=same size and all bits equal) two BitSet objects
   * 
   * @param mxiedSet
   * @return
   */
  public native boolean equals(BitSet mxiedSet);

  /**
   * Check if all bits of a BitSet are set to 0
   * 
   * @param mxiedSet
   * @return
   */
  public native boolean isEmpty();
}
