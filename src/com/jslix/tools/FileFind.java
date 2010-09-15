package com.jslix.tools;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.AccessControlException;
import java.util.ArrayList;

/**
 * A simple remix of FileManager. This class looks for files in the
 * current directory, then stores them into an array of FileIndex.
 * Has functions for creating files and directories.
 * Mostly Strings are used here, so be careful of memory.
 *
 * @author Crecen
 */
public class FileFind {
    private File theFile;
    private String basePath;//BasePath of .jar
    private String thePath;//Path of directory
    private ArrayList<FileIndex> allFiles;
    private ArrayList<String> fileType;//Find specific files
    private ArrayList<String> avoidDir;//Avoid specific directories

    //Finds the files from the root directory
    public FileFind(){
        initialize("");
    }

    //Finds files from the directory you specify
    public FileFind(String directory){
        initialize(directory);
        if(!theFile.exists() || !theFile.isDirectory())
            initialize("");
    }

    //Changes the directory so fileFinder just searches there
    public boolean changeDirectory(String directory){
        initialize(directory);
        if(!theFile.exists() || !theFile.isDirectory()){
            initialize("");
            return false;
        }
        return true;
    }

    public String getRootPath(){
        return (thePath.replace('\\','/')+"/");
    }

    public String getBasePath(){
        return (thePath.replace('\\','/')+"/");
    }

    //This forces the file finder to only find files of a certain suffix
    public void addForceType(String suffix){
        if(suffix.startsWith("."))
            suffix = suffix.substring(1);
        if(!suffix.matches(""))
            fileType.add(suffix);
    }

    //This cause the file finder to avoid certain directories
    public void addAvoidDir(String directory){
        if(!directory.matches(""))
            avoidDir.add(directory);
    }

    public ArrayList<FileIndex> getAllFiles(){
        return allFiles;
    }

    public void refactor(){
        allFiles.clear();
        try{
            getFiles(thePath);
        }catch(AccessControlException ex){
            System.err.println(ex);
        }
    }

    private void getFiles(String path) throws AccessControlException{
        File temp = new File(path);
        String[] tempfile = temp.list();
        FileIndex holdtemp;
        for(int i = 0; i < tempfile.length; ++i){
            holdtemp = new FileIndex(tempfile[i], path, basePath);
            if(matchSuffix(holdtemp))
                allFiles.add(holdtemp);
            if(matchDir(tempfile[i])){
                temp = new File(path+"/"+tempfile[i]);
                if(temp.isDirectory())
                    getFiles(temp.getAbsolutePath());
            }
        }
    }

    private boolean matchSuffix(FileIndex hold){
        for(String type: fileType){
            if(type.matches(hold.suffix))   return true;
        }
        return fileType.isEmpty();
    }

    private boolean matchDir(String dir){
        for(String avoid: avoidDir){
            if(dir.matches(avoid))          return false;
        }
        return true;
    }

    //Gets a File from the user home directory
    public File getFile(String filename){
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
    public File getClassFile(String filename){
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

    //Gets a file directly from the .jar resource
    public File getResourceFile(String filename){
        File newFile = null;

        URL tempURL = Thread.currentThread().getContextClassLoader()
            .getResource(filename);
        if(tempURL != null){
            try {
                newFile = new File(tempURL.toURI());
            } catch (URISyntaxException ex) {
                System.err.println(ex);
            }
        }

        return newFile;
    }

    public boolean createFile(String path, String filename, String data,
            boolean temp){
        File newFile = null;
        if(!path.endsWith("/"))
            path += "/";

        try {
            newFile = new File(path+filename);
            if (newFile.createNewFile())
                System.out.println("File Created! "+path+filename);
            else{
                System.out.println("File Exists! "+path+filename);
                return false;
            }
            if(temp)    newFile.deleteOnExit();

        } catch (IOException e) {
            System.out.println("File IOException! "+path+filename);
            return false;
        } catch(AccessControlException ex){
            System.out.println("Applet Active, can't Access! "+path+filename);
            return false;
        }

        try {
            FileWriter newWrite = new FileWriter(newFile);
            newWrite.write(data);
        } catch (IOException e) {
            System.out.println("Can't Write to File! "+path+filename);
            return false;
        } catch(AccessControlException ex){
            System.err.println(ex);
            return false;
        }
        return true;
    }

    public void deleteFile(String path, String filename){
        File newFile = null;
        if(!path.endsWith("/"))
            path += "/";

        newFile = new File(path+filename);
        if (newFile.delete())
            System.out.println("File Deleted! "+path+filename);
        else
            System.out.println("Failed to Delete File! "+path+filename);
    }

    public void makeDirectory(String folder, boolean hide){
        if(hide && folder.charAt(0) != '.')
            folder = "."+folder;

        try{
            File newFile = new File(folder);

            if(newFile.mkdir()){
                System.out.println("Directory Created! "+folder);
                if(hide && !newFile.isHidden())
                    hideDirectory(folder);
            }else{
                System.out.println("Directory Failed! "+folder);
            }
        } catch(AccessControlException ex){
            System.err.println(ex);
        }
    }

    public void makeDirectories(String path){
        try{
            File newFile = new File(path);

            if(newFile.mkdirs())
                System.out.println("Directories Created! "+path);
            else
                System.out.println("Directories Failed!"+path);
        } catch(AccessControlException ex){
            System.err.println(ex);
        }

    }

    private void hideDirectory(String folder){
        String dosCommand = "cmd /c attrib +h "+
                folder.replace("/", "")+" /s /d";
        try {
            Process process = Runtime.getRuntime().exec(dosCommand);
            InputStream in = process.getInputStream();
            int ch;
            while((ch = in.read()) != -1)
                System.out.print((char)ch);
        } catch (IOException e) {
            System.out.println("Hidden attribute failed!!");
        }
    }

    private void initialize(String directory){
        try{
            theFile = new File("");
            basePath = theFile.getAbsolutePath();
            theFile = new File(directory);
            thePath = theFile.getAbsolutePath();
        }catch(AccessControlException ex){
            System.err.println(ex);
        }

        allFiles = new ArrayList<FileIndex>();
        fileType = new ArrayList<String>();
        avoidDir = new ArrayList<String>();
    }
}