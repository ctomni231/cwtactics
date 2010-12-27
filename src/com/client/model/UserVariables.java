package com.client.model;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 26.12.2010
 */
public class UserVariables
{

    // singleton instance
    private static final UserVariables INSTANCE = new UserVariables();

    //private int[]

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static UserVariables getInstance()
    {
        return UserVariables.INSTANCE;
    }

 }
