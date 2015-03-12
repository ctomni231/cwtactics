package org.wolftec.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface StringKey {
  
  
  int minLength() default 0;

  int maxLength() default Integer.MAX_VALUE;

  String not() default "";
  
  boolean uppercase () default false;
}
