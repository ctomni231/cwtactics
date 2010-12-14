package com.client.ParserTest;

import com.system.data.ByteMap;
import junit.framework.Assert;
import org.junit.Test;

/**
 * ByteTest.java
 *
 * This is a small testing module testing the short of the byte test class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.10
 */
public class ByteTest {

    public final int TEST_NUMBER = 60000;

    @Test
    public void testNum(){
        ByteMap temp = new ByteMap();
        temp.addShort(2, TEST_NUMBER);
        Assert.assertEquals(TEST_NUMBER, temp.getShort(2, temp.getCompact()));
    }
}
