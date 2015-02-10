package org.wolfTec.cwt.utility.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD) @Retention(RetentionPolicy.RUNTIME) public @interface IntValue {
  int max () default 0;
  int min () default 0;
  int minLength () default 0;
  int maxLength () default 0;
  int[] not () default {};
}
