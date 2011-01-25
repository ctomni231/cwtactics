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

    public final String JNLP_PATH = "data/cwtactics.jnlp";
    public final String JAR_PATH = "data/cwtactics.jar";
    public final String TITLE = "Custom Wars Tactics";
    public final String VENDOR = "Exotec-BearWolf";
    public final String DESC = "A custom AW experience";

    private XML_Writer writer;

    public WebStart_Writer(){
        initialize();
    }

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
}