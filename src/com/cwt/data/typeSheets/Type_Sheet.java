package com.cwt.data.typeSheets;

import java.util.HashSet;

/**
 * Type sheet class with basic members for every type sheet class.
 * Setters of this class are package scoped to prevent modification
 * of the type sheet from outside of the typeSheet package.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.12.2010
 */
public abstract class Type_Sheet
{
    private HashSet<String> tags;
    private String nameID;
    
    public Type_Sheet()
    {
        tags = new HashSet<String>();
    }

    /**
     * Adds a tag string to the tag set.
     *
     * @param tag tag string
     */
    final void addTAG( String tag )
    {
        assert tag != null;
        assert tag.length() > 0;
        assert !tags.contains(tag);

        tags.add(tag);
    }

    /**
     * Checks the existence of a tag string in the tag set of this type.
     *
     * @param tag tag string
     * @return true if exist, else not
     */
    public final boolean hasTAG( String tag )
    {
        assert tag != null;

        return tag.contains(tag);
    }

    /**
     * Removes a tag string from the tag set.
     *
     * @param tag tag string
     */
    public final void removeTAG( String tag )
    {
        assert tag != null;
        assert tags.contains(tag);

        tags.remove(tag);
    }

    /**
     * @return the nameID
     */
    public final String getNameID()
    {
        return nameID;
    }

    /**
     * @param nameID the nameID to set
     */
    final void setNameID(String nameID)
    {
        assert nameID != null;
        assert nameID.length() > 0;
        
        this.nameID = nameID;
    }
}
