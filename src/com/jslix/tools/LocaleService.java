package com.jslix.tools;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.Properties;
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
 * @version 10.28.10
 */

public class LocaleService extends ClassLoader {

    private ResourceBundle lang;
    private FileFind finder;
    private Properties property;

    /**
     * This class deals with all the language functionality for
     * properties files
     * @param filename The path to the properties files
     */
    public LocaleService(){
        finder = new FileFind();
        property = new Properties();
    }

    /**
     * This gets a bundle for the default Locale
     * @param filename The path to the properties file
     */
    public final void getBundle(String filename){
        getBundle(filename, Locale.getDefault());
    }

    /**
     * This function gets a resource bundle dependant on the users
     * native language
     * @param filename The path to the properties file
     * @param locale The locale language type to use
     */
    public final void getBundle(String filename, Locale locale){
        lang = ResourceBundle.getBundle(filename, locale, this);
        for(String theSet: lang.keySet())
            property.setProperty(theSet, lang.getString(theSet));
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
        return (property.containsKey(ID)) ? property.getProperty(ID) : ID;
    }

}
