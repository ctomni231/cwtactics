package com.cwt.system.jslix;

/**
 * NativeLoader.java
 *
 * This class is used to load the native libraries needed for Slick within
 * the system. This class allows it to be easier to package the system.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.24.11
 */
public class NativeLoader {

    public final String OS = System.getProperty("os.name");
    public final String DIR = "lib/native/";

    public boolean loadNatives(){
        if(OS.startsWith("Windows")){
            System.loadLibrary(DIR+"natives-win32/OpenAL32");
            System.loadLibrary(DIR+"natives-win32/lwjgl");
            System.loadLibrary(DIR+"natives-win32/jinput-raw");
            System.loadLibrary(DIR+"natives-win32/jinput-dx8");
        }else if(OS.startsWith("Linux")){
            System.loadLibrary(DIR+"natives-linux/libopenal");
            System.loadLibrary(DIR+"natives-linux/liblwjgl");
            System.loadLibrary(DIR+"natives-linux/liblwjgl64");
            System.loadLibrary(DIR+"natives-linux/libjinput-linux");
            System.loadLibrary(DIR+"natives-linux/libjinput-linux64");
        }else if(OS.startsWith("Mac")){
            System.loadLibrary(DIR+"natives-linux/openal");
            System.loadLibrary(DIR+"natives-linux/liblwjgl");
            System.loadLibrary(DIR+"natives-linux/libjinput-osx");
        }else
            return false;

        return true;
    }
}
