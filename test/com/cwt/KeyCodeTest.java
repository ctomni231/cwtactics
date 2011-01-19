package com.cwt;

import com.cwt.system.data.KeyStore;
import junit.framework.Assert;
import org.junit.Test;

/**
 * KeyCodeTest.java
 *
 * This test class tests the KeyStore class and makes sure everything is
 * functioning correctly.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.18.11
 */
public class KeyCodeTest {

    @Test
    public void simpleStore(){
        KeyStore temp = new KeyStore();
        temp.addData(0, 100);
        int answer = temp.getData()[0];

        Assert.assertEquals(100, answer);
    }

    @Test
    public void doubleStore(){
        KeyStore temp = new KeyStore();
        temp.addData(0, 100);
        temp.addData(1, 200);

        int answer = temp.getData()[0];
        Assert.assertEquals(100, answer);

        answer = temp.getData()[1];
        Assert.assertEquals(200, answer);
    }

    @Test
    public void backDouble(){
        KeyStore temp = new KeyStore();
        temp.addData(1, 200);
        temp.addData(0, 100);

        int answer = temp.getData()[0];
        Assert.assertEquals(100, answer);

        answer = temp.getData()[1];
        Assert.assertEquals(200, answer);
    }

    @Test
    public void lastStore(){
        KeyStore temp = new KeyStore();
        temp.addData(31, 100);
        int answer = temp.getData()[31];

        Assert.assertEquals(100, answer);
    }

    @Test
    public void lastFirstStore(){
        KeyStore temp = new KeyStore();
        temp.addData(31, 200);
        temp.addData(0, 100);

        int answer = temp.getData()[0];
        Assert.assertEquals(100, answer);

        answer = temp.getData()[31];
        Assert.assertEquals(200, answer);
    }

    @Test
    public void testAllStore(){
        KeyStore temp = new KeyStore();
        for(int i = 0; i < 32; i++)
            temp.addData(i, 100+(i*100));

        for(int i = 0, answer = 0; i < 32; i++){
            answer = temp.getData()[i];
            Assert.assertEquals(100+(i*100), answer);
        }
    }

    @Test
    public void backTestAll(){
        KeyStore temp = new KeyStore();
        for(int i = 32; i >= 0; i--)
            temp.addData(i, 100+(i*100));

        for(int i = 0, answer = 0; i < 32; i++){
            answer = temp.getData()[i];
            Assert.assertEquals(100+(i*100), answer);
        }
    }
}
