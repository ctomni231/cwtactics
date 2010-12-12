package com.client.ParserTest;

import com.client.graphic.xml.BackgroundReader;
import com.system.reader.XML_Reader;
import junit.framework.Assert;
import org.junit.Test;

/**
 * TestParser.java
 *
 * This is a small testing module testing the speeds of the XML parser.
 * This test uses the background XML file to test the 2 classes.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.10
 */
public class TestParser {

    public final String FILE = "data/background.xml";

    @Test
    public void testRegular(){
        BackgroundReader oldParser = new BackgroundReader(FILE);
        String[] items = oldParser.items;

        Assert.assertEquals(26, items.length);
    }

    @Test
    public void testNew(){
        XML_Reader.parse(FILE);
        int[] data = XML_Reader.getIndex("background image");
        String[] items = new String[data.length];

        for(int i = 0; i < items.length; i++)
            items[i] = XML_Reader.getAttribute(data[i], "file");

        Assert.assertEquals(26, items.length);
    }
}
