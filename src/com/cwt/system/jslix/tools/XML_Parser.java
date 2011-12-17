package com.cwt.system.jslix.tools;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

/**
 * XML_Parser
 *
 * Simple XML parser class. Written by Tapsi. Extended by JakeSamiRulz
 * in order to allow for static parsing.
 *
 * @author <ul><li>Radom, Alexander</li>
 *              <li>Carr, Crecen</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 02.20.11
 */

public class XML_Parser extends DefaultHandler{

    // VARIABLES
    /////////////

    private SAXParser parser;//The SAX parser associated with this class
    private FileFind finder;//Helps regulate how files are searched
    private ArrayList<String> header;//Holds the header tags for the document

    private ArrayList<String>[] tagList;//Helps hold the tags in tree format
    private HashMap<String, String>[] attrList;//Holds attributes in tree form
    private ArrayList<String>[] charList;//Holds characters in tree format

    private HashMap<String, String>[] tempAttr;//Temporary hold for attributes
    private ArrayList<String>[] tempChar;//Temporary hold for characters
    private ArrayList<String>[] focusTag;//Helps focus which tags are stored

    // CONSTRUCTOR
    ///////////////

    /**
     * This class sets up an XML parser ready for parsing using the parse()
     * command.
     */
    public XML_Parser(){
        try {
            finder = new FileFind();
            parser = SAXParserFactory.newInstance().newSAXParser();
        } catch (ParserConfigurationException ex) {
            System.err.println(ex);
        } catch (SAXException ex) {
            System.err.println(ex);
        }
    }

    /**
     * This class sets up an XML parser ready for parsing and parses the
     * file specified in the file path.
     * @param filename The path to the XML file
     */
    public XML_Parser( String filename ){
        this();
        parse( filename );
    }

    // PUBLIC METHODS
    //////////////////

