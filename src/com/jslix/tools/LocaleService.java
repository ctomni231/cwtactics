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
 * @todo TODO Finish commenting this class
 */

public class LocaleService extends ClassLoader {

    private ResourceBundle lang;
    private FileFind finder;
    private String filename;

    public LocaleService( String filename ){
        finder = new FileFind();
        this.filename = filename;
        getBundle();
    }
    
    public final void getBundle(){
        lang = ResourceBundle.getBundle(filename, Locale.getDefault(), this);
    }

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
