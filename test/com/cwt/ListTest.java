package com.cwt;

import com.cwt.system.data.HashStore;
import com.cwt.system.data.ListStore;
import junit.framework.Assert;
import org.junit.Test;

/**
 * ListTest.java
 *
 * This test class tests the HashStore and ListStore class and makes sure
 * everything is functioning correctly.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.18.11
 */
public class ListTest {

    @Test
    public void simpleHashTest(){
        HashStore hash = new HashStore();
        hash.addData("cool");
        hash.addData("bang");

        Assert.assertEquals(0, hash.getData("cool"));
        Assert.assertEquals(1, hash.getData("bang"));
    }

    @Test
    public void simpleListTest(){
        ListStore list = new ListStore();
        list.addData("cool");
        list.addData("bang");

        Assert.assertEquals(0, list.getData("cool"));
        Assert.assertEquals(1, list.getData("bang"));
    }
}