    /**
     * This function parses the entire XML document regardless of the
     * location of the document.
     * @param filename The path to the XML document
     */
    public final void parse(String filename){
        try {
            parser.parse(finder.getFile(filename), this);
        } catch (SAXException ex) {
            System.err.println(ex);
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }

    /**
     * This function gets attributes from a parsed document. Attributes
     * are sorted by index which is decided by how the XML tags ended
     * in the document in getLocation().
     * @param index The tag location of the attributes by getLocation()
     * @return A HashMap containing the attributes
     */
    public HashMap<String, String> getAttribute(int index){
        return (index >= 0 && index < attrList.length) ?
            attrList[index] : new HashMap<String, String>();
    }

    /**
     * This function is used to get single attributes from a parsed document.
     * Attributes are sorted by index which is decided by how XML tags
     * ended in the document in getLocation().
     * @param index The tag location of the attributes by getLocation()
     * @param key The key of the attribute to find
     * @return The value of the represented key, or null
     */
    public String getAttribute(int index, String key){
        HashMap<String, String> temp = getAttribute(index);
        return (temp.containsKey(key)) ? temp.get(key) : "";
    }

    /**
     * This function is used to get the tags from a specific index
     * in the document.
     * @param index The index location of the tag hierarchy.
     * @return The tag in parent -> children order
     */
    public String[] getTags(int index){
        return (index >= 0 && index < tagList.length) ?
            createArray(tagList[index]) : new String[0];
    }

    /**
     * This function is used to get the character strings from a parsed
     * document. Characters are sorted by index which is decided by how
     * XML tags ended in the document in getLocation().
     * @param index The tag location of the characters by getLocation()
     * @return The array of characters in the current location
     */
    public String[] getCharacters(int index){
        return (index >= 0 && index < charList.length) ?
            createArray(charList[index]) : new String[0];
    }

    /**
     * This function is used to get the location of a string of XML tags.
     * Tags are listed from parent->child->grandchild->great-grandchild
     * split by the default whitespace delimiter. The locations are used
     * to find attributes and characters.
     * @param tag The tag path to find in the array list
     * @return The locations of those particular tag paths in this array
     */
    public int[] getLocation(String tag){
        return getLocation(tag, "");
    }

    /**
     * This function is used to get the location of a string of XML tags.
     * Tags are listed from parent->child->grandchild->great-grandchild
     * split by the delimiter you specify. The locations are used to find
     * attributes and characters.
     * @param tag The tag path to find in the array list
     * @param delimiter The character that splits up the tags
     * @return The locations of those particular tag paths in this array
     */
    public int[] getLocation(String tag, String delimiter){
        if(delimiter.equals(""))
            delimiter = " ";

        int[] location = new int[0];
        String[] temp = tag.split(delimiter);

        for(int i = 0; i < tagList.length; i++){
            if(tagList[i].size() != temp.length)
                continue;
            for(int j = 0; j < tagList[i].size(); j++){
                if(!temp[j].equals(tagList[i].get(j)))
                    break;
                if(j == tagList[i].size()-1)
                    location = addData(location, i);
            }
        }

        return location;
    }

    /**
     * This function is used to control the XML tags stored in the array.
     * Tags are listed from parent->child->grandchild->great-grandchild
     * split by the default whitespace delimiter. You can make multiple
     * paths for storage with multiple calls before parsing.
     * @param tag The tag path the parser searches for
     */
    public void addFocus(String tag){
        addFocus(tag, "");
    }

    /**
     * This function is used to control the XML tags stored in the array.
     * Tags are listed from parent->child->grandchild->great-grandchild
     * split by the delimiter you specify. You can make multiple
     * paths for storage with multiple calls before parsing.
     * @param tag The tag path the parser searches for
     * @param delimiter The character that splits up the tags
     */
    public void addFocus(String tag, String delimiter){
        if(delimiter.equals(""))
            delimiter = " ";
        focusTag = addData(focusTag, tag.split(delimiter));
    }

    /**
     * This gets the amount of parsed data in the document
     * @return The amount of separate storage tags in the document.
     */
    public int size(){
        return (tagList != null) ? tagList.length : 0;
    }

    /**
     * This clears all the stored array data.
     */
    public void clear(){
        tagList = null;
        attrList = null;
        charList = null;
    }

    // OVERRIDDEN METHODS
    /////////////////////

    /**
     * This indicates the start of a document parse
     * @throws SAXException when XML document fails to read
     */
    @Override
    public void startDocument() throws SAXException {
        header = new ArrayList<String>();
        tagList = null;
        attrList = null;
        charList = null;
        tempAttr = null;
        tempChar = null;
        focusTag = null;
    }

    /**
     * This indicates the end of a document parse
     * @throws SAXException when XML document fails to read
     */
    @Override
    public void endDocument() throws SAXException {
        tempAttr = null;
        tempChar = null;
        focusTag = null;
    }

    /**
     * This reports the occurrence of an actual element. It includes the
     * elements attributes, with the exception of XML vocabulary specific\
     * attributes.
     * @param namespaceURI the URI this element is associated with
     * @param localName name of element
     * @param rawName XML 1.0 version of element name
     * @param atts list for this element
     * @throws SAXException when XML document fails to read
     */
    @Override
    public void startElement(String namespaceURI, String localName,
            String rawName, Attributes atts) throws SAXException {
        //Original function
        header.add(rawName);
    	if( atts != null ) entry(atts);

        tempChar = addBranch(tempChar);
        tempAttr = addBranch(tempAttr);

        for(int i = 0; i < atts.getLength(); i++)
            tempAttr = addData(tempAttr, atts.getLocalName(i),
                    atts.getValue(i));
    }

    /**
     * This reports character data
     * @param ch character array with character data
     * @param start index in array where data starts
     * @param end index in array where data ends
     * @throws SAXException when XML document fails to read
     */
    @Override
    public void characters(char[] ch, int start, int end) throws SAXException {
        if(new String(ch, start, end).length() > 0)
            tempChar = addData(tempChar, new String(ch, start, end));
    }

    /**
     * Indicates the end of an element
     * @param namespaceURI the URI this element is associated with
     * @param localName name of element
     * @param rawName XML 1.0 version of element name
     * @param atts list for this element
     * @throws SAXException when XML document fails to read
     */
    @Override
    public void endElement(String namespaceURI, String localName,
            String rawName) throws SAXException {
        if(checkFocus()){
            tagList = addBranch(tagList);
            tagList = addData(tagList, header);
            attrList = addBranch(attrList);
            attrList = addData(attrList, getData(tempAttr));
            charList = addBranch(charList);
            charList = addData(charList, getData(tempChar));
            tempAttr = removeBranch(tempAttr);
            tempChar = removeBranch(tempChar);
        }

        //Original function: remove last XML tag
        entryEnd();
    	header.remove( header.size() - 1 );

    }

    // PRIVATE METHODS
    //////////////////

    /**
     * This adds an ArrayList to an array branch
     * @param fillData The data to add the ArrayList to
     * @return The new array with a new ArrayList appended
     */
    private ArrayList<String>[] addBranch(ArrayList<String>[] fillData){
        if(fillData == null)
            fillData = new ArrayList[0];

        ArrayList<String>[] temp = fillData;
        fillData = new ArrayList[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = new ArrayList<String>();
        return fillData;
    }

    /**
     * This adds an HashMap to an array branch
     * @param fillData The data to add the HashMap to
     * @return The new array with a new HashMap appended
     */
    private HashMap<String, String>[] addBranch(
            HashMap<String, String>[] fillData){
        if(fillData == null)
            fillData = new HashMap[0];

        HashMap<String, String>[] temp = fillData;
        fillData = new HashMap[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = new HashMap<String, String>();
        return fillData;
    }

    /**
     * This adds an integer to an integer array
     * @param fillData The integer array to add to
     * @param data The integer data to add
     * @return The integer array with appended data
     */
    private int[] addData(int[] fillData, int data){
        if(fillData == null)
            fillData = new int[0];

        int[] temp = fillData;
        fillData = new int[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }

    /**
     * This adds a String to an ArrayList array
     * @param fillData The ArrayList array to add to
     * @param data The String to add
     * @return The ArrayList array with appended String in it
     */
    private ArrayList<String>[] addData(ArrayList<String>[] fillData,
            String data){
        if(fillData == null)
            fillData = addBranch(fillData);

        fillData[fillData.length-1].add(data);

        return fillData;
    }

    /**
     * This adds a key an a value to a HashMap array
     * @param fillData The HashMap array to add to
     * @param key The key to add
     * @param value The value associated with the key
     * @return The HashMap array with appended key and value in it
     */
    private HashMap<String, String>[] addData(
            HashMap<String, String>[] fillData, String key, String value){
        if(fillData == null)
            fillData = addBranch(fillData);

        fillData[fillData.length-1].put(key, value);

        return fillData;
    }

    /**
     * This adds an ArrayList to an ArrayList array
     * @param fillData The ArrayList to add to
     * @param data The ArrayList to add
     * @return The ArrayList array with the appended ArrayList
     */
    private ArrayList<String>[] addData(
            ArrayList<String>[] fillData, ArrayList<String> data){
        if(fillData == null)
            fillData = addBranch(fillData);

        for(String name: data)
            fillData[fillData.length-1].add(name);

        return fillData;
    }

    /**
     * This adds a native array to an ArrayList array
     * @param fillData The ArrayList to add to
     * @param data The native array to add
     * @return The ArrayList array with the appended native array
     */
    private ArrayList<String>[] addData(
            ArrayList<String>[] fillData, String[] data){
        if(fillData == null)
            fillData = addBranch(fillData);

        fillData[fillData.length - 1].addAll(Arrays.asList(data));

        return fillData;
    }

    /**
     * This adds a HashMap to a HashMap array
     * @param fillData The HashMap to add to
     * @param data The HashMap to add
     * @return The HashMap array with the appended HashMap
     */
    private HashMap<String, String>[] addData(
            HashMap<String, String>[] fillData, HashMap<String, String> data){
        if(fillData == null)
            fillData = addBranch(fillData);

        for(String name: data.keySet())
            fillData[fillData.length-1].put(name, data.get(name));

        return fillData;
    }

    /**
     * This gets the ArrayList data from an ArrayList array
     * @param fillData The ArrayList array to pull from
     * @return The last ArrayList data inputted into the ArrayList array
     */
    private ArrayList<String> getData(ArrayList<String>[] fillData){
        return (fillData.length > 0) ? fillData[fillData.length-1] :
            new ArrayList<String>();
    }

    /**
     * This gets the HashMap data from a HashMap array
     * @param fillData The HashMap array to pull from
     * @return The last HashMap data inputted into the HashMap array
     */
    private HashMap<String, String> getData(
            HashMap<String, String>[] fillData){
        return (fillData.length > 0) ? fillData[fillData.length-1] :
            new HashMap<String, String>();
    }

    /**
     * This removes one element from an ArrayList array
     * @param fillData The ArrayList array to remove from
     * @return The new array with one element taken away
     */
    private ArrayList<String>[] removeBranch(ArrayList<String>[] fillData){
         if(fillData.length > 0){
            ArrayList<String>[] temp = fillData;
            fillData = new ArrayList[temp.length-1];
            System.arraycopy(temp, 0, fillData, 0, temp.length-1);
         }
         return fillData;
     }

    /**
     * This removes one element from a HashMap array
     * @param fillData The HashMap array to remove from
     * @return The new array with one element taken away
     */
     private HashMap<String, String>[] removeBranch(
             HashMap<String, String>[] fillData){
         if(fillData.length > 0){
            HashMap<String, String>[] temp = fillData;
            fillData = new HashMap[temp.length-1];
            System.arraycopy(temp, 0, fillData, 0, temp.length-1);
         }
         return fillData;
     }

     /**
      * This checks if the current scanned array if part of the focused array
      * @return If the tag list is included in the focus (T) or not (F)
      */
     private boolean checkFocus(){
         if(focusTag == null)
             return true;

         if(header.size() < focusTag.length)
             return false;

         for(int i = 0; i < focusTag.length; i++){
            for(int j = 0; j < focusTag[i].size(); j++){
                if(!header.get(j).equals(focusTag[i].get(j)))
                    break;
                if(i == focusTag[i].size()-1)
                    return true;
            }
         }

         return focusTag.length == 0;
     }

     /**
      * This function creates a basic array from a ArrayList
      * @param fillData The ArrayList to convert
      * @return A basic String array with the same data
      */
     private String[] createArray(ArrayList<String> fillData){
         if(fillData == null)
             return new String[0];

         String[] temp = new String[fillData.size()];
         for(int i = 0; i < temp.length; i++)
             temp[i] = fillData.get(i);
         return temp;
     }

    //------------------------
    // ORIGINAL CLASS FUNCTIONS
    // By: Tapsi
    //------------------------

    // PUBLIC METHODS
    //////////////////

    //Returns the last tag of the cursor position
    /**
     * This function returns the last tag of the cursor position
     * @return The last tag
     */
    public String getLastHeader(){
    	return getHeader( header.size() - 1 );
    }

    //Returns the first tag of the XML document ( the root )
    /**
     * This function returns the first tag (root) of the XML document
     * @param level The level to search at
     * @return The first tag
     */
    public String getMasterHeader( int level ){
    	return getHeader( header.size() - (level+1) );
    }

    //Returns a tag at a given level of depth
    /**
     * This function returns a tag at a given level of depth
     * @param pos The position level of the tag
     * @return The tag at the given position level
     */
    public String getHeader( int pos ){
        return (header.size() > 0 && pos >= 0 && pos < header.size()) ?
            header.get(pos) : null;
    }

    //Is a tag a content of the current position ?
    /**
     * This function checks if a tag is content of the current position
     * @param header The current name of the tag
     * @return Whether the tag is content of the position (T) or not (F)
     */
    public boolean isAheader( String header ){
    	// if you found a header return true
    	for( String s : this.header ){
            if( s.equals(header)) return true;
    	}
    	return false;
    }

    // XML ENTRY METHODS
    /////////////////////

    // SIMPLE METHOD FOR CHILDREN CLASSES.
    /**
     * This function gives all the attributes for a tag entry while parsing
     * @param attributes The attributes of the current parsed entry
     */
    public void entry( Attributes attributes ){}

    // SIMPLE METHOD FOR CHILDREN CLASSES.
    /**
     * This function tells you when the tag entry has ended parsing
     */
    public void entryEnd(){}

}
