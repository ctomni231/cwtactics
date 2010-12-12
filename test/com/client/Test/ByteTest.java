package com.client.Test;

import com.system.map.ByteMap;
import junit.framework.Assert;
import org.junit.Test;

/**
 * ByteTest.java
 *
 * This class tests the ByteMap to see if everything is working okay
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.10
 */
public class ByteTest {

    public final int TEST_NUMBER = 127;
    @Test
    public void firstTest(){
        int crunch = TEST_NUMBER;
        ByteMap map = new ByteMap();
        map.add(0, crunch);
        crunch = map.get(map.compact(), 0);

        Assert.assertEquals(TEST_NUMBER, crunch);
    }

    @Test
    public void secondTest(){
        int crunch = TEST_NUMBER;
        ByteMap map = new ByteMap();
        map.add(1, crunch);
        crunch = map.get(map.compact(), 1);

        Assert.assertEquals(TEST_NUMBER, crunch);
    }

    @Test
    public void thirdTest(){
        int crunch = TEST_NUMBER;
        ByteMap map = new ByteMap();
        map.add(2, crunch);
        crunch = map.get(map.compact(), 2);

        Assert.assertEquals(TEST_NUMBER, crunch);
    }

    @Test
    public void fourthTest(){
        int crunch = TEST_NUMBER;
        ByteMap map = new ByteMap();
        map.add(3, crunch);
        crunch = map.get(map.compact(), 3);

        Assert.assertEquals(TEST_NUMBER, crunch);
    }
}
