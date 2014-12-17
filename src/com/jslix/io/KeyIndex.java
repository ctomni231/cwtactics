package com.jslix.io;

/**
 * KeyIndex.java
 *
 * A remix of UserAction that holds information regarding key and
 * mouse presses. Makes it easier to get keyboard and mouse actions
 * from the KeyPress class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.10.10
 */

public class KeyIndex {
	/** This holds the hold and pressed index */
    public byte index;
    /** This holds the key pressed or the mouse button */
    public int code;

    /**
     * This class holds the key and mouse information for classes. It
     * is purposely small so it won't take up any memory.
     */
    public KeyIndex(){
        index = 0;
        code = 0;
    }
}
