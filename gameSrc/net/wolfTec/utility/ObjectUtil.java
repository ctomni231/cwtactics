package net.wolfTec.utility;

public abstract class ObjectUtil {
    public static boolean notEmpty(String str) {
        return str != null && str.length() > 0;
    }
}
