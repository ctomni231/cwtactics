package com.jslix.tools;

/**
 * Key Index
 *
 * A remix of UserAction that holds information regarding key and
 * mouse presses. Makes it easier to get keyboard and mouse actions
 * from the KeyPress class.
 *
 * @author Crecen
 */
public class KeyIndex {
    public byte index;
    public int code;

    public KeyIndex(){
        index = 0;
        code = 0;
    }
}
