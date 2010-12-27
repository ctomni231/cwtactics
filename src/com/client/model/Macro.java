package com.client.model;

/**
 * A Macro is a script set, it contains conditions and actions.
 * Conditions are optional, if no condition exists, the actions of
 * the macro will done with the binded event. 
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010numbers
 */
public class Macro
{
    // 1. dimension => OR , 2.dimension => AND , 3. dimension => condition
    private int[][][] conditions;
    private int[][] actions;

}
