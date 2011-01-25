package com.cwt.system.jslix.tools;

/**
 * WebStart_Writer.java
 *
 * This class is used for writing a web start application only for CWT. This
 * class is still in alpha development.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.24.11
 */
public class WebStart_Writer {

    public final String JNLP_PATH = "data/cwtactics.jnlp";//Holds the JNLP path
    public final String JAR_PATH = "data/cwtactics.jar";//Hold the JAR Path
    public final String TITLE = "Custom Wars Tactics";//Holds the title
    public final String VENDOR = "Exotec-BearWolf";//Holds the creator data
    public final String DESC = "A custom AW experience";//Holds the description

    private XML_Writer writer;//The writer used to write the XML file

    /**
     * This class writes a web start for Custom Wars Tactics. This class still
     * needs to be expanded and is under construction
     */
    public WebStart_Writer(){
        initialize();
    }

    /**
     * This function creates a WebStart file with the above parameters.
     */
    private void initialize(){
        writer = new XML_Writer("data", "cwtactics.jnlp");
        writer.addXMLTag("jnlp");
        writer.addAttribute("spec", "1.0+", false);
        writer.addAttribute("href", JNLP_PATH, false);
        writer.addXMLTag("information");
        writer.addXMLTag("title");
        writer.addContent(TITLE);
        writer.endXMLTag();
        writer.addXMLTag("vendor");
        writer.addContent(VENDOR);
        writer.endXMLTag();
        writer.addXMLTag("description");
        writer.addContent(DESC);
        writer.endXMLTag();
        writer.addXMLTag("offline-allowed");
        writer.endXMLTag();
        writer.addXMLTag("shortcut");
        writer.addXMLTag("desktop");
        writer.endXMLTag(1);
        writer.addXMLTag("resources");
        writer.addXMLTag("j2se");
        writer.addAttribute("version", "1.5+", true);
        writer.addXMLTag("jar");
        writer.addAttribute("href", JAR_PATH, true);
        writer.endXMLTag();
        writer.addXMLTag("application-desc");
        writer.addAttribute("main-class", "JMain", true);
        writer.endAllTags();
    }

    /**
     * This function prints the Webstart file to console Window
     */
    public void print(){
        writer.print();
    }

    /**
     * This function writes the WebStart file onto the users computer
     */
    public void write(){
        writer.writeToFile(false);
    }
}