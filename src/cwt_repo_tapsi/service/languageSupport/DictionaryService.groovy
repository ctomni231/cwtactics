@Typed
package cwt_repo_tapsi.service.languageSupport

import java.io.File;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.AccessControlException;
import java.util.Locale;
import java.util.Properties;
import java.util.ResourceBundle;

import com.jslix.tools.FileFind;

/**
 * Dictionary class that loads localized strings from a file. Expanded
 * to store in an overwriting method.
 * 
 * @author <UL><LI>Radom, Alexander</LI>
 *       <LI>Carr, Crecen</LI></UL>
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class DictionaryService extends ClassLoader
{
	private ResourceBundle lang;
    private FileFind finder;
    private Properties property;
	
	/**
	 * This class gets Text files based on Language Locale.	
	 */
	DictionaryService(){
		finder = new FileFind()
		property = new Properties()
	}
	
	/**
	* This gets a bundle for the default Locale
	* @param filename The path to the properties file
	*/
	public final void getBundle(String filename){
		getBundle(filename, Locale.getDefault())
	}
	
	/**
	* This function gets a resource bundle dependent on the users
	* native language
	* @param filename The path to the properties file
	* @param locale The locale language type to use
	*/
	public final void getBundle(String filename, Locale locale){
		lang = ResourceBundle.getBundle(filename, locale, this)
		for(String theSet: lang.keySet())
			property.setProperty(theSet, lang.getString(theSet))
	}
	
	/**
	 * Returns a localized string for a given id.
	 *
	 * @param ID the id
	 * @return a localized string
	 */
	String get( String ID )
	{
		assert ID != null
		
		return property.getProperty(ID) ?: ID 
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
}
