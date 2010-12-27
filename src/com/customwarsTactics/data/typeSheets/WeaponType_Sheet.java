package com.customwarsTactics.data.typeSheets;

import com.customwarsTactics.data.FireBehaviour;
import com.customwarsTactics.data.FireType;
import java.util.HashSet;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class WeaponType_Sheet extends Type_Sheet
{
    private int maxRange;
    private int minRange;
    private int usesAmmo;
    private FireType fireMode;
    private FireBehaviour fireBehaviour;
    private HashSet<ArmorClass> attackAble;
}
