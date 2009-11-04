package com.client.tools;

import java.awt.Component;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;
import java.net.URL;

/**
 * ImgLoader
 * A remix of ImageLoader. Gives functions in helping to load awt.Images
 * from within the .jar, on a webpage, or within a relative folder.
 *
 * @author Crecen
 */
public class ImgLoader extends Component{

    //Gets an Image from a relative file path
    public Image getFileImage(String filename){
        Toolkit tk = Toolkit.getDefaultToolkit();
        return loadImage(tk.getImage(filename));
    }

    //Gets an image from within tacticwars.jar file
    public Image getThreadResource(String filename){
        return getURLImage(Thread.currentThread().
                getContextClassLoader().getResource(filename));
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
