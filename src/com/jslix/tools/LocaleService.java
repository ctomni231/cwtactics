package com.jslix.tools;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * LocaleService
 * 
 * The parallel Java class to DictionaryService by Tapsi, with the ability
 * to read outside class files by Stef & myself.
 *
 * @author <ul><li>Radom, Alexander</li>
 *          <li>Carr, Crecen</li>
 *          <li>Stefan569</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 10.08.10
 */

public class LocaleService extends ClassLoader {

    private ResourceBundle lang;
    private FileFind finder;
    private String filename;

    /**
     * This class deals with all the language functionality for
     * properties files
     * @param filename The path to the properties files
     */
    public LocaleService( String filename ){
        finder = new FileFind();
        this.filename = filename;
        getBundle();
    }

    /**
     * This function gets a resource bundle dependant on the users
     * native language
     */
    public final void getBundle(){
        lang = ResourceBundle.getBundle(filename, Locale.getDefault(), this);
    }

    /**
     * This class expands the ClassLoader to find resources from not only
     * the user directory, but also from URL and .jar files.
     * @param name the path to the properties file
     * @return A URL representing the properties file
     */
    @Override
    protected URL findResource(String name) {
      File f = finder.getFile(name);

      try {
        return f.toURI().toURL();
      }
      catch (MalformedURLException e) {
      }
      return super.findResource(name);
    }

    /**
     * Returns a localized string for a given id.
     *
     * @param ID the id
     * @return a localized string
     */
    public String get( String ID ){
        return (lang != null && ID != null) ? lang.getString(ID) : "N/A";
    }

}
