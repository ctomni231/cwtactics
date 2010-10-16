package com.jslix.tools;

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

//TODO: Finish commenting this class
public class KeyIndex {
    public byte index;
    public int code;

    public KeyIndex(){
        index = 0;
        code = 0;
    }
}
