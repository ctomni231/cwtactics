package com.system.xml;

import java.io.File;
import java.util.ArrayList;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

public class Parser extends DefaultHandler {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private ArrayList<String> header;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public Parser( String file ){
		header = new ArrayList<String>();
		read(file);
	}

	/**
	 * Creates a SAX parser and reads the file.
	 * 
	 * @param filename
	 */
    private void read( String filename ){
    	
        try {
        	
            File file 					= new File(filename);
            SAXParserFactory factory 	= SAXParserFactory.newInstance();
            SAXParser parser 			= factory.newSAXParser();
            parser.parse( file, this );
        } catch (Exception e) { System.out.println(e); }
    }
	
    
    
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
    
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
    
    
    
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 * This methods are extended from master class
	 * and not necessary for subclasses.
	 * Only the entry method is for subclasses, to
	 * process the XML content.
	 * 
	 */
    
    @Override
    public void startElement(String namespaceURI, String sname, String qname, Attributes attrs) {
    	
    	// add XML tag
    	header.add(qname);
        	
    	// return if no attributes available
    	if( attrs != null ) entry(attrs);
    }
    
    @Override
    public void endElement (String namespaceURI, String sname, String qname) {
    	
    	// remove last XML tag
    	header.remove( header.size() - 1 ); 
    }

    @Override
    public void characters (char[] ch, int start, int length) {}
    
    // simple method for child classes.
    public void entry( Attributes attributes ){}

	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */
	
	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */
	

}

