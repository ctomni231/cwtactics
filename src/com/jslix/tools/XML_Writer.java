package com.jslix.tools;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.AccessControlException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * A simple tool that'll hopefully be useful for writing XML files
 *
 * @author Ctomni
 */
public class XML_Writer {

    private final int TAB_SPACE = 8;
    private final int MAX_CHARS = 70;
    private String data;
    private String filePath;
    private String filename;
    private ArrayList<String> curTag;
    private boolean open;
    private int character;

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
        character = 0;
    }
    
    /**
     * If XML tag is open, you can write a complete XML Tag with
     * contents here. If not, writes text directly to the file,
     * non-XML formatted. It will not be tracked by the XML_Writer
     * if XML tags are written.
     * @param text The data to be written
     */
    public void addContent(String text){
        if(open){
            data += ">"+text+"</"+curTag.remove(0)+">\r\n";
            open = false;
        }else
            data += text+"\r\n";
    }

    /**
     * Creates an entity for XML content. Useful for XML Tag contents.
     * @param entityName The name of this entity
     * @param content The content of this entity
     * @return The reference to be used for this entity
     */
    public String addEntity(String entityName, String content){
        if(open)    closeXMLTag();

        if(!content.startsWith("\""))
            content = "\""+content;
        if(!content.endsWith("\""))
            content += "\"";

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<!ENTITY "+entityName+" "+content+">";
        return "&"+entityName+";";
    }
    
    /**
     * Adds a regular tag with no parameters to the XML file. Causes
     * you to move up one level.
     * @param tag The tag reference text
     */
    public void addXMLTag(String tagText){
        if(open)    closeXMLTag();

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<"+tagText;
        curTag.add(0, tagText);
        open = true;
    }

    /**
     * Adds a regular tag with key = Tag and value = content; it closes
     * the tag afterward for no level change.
     * @param tag The tag reference text
     */
    public void addXMLTag(HashMap<String, String> data){
        if(data == null)    return;
        if(!data.isEmpty()){
            for(String key : data.keySet()){
                addXMLTag(key);
                addContent(data.get(key));
            }
        }
    }

    /**
     * Adds a space between this tag and the next one.
     */
    public void addBlankLine(){
        data += "\r\n";
    }
    
    /**
     * Adds a regular comment to the XML file. No level movement.
     * @param tag The tag reference text
     */
    public void addXMLComment(String text){
        if(open)  closeXMLTag();

        for(int i = 0; i < curTag.size(); i++)
            data += "\t";
        data += "<!-- "+text+" -->\r\n";
    }
    
    /**
     * This adds a attribute to a current open tag. As long as end
     * is false, you may add as many attributes to a tag as you want.
     * @param key The key of the attribute
     * @param value The value of the attribute
     * @param endTag Whether to leave the tag open(true) or not(false)
     */
    public void addAttribute(String key, String value, boolean endTag){
        //Encloses value in quotes, if you haven't already
        if(!value.startsWith("\""))
            value = "\""+value;
        if(!value.endsWith("\""))
            value += "\"";
        
        if(open){
            character += key.length()+value.length()+2;

            if(character > MAX_CHARS){
                addBlankLine();
                character = 0;
                for(int i = 1; i < curTag.size(); i++){
                    data += "\t";
                    character += TAB_SPACE;
                }
                for(int i = 0; i < curTag.get(0).length(); i++){
                    data += " ";
                    character += 1;
                }
                character += key.length()+value.length()+2;
            }
            
            data += " "+key+"="+value+"";

            if(endTag) endXMLTag();
        }else
            System.out.println("No open tag found! Use addXMLTag(String tag) "
                    + "to add attribute "+key+"="+value+" !");
    }

    /**
     * Adds a list of attributes to an open tag. Leaves the tag open if
     * endTag is true. Closes it if it is false.
     * @param data The list of data to add to the open XML tag
     * @param endTag Whether to leave the tag open(true) or not(false)
     */
    public void addAttribute(HashMap<String, String> data, boolean endTag){
        if(open){
            if(data == null)    return;
            if(!data.isEmpty()){
                for(String key : data.keySet())
                    addAttribute(key, data.get(key), false);
                if(endTag)  endXMLTag();
            }
        }else
            System.out.println("No open tag found! Use addXMLTag(String tag) "
                    + "to add attributes!");
    }
    
    /**
     * Closes an open tag, but does not end the tag. Causes you to
     * move up one level. (Use end tag to end a open tag.)
     */
    public void closeXMLTag(){
        if(open){
            data += ">\r\n";
            character = 0;
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
            character = 0;
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
     * Ends the tags until you reach the level specified
     * @param toLevel The level to stop ending the tags
     */
    public void endXMLTag(int toLevel){
        while(curTag.size() > toLevel)
            endXMLTag();
    }
    
    /**
     * Ends all current open tags and tag depth levels are reset to normal.
     */
    public void endAllTags(){
        endXMLTag(0);
    }

    /**
     * Gets the depth level of your nested XML tags
     * @return How deep you are in the XML tags.
     */
    public int getLevel(){
        return curTag.size();
    }

    /**
     * Gets the tag name for the depth level you specify
     * @param level The tag level
     * @return The tag name for the depth level
     */
    public String getLevelText(int level){
        if(level >= 0 && level < curTag.size())
            return curTag.get(level);
        return "";
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
        endAllTags();
        data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
    }
    
    /**
     * Writes the current XML data to a file.
     * @param overwrite Whether to overwrite an existing file(true) or
     * not(false)
     * @return true if it wrote the file
     */
    public boolean writeToFile(boolean overwrite){
        endAllTags();
        return createFile(filePath, filename, data, false, overwrite);
    }

    /**
     * Writes the current XML data to a temporary file. Gets deleted when
     * the game ends.
     * @param overwrite Whether to overwrite an existing file(true) or
     * not(false)
     * @return true if it wrote the file
     */
    public boolean writeToTempFile(boolean overwrite){
        endAllTags();
        return createFile(filePath, filename, data, true, overwrite);
    }

    /**
     * Changes the path for where the XML file is to be written
     * @param path The path where the XML file will reside
     */
    public void changePath(String path){
        if(!path.endsWith("/"))
            path += "/";
        filePath = path;
    }

    public void changeFilename(String filename){
        this.filename = filename;
    }

    private boolean createFile(String path, String filename, String data,
            boolean temp, boolean overwrite){
        File newFile = null;
        if(!path.matches("") && !path.endsWith("/"))
            path += "/";

        try {
            newFile = new File(path);
            if(newFile.mkdirs())
                System.out.println("Directories Created! "+path);
            else
                System.out.println("Directories Failed!"+path);

            newFile = new File(path+filename);
            if (newFile.createNewFile())
                System.out.println("File Created! "+path+filename);
            else{
                if(overwrite){
                    System.out.println("File Exists! "
                            + "Overwriting! "+path+filename);
                }else{
                    System.out.println("File Exists! "+path+filename);
                    return false;
                }
            }
            if(temp)    newFile.deleteOnExit();

            FileWriter newWrite = new FileWriter(newFile);
            BufferedWriter out = new BufferedWriter(newWrite);
            out.write(data);
            out.close();
            
        } catch (IOException e) {
            System.out.println("File IOException! "+path+filename);
            return false;
        } catch(AccessControlException e){
            System.out.println("Applet Active, can't Access! "+path+filename);
            return false;
        }

        return true;
    }

}
