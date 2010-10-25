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
 * FileFind.java
 *
 * A simple remix of FileManager. This class looks for files in the
 * current directory, then stores them into an array of FileIndex.
 * Has functions for creating files and directories.
 * Mostly Strings are used here, so be careful of memory.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.24.10
 */

public class FileFind {
    private File theFile;//Holds the temporary file for storage
    private String basePath;//BasePath of .jar
    private String thePath;//Path of directory
    private ArrayList<FileIndex> allFiles;//Holds all searched files
    private ArrayList<String> fileType;//Finds specific files
    private ArrayList<String> avoidDir;//Avoids specific directories

    /**
     * This class searches for files from the root directory.
     */
    public FileFind(){
        initialize("");
    }

    /**
     * This class searches for files from the directory you specify
     * @param directory The path to the directory
     */
    public FileFind(String directory){
        initialize(directory);
        if(!theFile.exists() || !theFile.isDirectory())
            initialize("");
    }

    /**
     * This function changes the directory path of the file search
     * @param directory The path to the directory
     * @return Whether the directory change was successful(T) or not(F)
     */
    public boolean changeDirectory(String directory){
        initialize(directory);
        if(!theFile.exists() || !theFile.isDirectory()){
            initialize("");
            return false;
        }
        return true;
    }

    /**
     * This function gets the root path of the directory
     * @return The String value representing the root path
     */
    public String getRootPath(){
        return (thePath.replace('\\','/')+"/");
    }

    /**
     * This function gets the root path of the current .jar used
     * @return The String value representing the root path
     */
    public String getBasePath(){
        return (basePath.replace('\\','/')+"/");
    }

    /**
     * This function adds a specific file type to look for while searching.
     * You can add as many file types as you want to narrow your search.
     * @param suffix The suffix of the file path to look for (case sensitive)
     */
    public void addForceType(String suffix){
        if(suffix.startsWith("."))
            suffix = suffix.substring(1);
        if(!suffix.matches(""))
            fileType.add(suffix);
    }

    /**
     * This function adds a directory type to avoid while searching for
     * files. You can add as many directories as you want for faster
     * search speeds
     * @param directory The directory to avoid
     */
    public void addAvoidDir(String directory){
        if(!directory.matches(""))
            avoidDir.add(directory);
    }

    /**
     * This function returns a list of files after a search refactor()
     * has been called
     * @return The list of searched file paths
     */
    public ArrayList<FileIndex> getAllFiles(){
        return allFiles;
    }

    /**
     * This function searches all files recursively from the directory
     * path specified and puts them into a list.
     */
    public void refactor(){
        allFiles.clear();
        try{
            getFiles(thePath);
        }catch(AccessControlException ex){
            System.err.println(ex);
        }
    }

    /**
     * This function is used for reading files from the directory specified
     * and compiling it into a list.
     * @param path The path to the file
     * @throws AccessControlException Thrown if file can't be read
     */
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

    /**
     * This function checks to see if a file suffix matches any of the stored
     * suffixes
     * @param hold The index to check validity
     * @return If the held file matches any suffixes stored(T) or not(F)
     */
    private boolean matchSuffix(FileIndex hold){
        for(String type: fileType){
            if(type.matches(hold.suffix))   return true;
        }
        return fileType.isEmpty();
    }

    /**
     * This function checks to see if a file matches any of the directories
     * stored
     * @param dir The current directory holder
     * @return If the held directory matches this one(F) or not(T)
     */
    private boolean matchDir(String dir){
        for(String avoid: avoidDir){
            if(dir.matches(avoid))          return false;
        }
        return true;
    }

    /**
     * This function is used for loading files from the user directory
     * @param filename The path to the file
     * @return A file representing the file name path
     */
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

    /**
     * This function gets a file from a URL string referencing the home
     * library (for applets)
     * @param filename The path to the file
     * @return A file representing the file name path
     */
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

    /**
     * This function gets a file directly from the .jar resource
     * @param filename The path to the file
     * @return A file representing the file name path
     */
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

    /**
     * This function is used to create a file to the user directory.
     * @param path The path to creation directory
     * @param filename The name of the file to be created
     * @param data The data associated with the file
     * @param temp Whether this file deletes on close(T) or not(F)
     * @return Whether the operation was successful(T) or not(F)
     */
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

    /**
     * This function is used to delete a file from the user directory
     * @param path The path to deletion directory
     * @param filename The name of the file to be deleted
     */
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

    /**
     * This function is used to create a directory for the user
     * @param folder The path to the creation directory
     * @param hide Whether this directory is hidden(T) or not(F)
     */
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

    /**
     * This function is used for making a group of directories for the user
     * @param path The path to the creation directory
     */
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

    /**
     * This function hides a directory for Windows based machines
     * @param folder The path to the hidden directory
     */
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

    /**
     * This function initializes all the variables used in the class
     * @param directory The path to the search directory
     */
    private void initialize(String directory){
        try{
            basePath = new File("").getAbsolutePath();
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