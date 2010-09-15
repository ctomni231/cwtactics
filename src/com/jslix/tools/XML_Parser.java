package com.jslix.tools;

import java.io.File;
import java.util.ArrayList;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

/**
 * XML_Parser
 *
 * Simple XML parser class. Written by Tapsi.
 */
public class XML_Parser extends DefaultHandler {

	// VARIABLES
	/////////////
	
	private ArrayList<String> header;

	
	// CONSTRUCTOR
	///////////////
	
	public XML_Parser( String file ){
		header = new ArrayList<String>();
		read(file);
	}

	
	// PUBLIC METHODS
	//////////////////
	
	/**
	 * Creates a SAX parser and reads the file
	 * @param filename filename of the XML file
	 */
    private void read( String filename ){
        try {
            //FileFind finder = new FileFind();
            File file = new File(filename);
            SAXParserFactory factory 	= SAXParserFactory.newInstance();
            SAXParser parser 			= factory.newSAXParser();
            parser.parse( file , this );
        } catch (Exception e) { System.out.println(e); }
    }
    
	/**
	 * Returns the last tag of the cursor position 
	 */
    public String getLastHeader(){
    	return getHeader( header.size() - 1 );
    }

	/**
	 * Returns the first tag of the XML document ( the root )
	 */
    public String getMasterHeader( int level ){
    	return getHeader( header.size() - 1 - level );
    }
    
	/**
	 * Returns a tag at a given level of depth  
	 */
    public String getHeader( int pos ){
    	if( header.size() > 0 && pos >= 0 && pos < header.size() ) return header.get(pos);
    	return null;
    }

	/**
	 * Is a tag a content of the current position ?
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
    
    @Override
    public void startElement(String namespaceURI, String sname, String qname, Attributes attrs) {
    	
    	// add XML tag
    	header.add(qname);
        	
    	// return if no attributes available
    	if( attrs != null ) entry(attrs);
    }
    
    @Override
    public void endElement (String namespaceURI, String sname, String qname) {
    	
    	entryEnd();
    	
    	// remove last XML tag
    	header.remove( header.size() - 1 ); 
    }

    @Override
    public void characters (char[] ch, int start, int length) {}
    
    // SIMPLE METHOD FOR CHILDREN CLASSES.
    public void entry( Attributes attributes ){}
    
    // SIMPLE METHOD FOR CHILDREN CLASSES.
    public void entryEnd(){}

}

