package com.jslix.parser;

/**
 * XML_Writable
 *
 * An interface for writing XML_files
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.14.10
 */

public interface XML_Writable {
    /**
     * This function can be inserted into your files in order to quickly
     * write XML files
     * @param writer The XML_Writer associated with this class
     */
    public void writeToXML(XML_Writer writer);
}
