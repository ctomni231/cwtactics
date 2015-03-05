package org.wolfTec.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface StringValue {

  int length() default -1;
  int minLength() default -1;
  int maxLength() default -1;

  String not() default "";
  
  String startsWith() default "";

  boolean canBeEmpty() default false;

  boolean uppercase () default false;
  boolean lowercase () default false;
}
