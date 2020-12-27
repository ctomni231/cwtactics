package com.jslix.io;

/**
* FileIndex.java
*
* A remix of FileHolder. This class will simplify a file to its
* resourcePath.
*
* @author Carr, Crecen
* @license Look into "LICENSE" file for further information
* @version 04.29.14
*/

public class FileIndex {

	/** The filename of this particular file */
    public String fname;
    /** The path to this file */
    public String fpath;
    /** The base path to this file's directory */
    public String bpath;
    /** The current name of this file */
    public String prefix;
    /** The current attribute file */
    public String suffix;
    /** Holds if this file is a directory */
    public boolean isDirectory;

    /**
     * This class holds one file for a FileFind class. This helps in
     * finding references to files.
     * @param filename The name of the file
     * @param filepath The path to the file
     * @param basepath The path to the file's base directory
     */
    public FileIndex(String filename, String filepath, String basepath){
        reFactor(filename, filepath, basepath);
    }

    /**
     * This class takes the information from the file and organizes it
     * among the different variables
     * @param filename The name of the file
     * @param filepath The path to the file
     * @param basepath The path to the file's base directory
     */
    protected final void reFactor(String filename,
            String filepath, String basepath){
        fname = filename;

        fpath = filepath.replace('\\','/');
        bpath = basepath.replace('\\','/');

        fpath = fpath.substring(bpath.length());
        if(fpath.startsWith("/"))   fpath = fpath.substring(1);
        fpath = fpath+"/"+fname;

        int split = filename.indexOf('.');
        isDirectory = (split == -1);
        if(isDirectory){
            prefix = filename;
            suffix = "";
        }else{
            prefix = filename.substring(0, split);
            if(prefix.equals(""))  isDirectory = true;
            suffix = filename.substring(split+1);
        }
        //System.out.println(toString());
    }

    /**
     * This function writes the information to the console window of one
     * file.
     */
    @Override
    public String toString(){
        return String.format("%s: %s, %s: %s, %s: %s, %s: %s, %s: %s, %s: %s",
                "Filename", fname, "BasePath", bpath, "FilePath", fpath,
                "Prefix", prefix, "Suffix", suffix,
                "isDirectory", isDirectory);
    }
}
