package com.system.reader;

import com.jslix.tools.XML_Parser;

/**
 * XML_Reader.java
 *
 * A static class used for binding both XML parsing and Language control
 * in one class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.10.10
 */
public class XML_Reader {

    /**
     * This variable helps handle and parse XML documents
     */
    private static XML_Parser parser = new XML_Parser();
    /**
     * This variable regulates XML language conversions
     */
    private static LangControl control = new LangControl();

    /**
     * This function controls what XML tags are stored within the Reader
     * @param tagList The tag list stored within the reader
     */
    public void addFocus(String tagList){
        parser.addFocus(tagList);
    }

    /**
     * This function parses an XML document
     * @param filename
     */
    public void parse(String filename){
        parser.parse(filename);
    }
}
