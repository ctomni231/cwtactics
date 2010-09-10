package com.jslix.tools;

/**
 * A remix of FileHolder. This class will simplify a file to its
 * resourcePath.
 * @author Crecen
 */
public class FileIndex {
    public String fname;//Filename
    public String fpath;//Filepath
    public String bpath;//Basepath
    public String prefix;
    public String suffix;
    public boolean isDirectory;

    public FileIndex(String filename, String filepath, String basepath){
        reFactor(filename, filepath, basepath);
    }

    public void reFactor(String filename, String filepath, String basepath){
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
            if(prefix.matches(""))  isDirectory = true;
            suffix = filename.substring(split+1);
        }
        //outputAll();
    }

    public void outputAll(){
        System.out.println("Filename:"+fname);
        System.out.println("BasePath:"+bpath);
        System.out.println("Filepath:"+fpath);
        System.out.println("Prefix:"+prefix);
        System.out.println("Suffix:"+suffix);
        System.out.println("Directory:"+isDirectory);
    }
}
