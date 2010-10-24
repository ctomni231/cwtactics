package com.jslix.tools;

import java.awt.Component;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;
import java.net.URL;
import java.security.AccessControlException;

/**
 * ImgLoader.java
 *
 * A remix of ImageLoader. Gives functions in helping to load awtImages
 * from within the .jar, on a web page, or within a relative folder.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 * @todo TODO Finish commenting this class
 */

public class ImgLoader extends Component{
	
    private static final long serialVersionUID = 2452945053572843636L;

    //Gets an Image from a relative file path
    public Image getFileImage(String filename){
        try{
            Toolkit tk = Toolkit.getDefaultToolkit();
            return loadImage(tk.getImage(filename));
        }catch(AccessControlException ex){
            System.err.println(ex);
            return getClassResource(filename);
        }
    }

    //Gets an image from within tacticwars.jar file
    public Image getThreadResource(String filename){
        return getURLImage(Thread.currentThread().
                getContextClassLoader().getResource(filename));
    }

    //Gets an image for applets mostly, works like getting a thread resource
    public Image getClassResource(String filename){
        return getURLImage(getClass().getResource("/"+filename));
    }

    //Gets an image from an website
    public Image getURLImage (String urlstring){
        try{
            return getURLImage(new URL(urlstring));
        } catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    //Gets an image from an URL location
    public Image getURLImage(URL url){
        URL imgURL = url;
        Toolkit tk = Toolkit.getDefaultToolkit();
        return (imgURL == null) ? null : loadImage(tk.getImage(url));
    }

    //Used to make sure a full image is loaded into memory
    public Image loadImage(Image img){
        MediaTracker mt = new MediaTracker(this);
        mt.addImage(img, 1);
        try{
            mt.waitForAll();
        }catch(Exception e){
            e.printStackTrace();
        }
        return img;
    }
}
