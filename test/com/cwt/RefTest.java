package com.cwt;

import com.cwt.map.RefStore;
import junit.framework.Assert;
import org.junit.Test;

/**
 * RefTest.java
 *
 * This tests the Reference Storage to make sure everything is working
 * correctly.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.25.11
 */
public class RefTest {

    RefStore apple = new RefStore();//Creates a whole new reference object

    /**
     * Tests the class for simple storage mechanisms
     */
    @Test
    public void simpleTest(){
        apple.add("BLAH", 0);
        apple.add(".*BLAH", 0);
        apple.add("BLAH.*", 0);
        apple.add("BL.*AH", 0);
        apple.add("BLAH", 0);
    }
}
