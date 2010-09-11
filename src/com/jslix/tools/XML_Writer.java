package com.jslix.tools;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.AccessControlException;
import java.util.ArrayList;

/**
 * A simple tool that'll hopefully be useful for writing XML files
 *
 * @author Ctomni
 */
public class XML_Writer {

    private String data;
    private String filePath;
    private String filename;
    private ArrayList<String> curTag;
    private boolean open;
    private boolean parameter;
    /**
     * Writes an XML file in the current directory. If the directory
     * doesn't exist, it'll attempt to create it.
     * @param dirPath The directory this XML file will be created in
     * @param filename The name of the XML file
     */
    public XML_Writer(String path, String filename){
        data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
        if(!path.matches("") && !path.endsWith("/"))
            path += "/";
        filePath = path;
        if(!filename.endsWith(".xml"))
            filename += ".xml";
        this.filename = filename;
        curTag = new ArrayList<String>();
        open = false;
        parameter = false;
    }
    
    /**
     * Writes text directly to the file, non-XML formatted
     * @param text The data to be written
     */
    public void addText(String text){
        data += text+"\r\n";
    }
    
    /**
     * Adds a regular tag with no parameters to the XML file. Causes
     * you to move up one level.
     * @param tag The tag reference text
     */
    public void addXMLTag(String tagText){
        if(open){
            System.out.println("Warning: Auto closing tag!");
            endXMLTag();
        }

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<"+tagText+">\r\n";
        curTag.add(0, tagText);
    }

    /**
     * Adds a space between this tag and the next one.
     */
    public void nextLine(){
        data += "\r\n";
    }
    
    /**
     * Adds a regular comment to the XML file. No level movement.
     * @param tag The tag reference text
     */
    public void addXMLComment(String text){
        if(open){
            System.out.println("Warning: Auto closing tag!");
            endXMLTag();
        }

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<!-- "+text+" -->\r\n";
    }
    
    /**
     * Creates an open ended tag so you can add parameters to it.
     * Can only add an open tag if one isn't open already. No
     * level move.
     * @param tagText The tag reference text
     */
    public void addOpenXMLTag(String tagText){
        if(open){
            System.out.println("Warning: Auto closing tag!");
            endXMLTag();
        }

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<"+tagText;
        curTag.add(0, tagText);
        parameter = false;
        open = true;
    } 
    
    /**
     * This adds a attribute to a current open tag. You can add as many
     * attributes to a tag as you want. No level move.
     * @param key The key of the attribute
     * @param value The value of the attribute
     */
    public void addAttribute(String key, String value){
        //Encloses value in quotes, if you haven't already
        if(!value.startsWith("\""))
            value = "\""+value;
        if(!value.endsWith("\""))
            value += "\"";
        
        if(open){
            if(parameter){
                nextLine();
                for(int i = 1; i < curTag.size(); i++)
                    data += "\t";
                for(int i = 0; i < curTag.get(0).length(); i++)
                    data += " ";
                data += " "+key+"="+value+"";
            }else{
                data += " "+key+"="+value+"";
                parameter = true;
            }
        }else{
            System.out.println("No open tag found! Use addOpenXMLTag() to "
                    + "set attributes!");
        }
    }
    
    /**
     * Closes an open tag, but does not end the tag. Causes you to
     * move up one level. 
     * (Use end tag to end a open tag.)
     */
    public void closeXMLTag(){
        if(open){
            data += ">\r\n";
            open = false;
        }
    }
    
    /**
     * Ends the current tag. Moves you down one level.
     * @return The last tag entry, empty String if there are no previous
     */
    public String endXMLTag(){
        if(open){
            data += " />\r\n";
            open = false;
            return curTag.remove(0);
        }else if(!curTag.isEmpty()){
            String temp = curTag.remove(0);
            for(int i = 0; i < curTag.size(); i++)
                data += "\t";
            data += "</"+temp+">\r\n";
            return temp;
        }
        return "";
    }
    
    /**
     * Ends all current open tags and tag levels.
     */
    public void endAllTags(){
        while(!curTag.isEmpty())
            endXMLTag();
    }
    
    /**
     * Prints out the entire XML file for display
     */
    public void print(){
        System.out.println(data);
    }
    
    /**
     * Starts the XML writing process all over again
     */
    public void resetXMLFile(){
        data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
    }
    
    /**
     * Writes the current XML data to a file.
     * @return true if it wrote the file
     */
    public boolean writeToFile(){
        return createFile(filePath, filename, data, false);
    }

    public void changePath(String path){
        if(!path.endsWith("/"))
            path += "/";
        filePath = path;
    }

    public void changeFilename(String filename){
        this.filename = filename;
    }

    private boolean createFile(String path, String filename, String data,
            boolean temp){
        File newFile = null;
        if(!path.matches("") && !path.endsWith("/"))
            path += "/";

        try {
            newFile = new File(path+filename);
            if (newFile.createNewFile())
                System.out.println("File Created! "+path+filename);
            else{
                System.out.println("File Exists! Overwriting! "+path+filename);
                //To stop it from overwriting old data.
                //return false;
            }
            if(temp)    newFile.deleteOnExit();

            FileWriter newWrite = new FileWriter(newFile);
            BufferedWriter out = new BufferedWriter(newWrite);
            out.write(data);
            out.close();
            
        } catch (IOException e) {
            System.out.println("File IOException! "+path+filename);
            return false;
        } catch(AccessControlException ex){
            System.out.println("Applet Active, can't Access! "+path+filename);
            return false;
        }

        return true;
    }

}
