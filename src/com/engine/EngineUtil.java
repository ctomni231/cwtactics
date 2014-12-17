/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.engine;

import org.mozilla.javascript.ScriptableObject;

/**
 *
 * @author BlackCat
 */
public abstract class EngineUtil {
  
  /**
   * Casts Js Object to number.
   * 
   * @param o
   * @return 
   */
  public static Number castNumber(Object o) {
    return (Number) o;
  }

  /**
   * 
   * 
   * @param o
   * @return 
   */
  public static String castString(Object o) {
    return o.toString();
  }

  /**
   * 
   * 
   * @param o
   * @return 
   */
  public static boolean castBoolean(Object o) {
    return (Boolean) o;
  }

  /**
   * 
   * @param o
   * @param num
   * @return 
   */
  public static boolean lowerThen(Object o, double num) {
    if (o == null) {
      throw new IllegalArgumentException();
    }
    if (o instanceof Number) {
      if (o instanceof Double && ((Double) o).doubleValue() < num) {
        return true;
      } else if (o instanceof Float && ((Float) o).floatValue() < num) {
        return true;
      } else if (o instanceof Integer && ((Integer) o).intValue() < num) {
        return true;
      } else {
        throw new IllegalArgumentException();
      }
    }
    throw new IllegalArgumentException();
  }

  /**
   * 
   * @param o
   * @param num
   * @return 
   */
  public static boolean lowerEquals(Object o, double num) {
    if (o == null) {
      throw new IllegalArgumentException();
    }
    if (o instanceof Number) {
      if (o instanceof Double && ((Double) o).doubleValue() <= num) {
        return true;
      } else if (o instanceof Float && ((Float) o).floatValue() <= num) {
        return true;
      } else if (o instanceof Integer && ((Integer) o).intValue() <= num) {
        return true;
      } else {
        throw new IllegalArgumentException();
      }
    }
    throw new IllegalArgumentException();
  }

  /**
   * 
   * @param o
   * @param num
   * @return 
   */
  public static boolean greaterEquals(Object o, double num) {
    if (o == null) {
      throw new IllegalArgumentException();
    }
    if (o instanceof Number) {
      if (o instanceof Double && ((Double) o).doubleValue() >= num) {
        return true;
      } else if (o instanceof Float && ((Float) o).floatValue() >= num) {
        return true;
      } else if (o instanceof Integer && ((Integer) o).intValue() >= num) {
        return true;
      } else {
        throw new IllegalArgumentException();
      }
    }
    throw new IllegalArgumentException();
  }

  /**
   * 
   * @param o
   * @param num
   * @return 
   */
  public static boolean greaterThen(Object o, double num) {
    if (o == null) {
      throw new IllegalArgumentException();
    }
    if (o instanceof Number) {
      if (o instanceof Double && ((Double) o).doubleValue() > num) {
        return true;
      } else if (o instanceof Float && ((Float) o).floatValue() > num) {
        return true;
      } else if (o instanceof Integer && ((Integer) o).intValue() > num) {
        return true;
      } else {
        throw new IllegalArgumentException();
      }
    }
    throw new IllegalArgumentException();
  }

  /**
   * 
   * @param o
   * @param exp
   * @return 
   */
  public static boolean equals(Object o, Object exp) {
    if (o == null || exp == null) {
      if (o == null && exp == null) {
        return true;
      } else {
        throw new IllegalArgumentException();
      }
    }
    if (o.toString().equals(exp.toString()));
    throw new IllegalArgumentException();
  }

  /**
   * Checks if a Js object is true or not.
   * 
   * @param o
   * @return 
   */
  public static boolean isTrue(Object o) {
    if (o == null) {
      throw new IllegalArgumentException();
    }
    if (o instanceof Boolean && ((Boolean) o).equals(Boolean.TRUE)) {
      return true;
    } else if (o.toString().equalsIgnoreCase(Boolean.TRUE.toString())) {
      return true;
    }
    return false;
  }

  /**
   * 
   * @param o
   * @return 
   */
  public static boolean isFalse(Object o) {
    return !isTrue(o);
  }

  /**
   * 
   * @param o
   * @return 
   */
  public static ScriptableObject castJsObject(Object o) {
    return (ScriptableObject) o;
  }
}
