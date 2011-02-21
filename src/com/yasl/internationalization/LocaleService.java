package com.yasl.internationalization;

import java.util.Enumeration;
import com.cwt.system.jslix.tools.FileFind;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.Properties;
import java.util.ResourceBundle;
import static com.yasl.logging.Logging.*;

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
 * @version 02.20.11
 */

public class LocaleService extends ClassLoader {

    private ResourceBundle lang;//The resource bundle for this service
    private FileFind finder;//The File finder for search for properties files
    private Properties property;//Used for holding properties for ID's

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
     * This function checks if a file path exists
     * @param path The file path to check
     * @return Whether the file path exists(T) or not(F)
     */
    public final boolean exists(String path){
        return finder.exists(path);
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
        if(filename.length() > 0){
            lang = ResourceBundle.getBundle(filename, locale, this);
            Enumeration<String> allKeys = lang.getKeys();
            while(allKeys.hasMoreElements()){
                String tempKey = allKeys.nextElement();
                property.setProperty(tempKey, lang.getString(tempKey));
            }
        }
    }

    /**
     * This class expands the ClassLoader to find resources from not only
     * the user directory, but also from URL and .jar files.
     * @param name the path to the properties file
     * @return A URL representing the properties file
     */
    @Override
    protected URL findResource(String name) {
      try {
        return finder.getFile(name).toURI().toURL();
      }
      catch (MalformedURLException e){
          warn(e.toString());
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
