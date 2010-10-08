@Typed
package cwt_repo_tapsi.service.languageSupport

import java.io.File;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.AccessControlException;
import java.util.ResourceBundle;

/**
 * Dictionary class that loads localized strings from a file.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class DictionaryService extends ClassLoader
{

	private ResourceBundle lang;
		
	DictionaryService( String fileName )
	{
		lang = ResourceBundle.getBundle( fileName , java.util.Locale.getDefault(), this  )
	}
	
	/**
	 * Returns a localized string for a given id.
	 *
	 * @param ID the id
	 * @return a localized string
	 */
	String get( String ID )
	{
		assert lang != null
		assert ID != null
		
		return lang.getString(ID) ?: "N/A" 
	}
	
	@Override
	protected URL findResource(String name) {
	  File f = getFile(name);

	  try {
		return f.toURI().toURL();
	  }
	  catch (MalformedURLException e) {
	  }
	  return super.findResource(name);
	}
	
	//Gets a File from the user home directory
	private File getFile(String filename){
		File newFile = null;

		try{
			newFile = new File(filename);
		}catch(AccessControlException ex){
			System.err.println(ex);
			newFile = getClassFile(filename);
		}

		return newFile;
	}

	//Gets a file from a url string referencing the home library (applets)
	private File getClassFile(String filename){
		File newFile = null;

		URL tempURL = getClass().getResource("/"+filename);
		if(tempURL != null){
			try {
				newFile = new File(tempURL.toURI());
			} catch (URISyntaxException ex) {
				System.err.println(ex);
			}
		}

		return newFile;
	}
}
